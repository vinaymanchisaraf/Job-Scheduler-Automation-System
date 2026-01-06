import { db } from "../db/db.js";
import axios from "axios";

/**
 * CREATE JOB
 */
export const createJob = (req, res) => {
  const { taskName, payload, priority } = req.body;

  if (!taskName || !priority) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const payloadString = JSON.stringify(payload);

  const sql =
    "INSERT INTO jobs (taskName, payload, priority, status) VALUES (?, ?, ?, 'pending')";

  db.run(sql, [taskName, payloadString, priority], function (err) {
    if (err) {
      console.error("Create Job Error:", err);
      return res.status(500).json({ error: "Failed to create job" });
    }

    res.json({
      message: "Job created successfully",
      jobId: this.lastID,
    });
  });
};

/**
 * GET ALL JOBS
 */
export const getJobs = (req, res) => {
  db.all("SELECT * FROM jobs ORDER BY createdAt DESC", [], (err, rows) => {
    if (err) {
      console.error("Get Jobs Error:", err);
      return res.status(500).json({ error: "Failed to fetch jobs" });
    }

    const parsedRows = rows.map((job) => ({
      ...job,
      payload: job.payload ? JSON.parse(job.payload) : {},
    }));

    res.json(parsedRows);
  });
};

/**
 * GET JOB BY ID
 */
export const getJobById = (req, res) => {
  db.get(
    "SELECT * FROM jobs WHERE id = ?",
    [req.params.id],
    (err, job) => {
      if (err) {
        console.error("Get Job Error:", err);
        return res.status(500).json({ error: "Failed to fetch job" });
      }

      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      res.json({
        ...job,
        payload: job.payload ? JSON.parse(job.payload) : {},
      });
    }
  );
};

/**
 * RUN JOB
 */
export const runJob = (req, res) => {
  const jobId = req.params.id;

  db.run("UPDATE jobs SET status='running' WHERE id=?", [jobId], (err) => {
    if (err) {
      console.error("Run Job Error:", err);
      return res.status(500).json({ error: "Failed to run job" });
    }

    // Simulate background processing
    setTimeout(() => {
      db.run(
        "UPDATE jobs SET status='completed' WHERE id=?",
        [jobId],
        (err) => {
          if (err) {
            console.error("Complete Job Error:", err);
            return;
          }

          // Fetch job for webhook
          db.get(
            "SELECT * FROM jobs WHERE id=?",
            [jobId],
            async (err, job) => {
              if (err || !job) {
                console.error("Webhook Fetch Error:", err);
                return;
              }

              try {
                await axios.post(process.env.WEBHOOK_URL, {
                  jobId: job.id,
                  taskName: job.taskName,
                  priority: job.priority,
                  payload: JSON.parse(job.payload),
                  completedAt: new Date(),
                });

                console.log("Webhook sent successfully");
              } catch (error) {
                console.error("Webhook Error:", error.message);
              }
            }
          );
        }
      );
    }, 3000);

    res.json({ message: "Job is running" });
  });
};
