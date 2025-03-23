import axios from 'axios';

const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

export async function sendMessage(phone: string, message: string){
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

    return await axios.post(url, data, { headers });
}