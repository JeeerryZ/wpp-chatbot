import type { Request, Response } from 'express';
import { eventEmitter } from '../events/eventEmitter';
import type { Change } from '../types/messageResponse';
import type { messageReceivedEvent } from '../types/messageReceivedEvent';

const isDebug = process.env.DEBUG || true;

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

    console.log("funcion reached")

    try {
        let changes = req.body?.entry[0]?.changes[0] as Change;
        if (!changes){
            if (isDebug) console.log("did not find changes");
            res.sendStatus(202);
            return;
        }    
        if (changes.field !== "messages"){
            res.sendStatus(202);
            if (isDebug) console.log(`field ${changes.field} is not message`);
            return; 
        }
        if (changes.statuses){
            if (isDebug) console.log("not a message");
            res.sendStatus(202);
            return;
        }
        
        let messages = changes.value.messages;
        
        //Mensagem recebida
        //Agora chamamos o evento pra poder processar a mensagem como quisermos
        if(messages){
            let message = messages[0];
            let phone = message.from;
            let text = message.text.body;
            let timestamp = message.timestamp;
            if (isDebug) console.log(`Mensagem recebida chamando evento...`);

            eventEmitter.emit('messageReceived', {
                phone,
                text,
                timestamp

            } as messageReceivedEvent);

            res.sendStatus(201);
            return;
        }
    } catch (error) {
        console.error('Erro ao processar o webhook:', error);
    }
    res.sendStatus(202);
}
