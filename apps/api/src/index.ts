import express from "express";

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/", (_req, res) => {
  res.send("API is running");
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
