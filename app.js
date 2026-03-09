import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import connectDB from "./db/connection.js";
import logger from './config/logger.js';

// Import Middlewares
import { setUser } from "./middleware/authMiddleware.js";

// Import Routes
import indexRoutes from "./routes/indexRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import bookRoutes from "./routes/bookRoute.js";
import userRoutes from "./routes/userRoute.js";
import authRoutes from "./routes/authRoute.js";
import morgan from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// DATABASE CONNECTION
connectDB(process.env.uri);

//VIEW ENGINE SETTINGS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


//logger
app.use(morgan("dev"));

//GLOBAL MIDDLEWARE (ORDER MATTERS)
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); // Must be before setUser
app.use(express.static(path.join(__dirname, "public")));

//AUTHENTICATION MIDDLEWARE
app.use(setUser); 
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// ROUTES
app.use("/auth", authRoutes); 
app.use("/dashboard", dashboardRoute);
app.use("/category", categoryRoutes);
app.use("/books", bookRoutes);
app.use("/users", userRoutes);
app.use("/", indexRoutes);

// ERROR HANDLERS
app.use((req, res) => {
  logger.warn(`404 - Page not found: ${req.originalUrl}`); // Log 404s
  res.status(404).render("error", { title: "404", message: "Page not found" });
});

app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`); // Log Errors
  res.status(500).render("error", { title: "Error", message: "Internal Server Error" });
});

export default app;
