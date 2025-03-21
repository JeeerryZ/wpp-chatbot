import axios from 'axios';

export function handleWebhookVerification(req, res) {
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    console.log(req.query)

    console.log("function reached")

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('Webhook verificado com sucesso!');
        res.status(200).send(challenge);
    } else {
        console.log('Falha na verificação do webhook.');
        res.sendStatus(403); 
    }
};


export function handleMessageWebhook(req, res) {

    console.log(req.body)
    console.log("function reached")


    try {
        let entry = req.body.entry[0];
        let changes = entry.changes[0];
        let messages = changes.value.messages;
        let status = changes.value.statuses?.[0]?.status;
        

        //Menasgem lida/enviada
        if(status){
            console.log(status);
            res.sendStatus(200);
            return;
        }
        
        //Mensagem recebida
        if(messages){
            let message = messages[0];
            let phone = message.from;
            let text = message.text.body;
            console.log(`Mensagem recebida de ${phone}: ${text}`);
            res.sendStatus(200);
            return;
        }
    } catch (error) {
        console.error('Erro ao processar o webhook:', error);
    }
}
