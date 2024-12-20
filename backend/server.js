import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import { initializeSocket } from "./socket.js"; // Import socket.js

// Load environment variables
const jwtSecret = process.env.JWT_SECRET; // Load JWT_SECRET from .env
console.log("JWT Secret Key:", jwtSecret); // Debug JWT_SECRET

// app config
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());


// db connection
mongoose.connect("mongodb+srv://merakanapalliraviteja86:wejhTlHwGGgPMXbn@cluster0.q7okber.mongodb.net/cloud")

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api", subscriptionRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

app.get("/", (req, res) => {
  res.send("API Working");
});

// Create HTTP server and integrate Socket.io
const server = app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});

// Initialize socket.io
initializeSocket(server);
