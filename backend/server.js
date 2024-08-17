import express from "express";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";
import { fileURLToPath } from "url";
import productRoutes from "./routes/product.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure dotenv to load variables from the .env file
dotenv.config({ path: path.resolve(__dirname, "./config/.env") });

//Connect to database
connectDB();

//SET UP PORT:
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("API is running....");
});

//Routes
app.use("/api/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server Is Running on Port ${PORT}`));
