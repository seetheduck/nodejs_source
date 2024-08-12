import express from 'express';
import session from 'express-session';  // 세션 모듈
import bodyParser from 'body-parser';   // 요청 본문 파싱용
import path from 'path';    // 경로 조작
import { fileURLToPath } from 'url';    // url을 파일 경로로 바꿔줌

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// bodyParser.urlencoded() 미들웨어 설정()
app.use(bodyParser.urlencoded({extended:true}));    // 데이터 파싱 방법 결정

// session 미들웨어 설정()
app.use(session({
    secret:'secret-key',    // 세션 암호화를 위한 비밀 키 설정
    resave:false,   // 세션이 수정되지 않은 경우에도 세션을 다시 설정 유무
    saveUninitialized:true, // 초기화 되지 않은 세션 저장 여부
    cookie:{maxAge:30 * 60 * 1000}, // 세션 유효시간    
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const author = {
    id:'kor',
    password:'111',
}

app.get('/', (req, res) => {    // root로 접속하면
    res.sendFile(path.join(__dirname, 'login.html'));   // 로그인 페이지 호출
})

app.post('/login', (req, res) => {    // root로 접속하면
    const {id, password} = req.body;

    if(id === author.id && password === author.password){
        req.session.user = id;  // 세션에 사용자 id 저장(30분간 유효)
        res.redirect('/main');
    }else{
        res.send('로그인 실패 <a href="/">홈으로</a>');
    }
});

app.get('/main', (req, res) => {
    // 사용자가 로그인 한 경우에 main.ejs 호출
    if(req.session.user) {
        res.render('main', {sessionID:req.sessionID});
    }else{
        res.send('접근 권한 없음 <a href="/">로그인</a>');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/main');
        }
        // 세션 삭제가 성공하면 쿠키 삭제 후 리디렉션
        res.clearCookie('connect.sid'); // 세션 쿠키 삭제
        res.redirect('/'); // 홈으로 리디렉션
    });
});


app.listen(PORT, () => {
    console.log(`http://localhost:${PORT} 로 서비스 시작`);
});
