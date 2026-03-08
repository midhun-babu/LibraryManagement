import "dotenv/config";
import express from "express";
import connectDB from "./db/connection.js";

const app = express();

connectDB(process.env.uri);
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

import indexRoutes from "./routes/indexRoute.js";
app.use("/", indexRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
