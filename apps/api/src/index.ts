import express from "express";
import 'dotenv/config';
import chatController from "./controllers/chat+api";

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use("/api", chatController);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/", (_req, res) => {
  res.send("API is running");
});

const server = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

// Set infinite timeout
server.timeout = 0; // Infinite request timeout
server.headersTimeout = 0; // Infinite headers timeout
server.keepAliveTimeout = 0; // Infinite keep alive timeout

console.log("Server configured with infinite timeout");
