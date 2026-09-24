import express from "express";
import cors from "cors";
import "dotenv/config";

import eventsRouter from "./routes/events.js";
import archiveRouter from "./routes/archive.js";
import teamRouter from "./routes/team.js";
import applicationsRouter from "./routes/applications.js";
import activitiesRouter from "./routes/activities.js";

import adminEventsRouter from "./routes/adminEvents.js";
import adminAuthRouter from "./routes/adminAuth.js";
import adminActivitiesRouter from "./routes/adminActivities.js";
import adminTeamRouter from "./routes/adminTeam.js";
import adminAnnouncementRouter from "./routes/adminAnnouncement.js";

import announcementRouter from "./routes/announcement.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "CIPHER backend is running",
  });
});

// ====================
// PUBLIC ROUTES
// ====================

app.use("/api/events", eventsRouter);
app.use("/api/archive", archiveRouter);
app.use("/api/team", teamRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/activities", activitiesRouter);
app.use("/api/announcement", announcementRouter);

app.use("/api/admin", adminAuthRouter);
app.use("/api/admin/activities", adminActivitiesRouter);
app.use("/api/admin/team", adminTeamRouter);
app.use("/api/admin/announcement", adminAnnouncementRouter);
app.use("/api/admin/events", adminEventsRouter);

app.listen(PORT, () => {
  console.log(`CIPHER backend running on http://localhost:${PORT}`);
});