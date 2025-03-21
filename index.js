const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

const PORT = process.env.PORT || 25565;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

app.use(bodyParser.json());

app.get('/message', (req, res) => {
    console.log("function reached")
    console.log(req.query)
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('Webhook verificado com sucesso!');
        res.status(200).send(challenge); // Retorne o valor do desafio
    } else {
        console.log('Falha na verificação do webhook.');
        res.sendStatus(403); // Retorne um status de erro
    }
});

 app.post('/message', (req, res) => {

       try {
        let entry = req.body.entry[0];
        let changes = entry.changes[0];
        let messages = changes.value.messages;
        let status = changes.value?.statuses[0]?.status;
        
        if(status){
            console.log(status);
            return;
        }
    

        if(status && status === "read"){
            return
        }


        if (messages && messages.length > 0) {
            let userMessage = messages[0];
            let userNumber = userMessage.from; // Número do usuário
            let messageText = userMessage.text.body; // Texto da mensagem

            console.log(`Mensagem recebida de ${userNumber}: ${messageText}`);

            // Enviar uma resposta
            console.log('Enviando uma resposta automática...');
            let response = sendMessage(userNumber, 'Olá! Esta é uma resposta automática.');
        }
    } catch (error) {
        console.error('Erro ao processar o webhook:', error);
    }
});
// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

function sendMessage(phone, message){
    let url = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`;
    let data = {
        messaging_product: 'whatsapp',
        to: phone,
        type: 'text',
        text: {
            body: message
        }
    };

    let headers = {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    };

    return axios.post(url, data, { headers });
}