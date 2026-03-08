import "dotenv/config";
import express from "express";
import connectDB from "./db/connection.js";
import path from "path";
import { fileURLToPath } from "url";

import bookRoutes from "./routes/bookRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import userRoutes from "./routes/userRoute.js";
import indexRoutes from "./routes/indexRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//MongoDB
connectDB(process.env.uri);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", "./views");

// Routes
app.use("/", indexRoutes);
app.use("/d", dashboardRoute);
app.use("/category", categoryRoutes);
app.use("/books", bookRoutes);
app.use("/users", userRoutes);
// app.use("/auth", authRoutes);

export default app;
