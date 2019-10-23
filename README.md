**Projeto Challenge IBM 2019 | TDSS1**
# FIAPSON
Este repositorio faz a comunicação entre os seguintes serviços:
- Speech to Text
- Watson Assistant
- Text to Speech
------------
Projeto criado em NODE. Para roda-lo basta seguir os seguintes comandos:


    npm install

Produção:

	npm run start
	

Desenvolvimento:

    npm run dev
	

## **Resumo**
Ao enviar o áudio WAV/OGG o sistema iniciará uma sessão baseada na informação de envio, tal sessão permanecerá salva em Cache durante 5 minutos dado o tempo de sessão do plano Light do IBM Cloud (Watson Assistant). Com isso o mesmo permanecerá no fluxo já configurado.

Após a sessão iniciar emitimos um inicio de dialogo de acordo com o que o usuário enviará Ex. Ao enviar texto (String) o retorno será texto (String), caso seja enviado áudio (WAV/OGG) o retorno será áudio (OGG).

## # Integrantes:
**Nome:** Ernandes Leite de Almeida Guedes | **RM: ** 82132

**Nome:** Luis Felipe Robbo | **RM: ** 82762

**Nome:** Bruno de Lima Silva | **RM: ** 81828

**Nome:** Pedro Henrique dos Reis | **RM: ** 83883

**Nome:** Eduardo Frade de Oliveira | **RM: ** 83795