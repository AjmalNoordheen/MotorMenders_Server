const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const env = require("dotenv").config();
const userRouter = require("./routers/userRouter");
const proRouter = require("./routers/proffesionalRoute");
const adminrouter = require("./routers/adminRouter");
const socketIo = require("socket.io");
const chatController = require('./controller/chatController')

const cookieParser = require("cookie-parser");
const corsOptions = {
	origin: ["http://localhost:5173","https://www.motormenders.online","https://motormenders.online"], 
	methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
	allowedHeaders: ["Content-Type", "Authorization"],
	optionsSuccessStatus: 204,
  };
  
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.URL).then(() => {
	console.log("db connected successfully");
});

app.use("/", userRouter);
app.use("/proffesional", proRouter);
app.use("/admin", adminrouter);

const server = app.listen(process.env.PORT, () => { 
	console.log("server Started");
});

const io = socketIo(server, {
	cors: {
		origin: "*",
		Credential: true,
	},
});

io.of("/chat").on("connection", (socket) => {
	socket.on("setup", (chatId) => {
		socket.join(chatId);
	});

	socket.on("newMessage", (message, chatId) => {
		console.log("mEssage recieved", message, "on ", chatId);
		io.of("/chat").emit("messageResponse", message, chatId);
		chatController.addMessage(message,chatId)
	});

	socket.on("read", (timestamp, chatId,senderId) => {
		io.of("/chat").emit("readResponse", timestamp, chatId,senderId);
	});
});