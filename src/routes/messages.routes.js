import { Router } from "express";
import { MessagesController } from "../controllers/messages.controller.js";

const router = Router();

router.get("/", MessagesController.getAll);
router.post("/", MessagesController.create);

export default router;
