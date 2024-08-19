const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const fs = require('fs');
const http = require('http'); // 추가
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app); // 서버 생성
const port = 5500;
const corsOptions = {
    origin: ['http://127.0.0.1:5500'], // 클라이언트에서 요청하는 정확한 출처 명시
    credentials: true, // 쿠키를 포함한 자격 증명을 허용
    optionsSuccessStatus: 200
};

oracledb.initOracleClient({ libDir: 'D:\\embeded\\instantclient_19_24' }); // Oracle Instant Client 경로 설정


const io = socketIo(server, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
    }
});

// socket.io의 클라이언트 스크립트를 제공할 경로 설정
app.use('/socket.io', express.static(path.join(__dirname, 'node_modules', 'socket.io', 'client-dist')));

// 미들웨어 설정
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    store: new FileStore({
        path: './sessions',
        retries: 1,
    }),
    secret: 'your_secret_key_1234567890',
    resave: false,
    saveUninitialized: false,
    genid: function(req) {
        return crypto.randomBytes(16).toString('hex'); // 동적으로 세션 ID 생성
    },
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax', 
    }
}));


io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', ({ room, username, bkgNum }) => {
        socket.join(room);
        console.log(`${username} joined room: ${room}`);
        io.to(room).emit('userJoined', { username });
    });

    const orderedMessages = [
        '안녕하세요!',
        '네 가능합니다',
        '그럼 거래 시작 눌러주세요ㅎㅎ',
        '좋은 하루 되세요!',
        '무엇을 도와드릴까요?'
    ];

    let lastMessageIndex = 0; // Keep track of the last sent message

    socket.on('sendMessage', (data) => {
        const { room, message, sender, profileIcon } = data;
        io.to(room).emit('receiveMessage', { message, sender, profileIcon });

        function sendResponseMessage() {
            if (lastMessageIndex < orderedMessages.length) {
                const responseMessage = orderedMessages[lastMessageIndex];
                io.to(room).emit('receiveMessage', { message: responseMessage, sender: '이수보', profileIcon: '<div class="profile-icon"></div>' });
                lastMessageIndex++;
            }
        }

        // Trigger response message 2 seconds after user sends a message
        setTimeout(sendResponseMessage, 2000);
    });

    socket.on('sendFile', (data) => {
        const { room, fileData, fileType, fileName, sender, profileIcon } = data;
        io.to(room).emit('receiveFile', { fileData, fileType, fileName, sender, profileIcon });
    });

    socket.on('leaveRoom', ({ room, username }) => {
        socket.leave(room);
        console.log(`${username} left room: ${room}`);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});




// Oracle DB 연결 설정
const dbConfig = {
    user: 'PPP',
    password: 'PPP',
    connectString: 'localhost:1521/XE'
};

// Nodemailer 설정
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'suleehk@gmail.com',
        pass: 'dujy aizq nbhw xuut'
    }
});

// Multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'public', 'uploads');
        
        // 폴더가 없는 경우 생성
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// 회원가입 처리 엔드포인트
app.post('/api/register', async (req, res) => {
    const { userid, password, phoneNumber, email, username, address } = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);

        // 사용자 정보 삽입 (비밀번호를 암호화하지 않고 그대로 저장)
        await connection.execute(
            `INSERT INTO USERS (U_NUM, U_ID, U_PW, U_PHONE, EMAIL, U_NAME, U_ADD, U_DOJ, ADMIN, ACTIVATION) 
            VALUES (USERS_SEQ.NEXTVAL, :userid, :password, :phoneNumber, :email, :username, :address, SYSDATE, 'N', 'Y')`,
            { userid, password, phoneNumber, email, username, address },
            { autoCommit: true }
        );

        await connection.close();
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('회원가입 오류:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 사용자 ID 중복 체크 엔드포인트
app.post('/api/validate-userid', async (req, res) => {
    const { userid } = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `SELECT U_ID FROM USERS WHERE U_ID = :userid`,
            { userid }
        );

        await connection.close();

        if (result.rows.length > 0) {
            res.status(200).json({ exists: true });
        } else {
            res.status(200).json({ exists: false });
        }
    } catch (err) {
        console.error('중복 확인 오류:', err.message);
        res.status(500).json({ exists: null, message: err.message });
    }
});

