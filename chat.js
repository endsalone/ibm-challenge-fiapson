const Watson = require('ibm-watson/assistant/v2');
const speech2text = require('ibm-watson/speech-to-text/v1');
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const TextToSpeechV2 = require('watson-developer-cloud/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const fs = require('fs');
const getStat = require('util').promisify(fs.stat);

let assistant;
let session;

exports.send = async function (texto, session) {
  var response = await this.message(texto, session);

  return response;
};

exports.createSession = async () => {

  this.assistant = new Watson({
    version: "2019-02-28",
    authenticator: new IamAuthenticator({
      apikey: '0VMqKbjfF3D9V-hi18yyklFF48G1plRuz3-6D0XPxfz-',
    }),
    url: "https://gateway.watsonplatform.net/assistant/api"
  });

  var session = await this.assistant.createSession({
    assistantId: "8ba7f971-f5a3-4ef8-ba49-144dbe2276fa"
  }).then(async res => {
    return res;
  }).catch(err => {
    console.log(err);
  });

  return session;
};

exports.message = async (texto, session) => {
  let s = session.result.session_id;

  var response = await this.assistant.message({
    assistantId: "8ba7f971-f5a3-4ef8-ba49-144dbe2276fa",
    sessionId: s,
    input: { message_type: 'text', text: texto },
  }).then(res => {

    return {
      msg: res.result.output.generic[0].text,
      intencao: (typeof res.result.output.intents[0] === "undefined") ? "Confuso" : res.result.output.intents[0].intent,
      sessao: s
    };
  }).catch(err => {
    console.log(err);
  });
  return response;
}

exports.audio = async (audio) => {

  // return "req.body";
  const config = {
    "apikey": "bL140DnTUZAM6xuym0ERZrzOnW9zC3BNMMLMXT0hixij",
    "acousticCustomizationId": "5be7a6a4-6bc8-4331-9c39-2d81423957cc",
    "iam_apikey_description": "Auto-generated for key 26a24639-d405-477f-8287-169ee22adcd9",
    "iam_apikey_name": "Auto-generated service credentials",
    "iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Manager",
    "iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/f13576b1146a4f73b5e0bf903c605715::serviceid:ServiceId-3c9b1531-d304-4200-8af1-b157e79580f7",
    "url": "https://stream.watsonplatform.net/speech-to-text/api"

  };

  let speechToText = new speech2text({
    authenticator: new IamAuthenticator({
      apikey: config.apikey,
      acousticCustomizationId: config.acousticCustomizationId,
    }),
    url: config.url,
    disable_ssl_verification: true,
  });
  // return console.log(audio)
  // console.log(audio)
  let params = {
    audio: audio.data,
    contentType: audio.mimetype, //'audio/ogg',
    wordAlternativesThreshold: 0.9,
    keywords: ['colorado', 'tornado', 'tornadoes'],
    keywordsThreshold: 0.5,
    transfer_encoding: 'chunked',
    continuous: true,
    model: "pt-BR_NarrowbandModel",
  }

  return await speechToText.recognize(params)
    .then(result => {
      // console.log(JSON.stringify(result));
      return (result);
    })
    .catch(err => {
      console.log('error:', err);
      return;//{ "msg": "OK" };
    });
}


exports.s2t = async (audio) => {
  let dados = await this.audio(audio);
  console.log('Audio: ', JSON.stringify(dados.result))
  if (typeof dados === "undefined" || (dados.result.results).length == 0)
    return "Não entendi"

  return ((dados.result.results).length > 0)? dados.result.results[0].alternatives[0].transcript : 'Bla bla bla';
}

exports.t2s = async (texto) => {
  // const textToSpeech = new TextToSpeechV1({
  //   authenticator: new IamAuthenticator({
  //     apikey: 's2Qf7hjRvhtqia96Z-xuXmTnU66yj5In4wuW2KiUbAsl',
  //   }),
  //   url: 'https://stream.watsonplatform.net/text-to-speech/api',
  // });
  const textToSpeech = new TextToSpeechV2({
    iam_apikey: 'XrDQBkXgktxo9dD41pZCuyt_9kixBSckxDEtfoCr4-CE',
    url: 'https://stream.watsonplatform.net/text-to-speech/api',
  });

  const synthesizeParams = {
    text: texto,
    voice: 'pt-BR_IsabelaVoice',
    accept: 'audio/ogg; codecs=opus' // default is audio/ogg; codec=opus
  };
  fileName = `audio/result-${Math.floor(Date.now() / 1000)}.ogg`;

  return await textToSpeech.synthesize(synthesizeParams)
  .then(async res => {
    return await res.pipe(fs.createWriteStream(fileName));
  });

}

// function newFunction(res) {
//   NodeJS.Read;
//   let buf = new Buffer.from(res);
//   // let teste = res.pipe();
//   // console.log(buf);
// }
