import dotenv from 'dotenv'
import express from "express";
import { config } from "../utils/env-config.js";
dotenv.config()
const port = config.port || 3000;
const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).json({ message: "Hello world", users });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
