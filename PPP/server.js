const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cors = require('cors');
const redis = require('redis');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Oracle DB 연결 설정
const dbConfig = {
    user: 'PPP',
    password: 'PPP',
    connectString: 'localhost:1521/XE'
};

// Redis 클라이언트 설정
const redisClient = redis.createClient();

// Redis 연결 오류 처리
redisClient.on('error', (err) => {
    console.error('Redis 오류:', err);
});

// Nodemailer 설정
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'suleehk@gmail.com',
        pass: 'dujy aizq nbhw xuut'  // 환경 변수로 변경하는 것이 좋습니다
    }
});

// 인증코드 생성 함수
function generateRandomToken(length) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}

// 비밀번호 재설정 요청 엔드포인트
app.post('/api/request-password-reset', async (req, res) => {
    console.log('Request received for password reset:', req.body);  // 요청이 서버에 도달했는지 확인

    const { userid, email } = req.body;

    try {
        // DB 연결 및 쿼리 실행
        const connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT U_ID FROM USERS WHERE U_ID = :userid AND EMAIL = :email`,
            [userid, email]
        );
        console.log('Database query result:', result.rows);  // DB 쿼리 결과 확인

        await connection.close();

        if (result.rows.length > 0) {
            const authToken = generateRandomToken(6); // 6자리 인증코드 생성
            console.log('Generated auth token:', authToken);  // 인증 코드 생성 로그

            // 인증코드를 Redis에 저장 (5분 동안 유효)
            redisClient.setex(`authToken:${email}`, 300, authToken, (err) => {
                if (err) {
                    console.error('Redis 저장 오류:', err);
                } else {
                    console.log('Auth token stored in Redis');
                }
            });

            // 인증코드를 이메일로 전송
            const mailOptions = {
                from: 'suleehk@gmail.com',
                to: email,
                subject: '비밀번호 재설정 인증코드',
                text: `안녕하세요, 요청하신 비밀번호 재설정 인증코드는 다음과 같습니다: ${authToken}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('이메일 전송 오류:', error);
                    return res.status(500).json({ success: false, message: '이메일 전송 중 오류가 발생했습니다.' });
                } else {
                    console.log('이메일 전송 성공:', info.response);
                    return res.status(200).json({ success: true, message: '인증코드가 이메일로 전송되었습니다.' });
                }
            });
        } else {
            res.status(404).json({ success: false, message: '해당 아이디와 이메일에 대한 정보를 찾을 수 없습니다.' });
        }
    } catch (err) {
        console.error('쿼리 실행 오류:', err.message);
        res.status(500).json({ error: err.message });
    }
});


// 비밀번호 해싱 함수
async function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

// 비밀번호 재설정 엔드포인트
app.post('/api/reset-password', async (req, res) => {
    const { token, newPassword, newPasswordConfirm } = req.body;

    if (newPassword !== newPasswordConfirm) {
        return res.status(400).json({ success: false, message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.' });
    }

    try {
        redisClient.get(`authToken:${req.body.email}`, async (err, storedToken) => {
            if (err) {
                console.error('Redis 조회 오류:', err);
                return res.status(500).json({ success: false, message: '인증코드 검증 중 오류가 발생했습니다.' });
            }

            if (storedToken === token) {
                // 비밀번호 해싱
                const hashedPassword = await hashPassword(newPassword);

                // 인증코드가 유효하면 비밀번호를 업데이트
                const connection = await oracledb.getConnection(dbConfig);
                await connection.execute(
                    `UPDATE USERS SET U_PW = :newPassword WHERE EMAIL = :email`,
                    { newPassword: hashedPassword, email: req.body.email },
                    { autoCommit: true }
                );
                await connection.close();

                // 인증코드 삭제
                redisClient.del(`authToken:${req.body.email}`);

                res.status(200).json({ success: true, message: '비밀번호가 성공적으로 변경되었습니다.' });
            } else {
                res.status(400).json({ success: false, message: '유효하지 않은 인증코드입니다.' });
            }
        });
    } catch (err) {
        console.error('쿼리 실행 오류:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Multer 설정
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// 파일 업로드 엔드포인트
app.post('/api/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send({ success: false, message: '파일 업로드 실패' });
    }
    res.status(200).send({ success: true, file: file.filename });
});

// 파일 다운로드 엔드포인트
app.get('/uploads/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'uploads', req.params.filename);
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send({ success: false, message: '파일을 찾을 수 없습니다.' });
        }
        res.download(filePath);
    });
});

// 문의사항 등록
app.post('/api/inquiries', upload.single('attachment'), async (req, res) => {
    const { title, description, type } = req.body;
    const attachment = req.file ? req.file.filename : null;
    const originalName = req.file ? req.file.originalname : null;

    try {
        const connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `INSERT INTO INQUIRY (INQ_ID, INQ_TITLE, INQ_TEXT, INQ_DATE, INQ_STATUS, INQ_TYPE, INQ_IMGS, INQ_IMGO) 
             VALUES (INQUIRY_SEQ.NEXTVAL, :title, :description, SYSTIMESTAMP, '접수', :type, :attachment, :originalName)`,
            [title, description, type, attachment, originalName],
            { autoCommit: true }
        );

        console.log('문의가 등록되었습니다:', result);

        await connection.close();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error('문의 제출 중 오류가 발생했습니다:', err);
        res.status(500).json({ success: false, message: '문의 제출 중 오류가 발생했습니다.', error: err.message });
    }
});

