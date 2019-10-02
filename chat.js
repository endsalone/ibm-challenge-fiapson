const Watson = require('ibm-watson/assistant/v2');
let assistant;
let session;

exports.send = async function(texto, session){
  var response = await this.message(texto, session);

  return response;
};

exports.createSession = async() => {

  
  this.assistant = new Watson({
    version: "2019-02-28",
    iam_apikey: "aKRdcmQRP0uPo9DArPF27Bz6YU8tq_Zv7EsJl7pkoGGk",
    url: "https://gateway.watsonplatform.net/assistant/api"
  });
  
  // return { session_id: 'e9016886-9358-4840-ad32-b083d2a88ee4' };

  var session = await this.assistant.createSession({
    assistant_id: "d2d8036d-9aed-48ae-9338-b446506a0589"
  }).then(async res=>{
    return res;
  }).catch(err => {
    console.log(err);
  });

  return session;
};

exports.message = async (texto, session)=>{

  var response = await this.assistant.message({
    assistant_id: "d2d8036d-9aed-48ae-9338-b446506a0589",
    session_id: session.session_id,
    input: { message_type: 'text', text: texto},
  }).then(res => {
    // console.log("chegou aqui: ", res.output.generic[0].text)
    
    return {
      msg: res.output.generic[0].text,
      intencao: (typeof res.output.intents[0] === "undefined")? "Confuso" : res.output.intents[0].intent,
      sessao: session.session_id
    };
  }).catch(err => {
    console.log(err);
  });
  return response;
}