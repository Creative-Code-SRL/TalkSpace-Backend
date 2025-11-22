import express from "express";
import logger from "morgan";
import cors from "cors";
import messagesRoutes from "./routes/messages.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger("dev"));

// API REST
app.use("/api/messages", messagesRoutes);

export default app;
