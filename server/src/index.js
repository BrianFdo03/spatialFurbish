const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Import routes
const authRoutes = require("./routes/auth.route");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const orderRoutes = require("./routes/order.routes");
const cartRoutes = require("./routes/cart.route");
const dashboardRoutes = require("./routes/dashboard.route");
const userRoutes = require("./routes/user.route");
const profileRoutes = require("./routes/profile.routes");

const connectDB = require("./config/database");

const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://lumierecosmetics.site",
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Store io instance in app to access in controllers
app.set("socketio", io);

io.on("connection", (socket) => {
  console.log("✅ A user connected to WebSocket:", socket.id);
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

const PORT = process.env.PORT || 3000;

// Connect DB
const startServer = async () => {
  try {
    await connectDB(); // ⬅️ WAIT for MongoDB
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server", err);
  }
};

startServer();
