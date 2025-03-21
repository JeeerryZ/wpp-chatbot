import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import webhookRoutes from "./routes/webhookRoutes";

const app = express();
app.use(bodyParser.json());
app.use(webhookRoutes);

dotenv.config();

export default app;

