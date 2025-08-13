import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./models";
import User from "./models/User";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("API is running...");
});

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected...");
    await sequelize.sync({ alter: true }); // Use alter:true for dev, force:true to drop tables and recreate
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

start();
