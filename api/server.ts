import express from "express";
import { config } from "./utils/env-config.js";

import type { Request, Response } from "express";
const port = config.port || 3000;
const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello world" });
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
