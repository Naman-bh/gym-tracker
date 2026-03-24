const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const programRoutes = require("./routes/programRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const bodyMetricRoutes = require("./routes/bodyMetricRoutes");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/program", programRoutes);
app.use("/api/enrollment", enrollmentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/body-metrics", bodyMetricRoutes);

app.get("/", (req, res) => {
  res.send("API working");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
