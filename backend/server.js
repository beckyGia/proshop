import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { fileURLToPath } from "url";
import path from "path";
import productRoutes from "./routes/product.js";
import userRoutes from "./routes/user.js";
import orderRoutes from "./routes/order.js";
import uploadRoutes from "./routes/upload.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Body Parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

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
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server Is Running on Port ${PORT}`));