// 로그인 엔드포인트
app.post('/api/login', async (req, res) => {
    const { userid, password } = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `SELECT U_NUM, U_ID FROM USERS WHERE U_ID = :userid AND U_PW = :password`,
            [userid, password]
        );

        await connection.close();

        if (result.rows.length > 0) {
            res.status(200).json({ success: true, user: result.rows[0] });
        } else {
            res.status(401).json({ success: false, message: '로그인 실패: ID 또는 비밀번호가 잘못되었습니다.' });
        }
    } catch (err) {
        console.error('로그인 중 오류가 발생했습니다:', err);
        res.status(500).json({ success: false, message: '로그인 중 오류가 발생했습니다.', error: err.message });
    }
});

// 문의사항 목록 조회
app.get('/api/inquiries', async (req, res) => {
    const { type } = req.query;

    try {
        const connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `SELECT INQ_ID, INQ_TITLE, INQ_DATE, INQ_STATUS FROM INQUIRY WHERE INQ_TYPE = :type ORDER BY INQ_DATE DESC`,
            [type]
        );

        await connection.close();

        const inquiries = result.rows.map(row => ({
            INQ_ID: row[0],
            INQ_TITLE: row[1],
            INQ_DATE: row[2],
            INQ_STATUS: row[3]
        }));

        res.status(200).json(inquiries);
    } catch (err) {
        console.error('문의 목록 로드 중 오류가 발생했습니다:', err);
        res.status(500).json({ success: false, message: '문의 목록 로드 중 오류가 발생했습니다.', error: err.message });
    }
});

// 문의사항 상세 조회
app.get('/api/inquiries/:id', async (req, res) => {
    const inquiryId = req.params.id;

    try {
        const connection = await oracledb.getConnection(dbConfig);

        const inquiryResult = await connection.execute(
            `SELECT INQ_TITLE, INQ_TEXT, INQ_DATE, INQ_STATUS, INQ_IMGO, INQ_IMGS FROM INQUIRY WHERE INQ_ID = :id`,
            [inquiryId]
        );

        const commentsResult = await connection.execute(
            `SELECT CMT_TEXT, CMT_DATE FROM COMMENTS WHERE INQ_ID = :id ORDER BY CMT_DATE DESC`,
            [inquiryId]
        );

        await connection.close();

        res.status(200).json({
            inquiry: inquiryResult.rows.length > 0 ? {
                INQ_TITLE: inquiryResult.rows[0][0],
                INQ_TEXT: inquiryResult.rows[0][1],
                INQ_DATE: inquiryResult.rows[0][2],
                INQ_STATUS: inquiryResult.rows[0][3],
                INQ_IMGO: inquiryResult.rows[0][4],
                INQ_IMGS: inquiryResult.rows[0][5]
            } : null,
            comments: commentsResult.rows.map(row => ({
                CMT_TEXT: row[0],
                CMT_DATE: row[1]
            }))
        });
    } catch (err) {
        console.error('문의 상세 내용 로드 중 오류가 발생했습니다:', err);
        res.status(500).json({ success: false, message: '문의 상세 내용 로드 중 오류가 발생했습니다.', error: err.message });
    }
});

// 댓글 작성
app.post('/api/comments', async (req, res) => {
    const { inquiryId, text } = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `INSERT INTO COMMENTS (CMT_NUM, INQ_ID, CMT_TEXT, CMT_DATE) 
             VALUES (COMMENTS_SEQ.NEXTVAL, :inquiryId, :text, SYSTIMESTAMP)`,
            [inquiryId, text],
            { autoCommit: true }
        );

        await connection.close();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error('댓글 작성 중 오류가 발생했습니다:', err);
        res.status(500).json({ success: false, message: '댓글 작성 중 오류가 발생했습니다.', error: err.message });
    }
});

// ID 중복 확인 엔드포인트
app.post('/api/validate-userid', async (req, res) => {
    const { userid } = req.body;
    const query = `SELECT COUNT(*) AS count FROM USERS WHERE U_ID = :userid`;

    try {
        const connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(query, { userid }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        await connection.close();

        if (result.rows[0].COUNT > 0) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    } catch (err) {
        console.error('쿼리 실행 오류:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// 회원가입 엔드포인트
app.post('/api/register', async (req, res) => {
    const { userid, password, phoneNumber, email, username, birthdate, address } = req.body;
    const query = `
        INSERT INTO USERS (U_NUM, EMAIL, U_PW, U_PHONE, U_ID, U_PHOTO, U_DOJ, U_DOM, U_ADD, ADMIN, ACTIVATION, U_NAME)
        VALUES (USERS_SEQ.NEXTVAL, :email, :password, :phoneNumber, :userid, NULL, SYSTIMESTAMP, NULL, :address, 'N', 'Y', :username)
    `;

    try {
        const connection = await oracledb.getConnection(dbConfig);
        await connection.execute(query, {
            email,
            password,
            phoneNumber,
            userid,
            username,
            address
        }, { autoCommit: true });
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        console.error('쿼리 실행 오류:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// 정적 파일 제공 설정
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// 서버 시작
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
