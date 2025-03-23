import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import webhookRoutes from "./routes/webhookRoutes";
import { eventEmitter } from "./events/eventEmitter";
import "./events/messageReceivedListener";

const app = express();
app.use(bodyParser.json());
app.use(webhookRoutes);

dotenv.config();

export default app;

