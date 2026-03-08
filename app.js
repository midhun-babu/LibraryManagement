import "dotenv/config";
import express from "express";
import connectDB from "./db/connection.js";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

// Routes
import indexRoutes from "./routes/indexRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import bookRoutes from "./routes/bookRoute.js";
import userRoutes from "./routes/userRoute.js";
import authRoutes from "./routes/authRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();



// Database Connection

connectDB(process.env.uri);



// View Engine

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



// Global Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// Static Files

app.use(express.static(path.join(__dirname, "public")));



// Routes

app.use("/", indexRoutes);
app.use("/dashboard", dashboardRoute);
app.use("/category", categoryRoutes);
app.use("/books", bookRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);


// 404 handler
app.use((req, res) => {
  res.status(404).render("error", {
    message: "Page not found"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    message: "Internal Server Error"
  });
});


export default app;