const fs = require('fs');
const express = require('express');

console.log('Staring application ...');

const urls = JSON.parse(fs.readFileSync('urls.json', 'utf-8'));

function registerCode(code, url) {
	urls[code] = url;

	console.log('register ' + code + ' --> ' + url);

	fs.writeFileSync('urls.json', JSON.stringify(urls));
}

const app = express();
const router = express.Router();

// localhost:4000/:code -> hello world!

// /register URL로 추가 요청을 받을 시 registerCode 함수를 실행하여 shortener 등록
// formData code, url 값을 받아서 등록

// /register?code=boj&url=https://www.acmicpc.net
router.get('/register', (req, res) => {
	const code = req.query.code;
	const url = req.query.url;

	registerCode(code, url);

	res.send('successfully registerd your code!');
});

// /:code 코드 입력을 받으면 등록된 URL로 redirect 해줌
router.get('/:code', (req, res) => {
	if(!(req.params.code in urls)) {
		return res.status(404).send('CODE ' + req.params.code + ' NOT FOUND!! try another code');
	}

	res.redirect(urls[req.params.code]);
});

app.use(router);

app.listen(4000, () => {
	console.log('Server successfully started! listening on port 4000');
});