// 로그인 처리 엔드포인트
app.post('/api/login', async (req, res) => {
    const { userid, password } = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(`SELECT U_PW, U_NAME FROM USERS WHERE U_ID = :userid`, { userid });
        await connection.close();

        if (result.rows.length > 0) {
            const storedPassword = result.rows[0][0];
            const username = result.rows[0][1];

            if (password === storedPassword) {  // 원본 비밀번호와 그대로 비교
                req.session.user = { userid, username }; // 세션에 사용자 정보 저장
                res.status(200).json({ success: true, sessionId: req.sessionID });
            } else {
                res.status(401).json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
            }
            
        } else {
            res.status(404).json({ success: false, message: '해당 아이디가 존재하지 않습니다.' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: '로그인 중 오류가 발생했습니다.', error: err.message });
    }
});





app.get('/api/check-login', async (req, res) => {
    if (req.session.user) {
        try {
            const connection = await oracledb.getConnection(dbConfig);
            const result = await connection.execute(
                `SELECT U_NAME FROM USERS WHERE U_ID = :userid`,
                { userid: req.session.user.userid }
            );

            await connection.close();

            if (result.rows.length > 0) {
                res.json({ loggedIn: true, username: result.rows[0][0] });
            } else {
                res.json({ loggedIn: false });
            }
        } catch (err) {
            res.status(500).json({ loggedIn: false, error: err.message });
        }
    } else {
        res.json({ loggedIn: false });
    }
});






// 로그아웃 처리 경로
app.post('/api/logout', (req, res) => {
    req.session.destroy(); // 세션 파기
    res.status(200).send('로그아웃 성공'); // 로그아웃 성공 메시지 반환
});

// 인증코드 생성 함수
function generateRandomToken(length) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}

// 아이디 찾기 엔드포인트
app.post('/api/find-id', async (req, res) => {
    const { username, email } = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `SELECT U_ID FROM USERS WHERE U_NAME = :username AND EMAIL = :email`,
            { username, email }
        );

        await connection.close();

        if (result.rows.length > 0) {
            const userId = result.rows[0][0];
            res.status(200).json({ success: true, userId });
        } else {
            res.status(404).json({ success: false, message: '해당 이름과 이메일에 대한 아이디를 찾을 수 없습니다.' });
        }
    } catch (err) {
        console.error('쿼리 실행 오류:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// 비밀번호 재설정 요청 엔드포인트
app.post('/api/request-password-reset', async (req, res) => {
    const { userid, email } = req.body;

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `SELECT U_NUM FROM USERS WHERE U_ID = :userid AND EMAIL = :email`,
            { userid, email }
        );

        if (result.rows.length > 0) {
            const authToken = generateRandomToken(6); // 6자리 인증코드 생성
            const tokenExpiry = new Date(Date.now() + 300 * 1000); // 5분 후 만료

            await connection.execute(
                `UPDATE USERS SET AUTH_TOKEN = :authToken, TOKEN_EXPIRY = :tokenExpiry WHERE U_ID = :userid AND EMAIL = :email`,
                { authToken, tokenExpiry, userid, email },
                { autoCommit: true }
            );

            const mailOptions = {
                from: 'suleehk@gmail.com',
                to: email,
                subject: '비밀번호 재설정 인증코드',
                text: `안녕하세요, 요청하신 비밀번호 재설정 인증코드는 다음과 같습니다: ${authToken} 5분후 이코드는 만료됩니다.`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('이메일 전송 오류:', error);
                    return res.status(500).json({ success: false, message: '이메일 전송 중 오류가 발생했습니다.' });
                } else {
                    return res.status(200).json({ success: true, message: '인증코드가 이메일로 전송되었습니다.' });
                }
            });
        } else {
            res.status(404).json({ success: false, message: '해당 아이디와 이메일에 대한 정보를 찾을 수 없습니다.' });
        }
    } catch (err) {
        console.error('쿼리 실행 오류:', err.message);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err.message);
            }
        }
    }
});

