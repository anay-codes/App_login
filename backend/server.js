require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes         = require("./routes/auth");
const departmentRoutes   = require("./routes/departments");
const skillRoutes        = require("./routes/skills");
const employeeRoutes     = require("./routes/employees");
const dashboardRoutes    = require("./routes/dashboard");
const uploadRoutes       = require("./routes/upload");
const leaveRoutes        = require("./routes/leaves");
const assetRoutes        = require("./routes/assets");
const notificationRoutes = require("./routes/notifications");
const auditRoutes        = require("./routes/audit");
const reportRoutes       = require("./routes/reports");
const { errorHandler }   = require("./middleware/errorHandler");
const taskRoutes = require("./routes/tasks");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/auth",          authRoutes);
app.use("/api/departments",   departmentRoutes);
app.use("/api/skills",        skillRoutes);
app.use("/api/employees",     employeeRoutes);
app.use("/api/dashboard",     dashboardRoutes);
app.use("/api/upload",        uploadRoutes);
app.use("/api/leaves",        leaveRoutes);
app.use("/api/assets",        assetRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/audit",         auditRoutes);
app.use("/api/reports",       reportRoutes);
app.use("/api/tasks", taskRoutes);
app.use('/api/attendance', require('./routes/attendance'));

// Global error handler (must be last)
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});