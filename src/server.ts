import express, { Application } from "express";
import { sequelize } from "./config/database";
import userRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import authRouter from "./routes/auth.routes";

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", userRoutes);

sequelize
  .sync({ alter: true }) // Use { force: true } only during development
  .then(() => console.log("Database connected and synced"))
  .catch((err) => console.error("Database connection error:", err));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
