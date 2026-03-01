const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ================= MongoDB Connection =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB error:", err));

mongoose.connection.once("open", () => {
  console.log("ℹ️ Connected to DB:", mongoose.connection.name);
});

// ================= Middleware =================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ================= View Engine =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ================= Session =================
app.use(
  session({
    secret: "react_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

// ================= Static Files =================
app.use(express.static(path.join(__dirname, "public")));

// ================= Routes =================
app.use("/", require("./routes/pages"));
app.use("/", require("./routes/auth"));

// ================= 404 =================
app.use((req, res) => {
  res.status(404).send("<h2>404 Not Found</h2>");
});

// ================= Start Server =================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});