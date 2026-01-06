import express from "express";
import cors from "cors";
import jobsRoutes from "./routes/jobs.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", jobsRoutes);

export default app;
