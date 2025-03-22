import type { Request, Response } from 'express';
import { EventEmitter } from 'events';
import type { Change } from '../types/messageResponse';
import type { messageReceivedEvent } from '../types/messageReceivedEvent';

const eventEmitter = new EventEmitter();
const isDebug = process.env.DEBUG;

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

export function handleWebhookVerification(req: Request, res: Response) {
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


export function handleMessageWebhook(req: Request, res: Response) {

    try {
        let changes = req.body?.entry[0]?.changes[0] as Change;
        if (!changes) return;
        if (changes.field !== "message") return; 
        let value = changes.value;
        let messages = value.messages;
        
        //Menasgem lida/enviada
        //Não temos interesse em chamar um evento da mensagem sendo apenas lida pelo usuário
        if(changes){
            res.sendStatus(200);
            return;
        }
        
        //Mensagem recebida
        //Agora a gente chama o evento pra poder processar a mensagem como quisermos
        if(messages){
            let message = messages[0];
            let phone = message.from;
            let text = message.text.body;
            let timestamp = message.timestamp;
            if (isDebug) console.log(`Mensagem recebida de ${phone}: ${text}`);

            eventEmitter.emit('messageReceived', {
                phone,
                text,
                timestamp

            } as messageReceivedEvent);

            res.sendStatus(200);
            return;
        }
    } catch (error) {
        console.error('Erro ao processar o webhook:', error);
    }
}
