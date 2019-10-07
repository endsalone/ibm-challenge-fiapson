
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const chat = require("./chat");
const cache = require("./cache");
const fs = require('fs');
const fileUpload = require('express-fileupload');


console.clear();

app.use(bodyParser.json());

app.use(fileUpload({
	useTempFiles: false,
	tempFileDir: './tmp/'
}));

app.post('/msg', async function (req, res) {

	if (typeof req.body.phone == "undefined") {
		req.body.phone = null;
	}
	if (typeof req.body.origin == "undefined") {
		req.body.origin = "556296331035";
	}
	if (typeof req.body.channel == "undefined") {
		req.body.channel = "web";
	}

	let msg = req.body.msg;
	let from = req.body.from;
	let to = req.body.to;
	let channel = req.body.channel;

	let key = from + '|' + to;
	console.log("Key: ", key)

	//Coletar dados de sessão do Cache
	let c = await cache.get(key)

	//Coletar texto do Watson
	let r = await chat.message(msg, c)

	return res.json({
		msg: r.msg,
		sessao: r.sessao,
		intencao: r.intencao,
		origin: from,
		phone: to,
		channel: channel
	})
})

app.get('/', (req, res) => {
	return res.json("OK");
})

app.post('/audio', async function (req, res) {



	if (typeof req.body.phone == "undefined") {
		req.body.phone = null;
	}
	if (typeof req.body.origin == "undefined") {
		req.body.origin = "556296331035";
	}
	if (typeof req.body.channel == "undefined") {
		req.body.channel = "web";
	}


	let msg = (req.files === null)? req.body.msg : await chat.s2t(req.files.audio);

	if(typeof msg === "undefined")
		return res.json({error: "Mensagem / Audio não encontrado. Envie e tente novamente!"});

	let from = req.body.from;
	let to = req.body.to;
	let channel = req.body.channel;

	let key = from + '|' + to;
	console.log("Key: ", key)

	//Coletar dados de sessão do Cache
	let c = await cache.get(key)

	//Coletar texto do Watson
	let r = await chat.message(msg, c)

	return res.json({
		msg: r.msg,
		sessao: r.sessao,
		intencao: r.intencao,
		origin: from,
		phone: to,
		channel: channel
	})
	return res.json(resposta);
});

app.post('/test', async function (req, res) {
	file = req.files;
	console.log('body', req.body)
	console.log('file', file)
	res.end(file);
});

var port = process.env.PORT || 3000;

app.listen(3000, async () => {
	console.log("server is running");
});