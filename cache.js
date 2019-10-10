const Cache = require("cache");
const chat = require("./chat")

const c = new Cache(5 * (60 * 1000));

exports.get = async function (key) {
	return new Promise(async (resolve) => {

		let cache = c.get(key);

		if (cache !== null) {
			return resolve(c.get(key));
		}
		
		let session = await chat.createSession();
		//Inicia a primeira interação com o Bot
		await chat.send("oi", session)
		cache = c.put(key, session);
		resolve(c.get(key));

	})
}