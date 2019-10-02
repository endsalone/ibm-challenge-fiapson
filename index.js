
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const chat = require("./chat");
const cache = require("./cache");
const fs = require('fs');

const speech2text = require('ibm-watson/speech-to-text/v1');

console.clear();

app.use(bodyParser.json());
app.use(bodyParser.raw({ type: 'multipart/form-data', limit: '552mb' }))
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

app.get('/', (req, res)=>{
	return res.json("OK");
})

app.post('/audio', async function (req, res) {
	console.log(req.body.file);
	// return res.json("OK");
	var buf = new Buffer.isBuffer(req.body);

	const config = {
		"apikey": "8Cg4ujjEqqDc6FxN8vZ7cUmXIpHktQYZ2DZ6nJK7sSN8",
		"iam_apikey_description": "Auto-generated for key ce31d09a-45e8-49c4-9695-968db470df3e",
		"iam_apikey_name": "Auto-generated service credentials",
		"iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Manager",
		"iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/c244d66069134bfabde25aba79ab87bb::serviceid:ServiceId-71f625b3-10d3-40b4-8a8b-2a0c2a2c453a",
		"url": "https://stream.watsonplatform.net/speech-to-text/api"
	};

	let speechToText = new speech2text({
		iam_apikey: config.apikey,
		url: config.url,
		disable_ssl_verification: true,
	});

	let params = {
		audio: req.body,
		content_type: 'audio/wav',
		model: "pt-BR_BroadbandModel",
	}

	console.log(params.audio)
	// return res.json({"msg": "OK"});
	speechToText.recognize(params)
		.then(result => {
			console.log(JSON.stringify(result, null, 2));
			return res.json(result);
		})
		.catch(err => {
			console.log('error:', err);
			return res.json({ "msg": "OK" });
		});
})
var port = process.env.PORT || 3000;

app.listen(port, async () => {
	console.log("server is running");
});