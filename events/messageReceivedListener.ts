import { eventEmitter } from './eventEmitter';
import type { messageReceivedEvent } from "../types/messageReceivedEvent";
import prisma from '../utils/prismaClient';
import { User } from '@prisma/client';
import { createUser, findUserByPhoneNumber } from '../services/userService';
import { sendMessage } from '../services/whatsappService';

const isDebug = process.env.DEBUG || true;

eventEmitter.on('messageReceived', async (event:messageReceivedEvent) => {
    if (isDebug) console.log(event.phone, event.text, event.timestamp);
    
    let date = new Date(parseInt(event.timestamp)*1000);

    try {
        await findUserByPhoneNumber(event.phone).then(async (user) => {
            if (!user){
                await createUser(event.phone).then((user) => {
                    if (isDebug) console.log("user created", user);
                });
                sendMessage(event.phone, "Olá! Seja bem-vindo ao nosso sistema de mensagens. Em breve entraremos em contato.");
            }else{
                prisma.user.update({
                    where: {phoneNumber: event.phone},
                    data: {
                        lastMessageDate: date
                    }
                }).then((user) => {
                    if (isDebug) console.log("user updated", user);
                });
                sendMessage(event.phone, "Mensagem recebida com sucesso!");
            }
        });
    } catch (error) {
        console.log(error);
    }
});