// 비밀번호 재설정 엔드포인트
app.post('/api/reset-password', async (req, res) => {
    const { token, newPassword, email } = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);

        // 인증번호와 이메일을 기반으로 사용자 확인 및 토큰 유효성 검사
        const result = await connection.execute(
            `SELECT U_NUM FROM USERS WHERE AUTH_TOKEN = :token AND EMAIL = :email AND TOKEN_EXPIRY > SYSDATE`,
            { token, email }
        );

        if (result.rows.length > 0) {
            await connection.execute(
                `UPDATE USERS SET U_PW = :newPassword WHERE EMAIL = :email`,
                { newPassword, email },
                { autoCommit: true }
            );
            res.status(200).json({ success: true, message: '비밀번호가 성공적으로 재설정되었습니다.' });
        } else {
            res.status(400).json({ success: false, message: '인증번호가 잘못되었거나 만료되었습니다.' });
        }

        await connection.close();
    } catch (err) {
        console.error('비밀번호 재설정 중 오류:', err.message);
        res.status(500).json({ error: err.message });
    }
});


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
    try {
        const { title, description, type } = req.body;
        const attachment = req.file ? req.file.filename : null;
        const originalName = req.file ? req.file.originalname : null;
        const userId = req.body.userId;

        console.log('POST/api/inquiries 요청 데이터:', req.body);

        const connection = await oracledb.getConnection(dbConfig);

        // 사용자 이름 가져오기
        const userResult = await connection.execute(
            `SELECT U_NAME FROM USERS WHERE U_NUM = :userId`,
            [userId]
        );

        if (userResult.rows.length === 0) {
            throw new Error('해당 사용자 없음');
        }

        const userName = userResult.rows[0][0];

        // 문의 사항 삽입
        let inquiryType = '';
        switch (type) {
            case 'service':
                inquiryType = '서비스 문의';
                break;
            case 'review':
                inquiryType = '리뷰 및 평점 문의';
                break;
            case 'account':
                inquiryType = '계정 관련 문의';
                break;
            case 'report':
                inquiryType = '신고 문의';
                break;
            default:
                throw new Error('Unknown inquiry type');
        }
        
        await connection.execute(
            `INSERT INTO INQUIRY (INQ_ID, INQ_TITLE, INQ_TEXT, INQ_DATE, INQ_STATUS, INQ_TYPE, U_NAME) 
             VALUES (INQUIRY_SEQ.NEXTVAL, :title, :description, SYSTIMESTAMP, '접수', :inquiryType, :userName)`,
            [title, description, inquiryType, userName],
            { autoCommit: true }
        );
        
                

        await connection.close();
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('문의 제출 중 오류 발생:', err.message);
        res.status(500).json({ success: false, message: '문의 제출 중 오류가 발생했습니다.', error: err.message });
    }
});


// 문의사항 목록 조회
app.get('/api/inquiries', async (req, res) => {
    const { type } = req.query;

    try {
        const connection = await oracledb.getConnection(dbConfig);
        
        const query = `SELECT INQ_ID, INQ_TITLE, INQ_DATE, INQ_STATUS, U_NAME FROM INQUIRY WHERE LOWER(INQ_TYPE) = LOWER(:type) ORDER BY INQ_DATE DESC`;
        console.log('실행된 쿼리:', query);
        console.log('사용된 값:', type);

        const result = await connection.execute(query, [type]);

        console.log('쿼리 결과:', result.rows);

        await connection.close();

        const inquiries = result.rows.map(row => ({
            INQ_ID: row[0],
            INQ_TITLE: row[1],
            INQ_DATE: row[2],
            INQ_STATUS: row[3],
            U_NAME: row[4]  // U_NAME 필드 추가
        }));

        res.status(200).json(inquiries);
    } catch (err) {
        console.error('문의 목록 로드 중 오류가 발생했습니다:', err.message);
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
        console.error('문의 상세 내용 로드 중 오류가 발생했습니다:', err.message);
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
        console.error('댓글 작성 중 오류가 발생했습니다:', err.message);
        res.status(500).json({ success: false, message: '댓글 작성 중 오류가 발생했습니다.', error: err.message });
    }
});

