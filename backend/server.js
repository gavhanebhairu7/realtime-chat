import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authenticateUser } from "./jwt/JsonWebToken.js";
import { chatRouter } from "./controller/chatController.js";
import { app, server } from "./SocketIO/socketIO.js";
config();

const port = process.env.SERVER_PORT;
import connect from "./db/connection.js";
connect();
//allows cross site to request this server
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
//required to parse json body of request
app.use(express.json());
//required to parse cookies
app.use(cookieParser());

import { UserRouter } from "./controller/userController.js";
import { messageRouter } from "./controller/messageController.js";
import { contactRouter } from "./controller/contactController.js";
app.use("/api/v1/user", UserRouter);
app.use(authenticateUser);
//define all protected routes here
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/contact", contactRouter);
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
