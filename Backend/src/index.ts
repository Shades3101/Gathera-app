import express from "express";
import http from "http";
import { authRoute } from "./Routes/AuthRouter.js";
import { initWebSocket } from "./websockets/index.js";
import { RoomRoute } from "./Routes/RoomRouter.js";
import cors from "cors";
import { userRoute } from "./Routes/UserRotuer.js";
import { chatRoute } from "./Routes/ChatRouter.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json())

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(cookieParser())

app.use("/api", authRoute)
app.use("/api", RoomRoute)
app.use("/api", userRoute)
app.use("/api/", chatRoute)

const server = http.createServer(app);
initWebSocket(server)

//add this if using Railway const PORT = Number(process.env.PORT)

server.listen(3001, () => {
    console.log("Listening On Port 3001 with Both HTTP & WS")
});