app.get('/api/get-user-id', (req, res) => {
    if (req.session && req.session.user) {
        res.status(200).json({ userId: req.session.user.userid });
    } else {
        res.status(404).json({ error: 'User not logged in' });
    }
});

// 애완동물 등록 API
app.post('/register-pet', upload.single('photo'), async (req, res) => { // Multer 미들웨어 추가
    let connection;
    console.log('Received body:', req.body); // 요청에서 받은 데이터 확인
    console.log('Received file:', req.file); // 업로드된 파일 확인

    try {
        connection = await oracledb.getConnection(dbConfig);

        const { name, weight, height, breed, age, gender, health, vaccination, introduction } = req.body;
        const photo = req.file ? req.file.filename : null;

        const breedCombined = Array.isArray(breed) ? breed.join(',') : breed;
        const type = Array.isArray(breed) ? breed[0] : breed;

        const weightNum = parseFloat(weight);
        const heightNum = parseFloat(height);
        const ageNum = parseFloat(age);

        if (isNaN(weightNum) || isNaN(heightNum) || isNaN(ageNum)) {
            console.log('Invalid number input:', { weightNum, heightNum, ageNum });
            return res.status(400).send("유효하지 않은 숫자 입력입니다.");
        }

        const result = await connection.execute(
            `INSERT INTO PET (P_NUM, P_NAME, P_WEI, P_HEI, P_TYPE, P_KIND, P_AGE, P_PHOTO, P_HS, P_VR, P_GENDER, P_ITD)
             VALUES (PET_SEQ.NEXTVAL, :name, :weight, :height, :type, :breed, :age, :photo, :health, :vaccination, :gender, :introduction)`,
            {
                name: name,
                weight: weightNum,
                height: heightNum,
                type: type,
                breed: breedCombined,
                age: ageNum,
                photo: photo || null,
                health: health || null,
                vaccination: vaccination || null,
                gender: gender,
                introduction: introduction || null
            },
            { autoCommit: true }
        );

        res.status(200).json({ success: true, message: "애완동물이 성공적으로 등록되었습니다." });
    } catch (err) {
        console.error('Database operation error:', err);
        res.status(500).json({ success: false, message: "애완동물 등록 중 오류가 발생했습니다." });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
});

  
app.get('/api/pet-info', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log("Fetching pet info...");
        const result = await connection.execute(`SELECT P_NUM, P_NAME, P_ITD, P_PHOTO FROM PET`);

        const pets = result.rows.map(row => ({
            id: row[0],
            name: row[1],
            introduction: row[2],
            photo: row[3]
        }));

        console.log("Fetched pets:", pets);
        res.status(200).json(pets);
    } catch (err) {
        console.error('Error fetching pet info:', err);
        res.status(500).json({ error: 'Error fetching pet info' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
});


app.delete('/api/pet/:id', async (req, res) => {
    const petId = req.params.id;
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        await connection.execute(`DELETE FROM PET WHERE P_NUM = :id`, { id: petId }, { autoCommit: true });
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error deleting pet:', err);
        res.status(500).json({ error: 'Error deleting pet' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
});




//회원탈퇴
app.post('/api/withdrawal', async (req, res) => {
    const { userId } = req.body;
    console.log('Received userId:', userId); // userId 값 로그 확인

    if (userId !== 1) {
        return res.status(400).json({ success: false, message: '잘못된 사용자 ID입니다.' });
    }

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        // USERS 테이블에서 U_NUM이 1인 사용자만 삭제
        const result = await connection.execute(`DELETE FROM USERS WHERE U_NUM = :userId`, { userId });

        await connection.commit();
        console.log('Delete result:', result.rowsAffected); // 삭제 결과 확인

        res.status(200).json({ success: true, message: '회원 탈퇴가 완료되었습니다.' });
    } catch (err) {
        console.error('회원 탈퇴 처리 중 오류 발생:', err.message);
        res.status(500).json({ success: false, message: '회원 탈퇴 처리 중 오류가 발생했습니다.' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('DB 연결 종료 중 오류 발생:', err.message);
            }
        }
    }
});







// 정적 파일 제공 설정
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// 서버 시작
app.listen(5500, () => {
    console.log('서버가 http://localhost:5500 에서 실행 중입니다.');
});






