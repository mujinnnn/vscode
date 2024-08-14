const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

try {
  oracledb.initOracleClient({ libDir: 'D:\\embeded\\instantclient_19_24' }); // 실제 경로로 바꾸세요
} catch (err) {
  console.error('Oracle Client 라이브러리 초기화 중 오류 발생:');
  console.error(err);
  process.exit(1);
}

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

// Nodemailer 설정
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'suleehk@gmail.com',
        pass: 'dujy aizq nbhw xuut'
    }
});

// 데이터베이스 연결 테스트 함수
async function run() {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log('Successfully connected to Oracle Database');
        const result = await connection.execute(`SELECT 1 FROM DUAL`);
        console.log(result.rows);
    } catch (err) {
        console.error('Error occurred:', err);
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log('Connection closed');
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}

// 회원가입 처리 엔드포인트
app.post('/api/register', async (req, res) => {
    const { userid, password, phoneNumber, email, username, address } = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);

        // 비밀번호 암호화
        console.log('비밀번호 암호화 시작');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('비밀번호 암호화 완료:', hashedPassword);

        // 사용자 정보 삽입
        console.log('사용자 정보 데이터베이스 삽입 시작');
        await connection.execute(
            `INSERT INTO USERS (U_NUM, U_ID, U_PW, U_PHONE, EMAIL, U_NAME, U_ADD, U_DOJ, ADMIN, ACTIVATION) 
            VALUES (USERS_SEQ.NEXTVAL, :userid, :hashedPassword, :phoneNumber, :email, :username, :address, SYSDATE, 'N', 'Y')`,
            { userid, hashedPassword, phoneNumber, email, username, address },
            { autoCommit: true }
        );
        console.log('사용자 정보 데이터베이스 삽입 완료');

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

        // 데이터베이스에서 사용자 정보 조회
        const result = await connection.execute(
            `SELECT U_PW FROM USERS WHERE U_ID = :userid`,
            { userid }
        );

        await connection.close();

        if (result.rows.length > 0) {
            const hashedPassword = result.rows[0][0];

            // 비밀번호 비교
            const passwordMatch = await bcrypt.compare(password, hashedPassword);

            if (passwordMatch) {
                res.status(200).json({ success: true });
            } else {
                res.status(401).json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
            }
        } else {
            res.status(404).json({ success: false, message: '해당 아이디가 존재하지 않습니다.' });
        }
    } catch (err) {
        console.error('로그인 오류:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 인증코드 생성 함수
function generateRandomToken(length) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}

// 아이디 찾기 엔드포인트
app.post('/api/find-id', async (req, res) => {
    console.log('Received a POST request to /api/find-id'); // 요청 수신 로그

    const { username, email } = req.body;
    console.log('Received data:', { username, email }); // 입력된 데이터 로그

    try {
        const connection = await oracledb.getConnection(dbConfig);
        console.log('Database connection successful'); // DB 연결 성공 로그

        const result = await connection.execute(
            `SELECT U_ID FROM USERS WHERE U_NAME = :username AND EMAIL = :email`,
            { username: username, email: email }
        );
        console.log('Query executed, result:', result.rows); // 쿼리 결과 로그

        await connection.close();
        console.log('Database connection closed'); // DB 연결 종료 로그

        if (result.rows.length > 0) {
            const userId = result.rows[0][0];
            console.log('User found:', userId); // 사용자 발견 로그
            res.status(200).json({ success: true, userId: userId });
        } else {
            console.log('No user found'); // 사용자 미발견 로그
            res.status(404).json({ success: false, message: '해당 이름과 이메일에 대한 아이디를 찾을 수 없습니다.' });
        }
    } catch (err) {
        console.error('쿼리 실행 오류:', err.message); // 쿼리 실행 중 오류 로그
        res.status(500).json({ error: err.message });
    }
});

// 비밀번호 재설정 요청 엔드포인트
app.post('/api/request-password-reset', async (req, res) => {
    console.log('Request received for /api/request-password-reset');
    const { userid, email } = req.body;
    console.log('Data received:', { userid, email });

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log('Database connection successful');

        const result = await connection.execute(
            `SELECT U_NUM FROM USERS WHERE U_ID = :userid AND EMAIL = :email`,
            { userid, email }
        );
        console.log('Query result:', result.rows);

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
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log('Database connection closed');
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
            const hashedPassword = await bcrypt.hash(newPassword, 10); // 비밀번호 암호화
            await connection.execute(
                `UPDATE USERS SET U_PW = :hashedPassword WHERE EMAIL = :email`,
                { hashedPassword, email },
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

// 애완동물 등록 API
app.post('/register-pet', async (req, res) => {
  let connection;
  console.log('Received body:', req.body);

  try {
    connection = await oracledb.getConnection(dbConfig);

    const { name, weight, height, breed, age, gender, photo, health, vaccination, introduction } = req.body;

    const breedCombined = breed.join(',');
    const type = breed[0];
    console.log('Received values:', { name, weight, height, age, breed: breedCombined, type });
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
        health: health,
        vaccination: vaccination,
        gender: gender,
        introduction: introduction
      },
      { autoCommit: true }
    );

    res.status(200).send("애완동물이 성공적으로 등록되었습니다.");
  } catch (err) {
    console.error('Database operation error:', err);
    res.status(500).send("애완동물 등록 중 오류가 발생했습니다.");
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

// 정적 파일 제공 설정
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// 서버 시작
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    run(); // 데이터베이스 연결 테스트 실행
});
