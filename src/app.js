const path = require("path");
require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const helmet = require("helmet");
const app = express();
require("../config/database");
const cors = require("cors");
const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    headers:
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
  })
);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use("/images", express.static(path.join(__dirname, "../images")));
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);

module.exports = app;
