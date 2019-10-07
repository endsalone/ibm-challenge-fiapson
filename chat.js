const Watson = require('ibm-watson/assistant/v2');
const speech2text = require('ibm-watson/speech-to-text/v1');

let assistant;
let session;

exports.send = async function (texto, session) {
  var response = await this.message(texto, session);

  return response;
};

exports.createSession = async () => {


  this.assistant = new Watson({
    version: "2019-02-28",
    iam_apikey: "aKRdcmQRP0uPo9DArPF27Bz6YU8tq_Zv7EsJl7pkoGGk",
    url: "https://gateway.watsonplatform.net/assistant/api"
  });

  // return { session_id: 'e9016886-9358-4840-ad32-b083d2a88ee4' };

  var session = await this.assistant.createSession({
    assistant_id: "d2d8036d-9aed-48ae-9338-b446506a0589"
  }).then(async res => {
    return res;
  }).catch(err => {
    console.log(err);
  });

  return session;
};

exports.message = async (texto, session) => {

  var response = await this.assistant.message({
    assistant_id: "d2d8036d-9aed-48ae-9338-b446506a0589",
    session_id: session.session_id,
    input: { message_type: 'text', text: texto },
  }).then(res => {
    // console.log("chegou aqui: ", res.output.generic[0].text)

    return {
      msg: res.output.generic[0].text,
      intencao: (typeof res.output.intents[0] === "undefined") ? "Confuso" : res.output.intents[0].intent,
      sessao: session.session_id
    };
  }).catch(err => {
    console.log(err);
  });
  return response;
}

exports.audio = async (audio) => {

  // return "req.body";
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
    "audio": audio.data,
    "content_type": audio.mimetype,
    "transfer_encoding": 'chunked',
    "model": "pt-BR_BroadbandModel",
  }

  // console.log(params.audio)
  // return res.json({"msg": "OK"});
  return await speechToText.recognize(params)
    .then(result => {
      console.log(JSON.stringify(result));
      return (result);
    })
    .catch(err => {
      console.log('error:', err);
      return { "msg": "OK" };
    });
}


exports.s2t = async(audio) => {
  let dados = await this.audio(audio);
  return dados.results[0].alternatives[0].transcript
}