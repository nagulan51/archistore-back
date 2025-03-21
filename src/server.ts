import express, { Application } from "express";
import { sequelize } from "./config/database";
import userRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import authRouter from "./routes/auth.routes";
import subscriptionRouter from "./routes/subscription.routes";
import Planrouter from "./routes/plan.routes";
import FileRouter from "./routes/file.routes";
import cors from "cors";

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRouter);
app.use("/api/subscriptions", subscriptionRouter);
app.use("/api/plans", Planrouter);
app.use("/api/files", FileRouter);
//404
app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});
sequelize
  .sync({ alter: false, force: false })
  .then(() => console.log("Database connected and synced"))
  .catch((err) => console.error("Database connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
