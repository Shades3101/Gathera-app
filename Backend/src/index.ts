import express from "express";
import http from "http";
import { authRoute } from "./Routes/AuthRouter.js";
import { initWebSocket } from "./websockets/index.js";
import { RoomRoute } from "./Routes/RoomRouter.js";
import cors from "cors";
import { userRoute } from "./Routes/UserRouter.js";
import { chatRoute } from "./Routes/ChatRouter.js";
import { LiveKitRouter } from "./Routes/LiveKitRouter.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.set('trust proxy', 1);
app.use(express.json())

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(cookieParser())

app.use("/api", authRoute)
app.use("/api", RoomRoute)
app.use("/api", userRoute)
app.use("/api", chatRoute)
app.use("/api", LiveKitRouter)

const server = http.createServer(app);
initWebSocket(server)

const PORT = Number(process.env.PORT) || 3001;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Listening On Port ${PORT} with Both HTTP & WS`)
});