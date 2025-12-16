import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

//! dotenv config
dotenv.config();

//! connect to database
connectDB();

//! create express app
const app = express();

//! middleware
app.use(cors());
app.use(express.json());

//! routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

//! home route
app.get("/", (req, res) => {
  res.send("API is running...");
});

//! start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
