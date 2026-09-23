import express from "express";
import cors from "cors";
import "dotenv/config";

import eventsRouter from "./routes/events.js";
import archiveRouter from "./routes/archive.js";
import teamRouter from "./routes/team.js";
import applicationsRouter from "./routes/applications.js";
import activitiesRouter from "./routes/activities.js";
import adminAuthRouter from "./routes/adminAuth.js";
import adminActivitiesRouter from "./routes/adminActivities.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "CIPHER backend is running",
  });
});

// Public routes
app.use("/api/events", eventsRouter);
app.use("/api/archive", archiveRouter);
app.use("/api/team", teamRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/activities", activitiesRouter);

// Admin routes
app.use("/api/admin", adminAuthRouter);
app.use("/api/admin/activities", adminActivitiesRouter);

app.listen(PORT, () => {
  console.log(`CIPHER backend running on http://localhost:${PORT}`);
});