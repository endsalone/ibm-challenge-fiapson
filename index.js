
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const chat = require("./chat");
const cache = require("./cache");
const fs = require('fs');
const fileUpload = require('express-fileupload');
const cors = require('cors')

getStat = require('util').promisify(fs.stat);

console.clear();

app.use(bodyParser.json());
app.use(cors());

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

	let msg = (req.files === null) ? req.body.msg : await chat.s2t(req.files.audio);

	if (typeof msg === "undefined")
		return res.json({ error: "Mensagem / Audio não encontrado. Envie e tente novamente!" });

	let from = req.body.from;
	let to = req.body.to;
	let channel = req.body.channel;

	let key = from + '|' + to;
	console.log("Key: ", key)

	//Coletar dados de sessão do Cache
	let c = await cache.get(key)

	//Coletar texto do Watson
	let r = await chat.message(msg, c)
	
	console.log('mensagem ouvida: ', r);
	
	//Transformar texto em audio
	let arquivo = await chat.t2s(r.msg)//r.msg)

	//Coletar caminho do arquivo
	let path = arquivo.path

	//Json de resposta
	let response = {
		msg: r.msg,
		audio: null,
		sessao: r.sessao,
		intencao: r.intencao,
		origin: from,
		phone: to,
		channel: channel
	};
	//Aguardar aquivo ser criado
	await arquivo.on('finish', async function (a) {

		const filePath = path;
    const stat = await getStat(filePath);
    
    
    // informações sobre o tipo do conteúdo e o tamanho do arquivo
    res.writeHead(200, {
        'Content-Type': 'audio/ogg',
        'Content-Length': stat.size
    });

    const stream = fs.createReadStream(filePath);

    // só exibe quando terminar de enviar tudo
    stream.on('end', () => fs.unlinkSync(path));

    // faz streaming do audio 
    stream.pipe(res);

		//Coletar Buffer do Arquivo e armazenar no json
		//response.audio = path;//fs.readFileSync(path);

		//Deletar arquivo criado para não ocupar espaço
		// fs.unlinkSync(path);
		//return res.json(response);
	});
});

app.post('/test', async function (req, res) {
	file = req.files;
	console.log('body', req.body)
	console.log('file', file)
	res.json(req.body);
});

app.post('/text2speech', async function (req, res) {
	let resposta = chat.t2s("Bom dia")
	res.end("resposta");
})

app.get('/audio/:arquivo', async function (req, res) {
	let path = `audio/${req.params.arquivo}`;
	let stat = await getStat(path);

	res.writeHead(200, {
		'Content-Type': 'audio/ogg',
		'Content-Length': stat.size
	});

	const stream = fs.createReadStream(path);

	// só exibe quando terminar de enviar tudo
	stream.on('end', () => console.log('acabou'));

	// faz streaming do audio 
	stream.pipe(res);
	// res.end(path);
});

var port = process.env.PORT || 3002;

app.listen(port, async () => {
	// chat.t2s("Bom dia");
	console.log("server is running");
});