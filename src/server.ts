import express, { Application } from "express";
import { sequelize } from "./config/database";
import userRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import authRouter from "./routes/auth.routes";
import subscriptionRouter from "./routes/subscription.routes";
import Planrouter from "./routes/plan.routes";
const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRouter);
app.use("/api/subscriptions", subscriptionRouter);
app.use("/api/plans", Planrouter);

sequelize
  .sync({ alter: true })
  .then(() => console.log("Database connected and synced"))
  .catch((err) => console.error("Database connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
