const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Oracle DB 연결 설정
const dbConfig = {
    user: 'PPP',
    password: 'PPP',
    connectString: 'localhost:1521/XE'
};

// 애완동물 등록 API
app.post('/register', upload.single('photo'), async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const { name, weight, height, type, kind, age, health, vaccination, gender, introduction } = req.body;
        let photoPath = null;

        if (req.file) {
            const photoFileName = `${Date.now()}-${req.file.originalname}`;
            const photoDestination = path.join(__dirname, 'public/uploads', photoFileName);
            fs.renameSync(req.file.path, photoDestination);
            photoPath = `/uploads/${photoFileName}`;
        }

        const result = await connection.execute(
            `INSERT INTO PET (P_NUM, P_NAME, P_WEI, P_HEI, P_TYPE, P_KIND, P_AGE, P_PHOTO, P_HS, P_VR, P_GENDER, P_ITD) 
             VALUES (PET_SEQ.NEXTVAL, :name, :weight, :height, :type, :kind, :age, :photo, :health, :vaccination, :gender, :introduction)`,
            { name, weight, height, type, kind, age, photo: photoPath, health, vaccination, gender, introduction },
            { autoCommit: true }
        );

        res.send({ message: '애완동물 등록이 완료되었습니다.', petId: result.lastRowid });

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: '애완동물 등록 중 오류가 발생했습니다.' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
