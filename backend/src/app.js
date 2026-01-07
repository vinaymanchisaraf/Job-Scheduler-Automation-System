import express from "express";
import cors from "cors";
import jobsRoutes from "./routes/jobs.routes.js";

const app = express();
app.use(
  cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Backend is running" });
});

app.use("/api/jobs", jobsRoutes);
export default app;
