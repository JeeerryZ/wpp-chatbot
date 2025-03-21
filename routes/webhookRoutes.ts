import express from "express";
import { handleWebhookVerification, handleMessageWebhook} from "../controllers/webhookController";

const router = express.Router();

router.get("/message", handleWebhookVerification);
router.post("/message", handleMessageWebhook);

export default router;

