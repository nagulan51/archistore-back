import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user.model";
import Plan from "./plan.model";
import Payment from "./payment.model";

class Subscription extends Model {
  public id!: number;
  public userId!: number;
  public planId!: number;
  public paymentId!: number;
  public status!: "active" | "inactive" | "cancelled";
  public startDate!: Date;
  public endDate!: Date | null;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Subscription.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    planId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Plan,
        key: "id",
      },
    },
    paymentId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Payment, // Reference to Payment model
        key: "id",
      },
    },

    status: {
      type: DataTypes.ENUM("active", "inactive", "cancelled"),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "subscriptions",
    timestamps: true,
    underscored: true,
  }
);

// Define associations after both models are initialized
User.hasMany(Subscription, { foreignKey: "userId", as: "subscriptions" });
Subscription.belongsTo(User, { foreignKey: "userId", as: "user" });

Plan.hasMany(Subscription, { foreignKey: "planId", as: "subscriptions" });
Subscription.belongsTo(Plan, { foreignKey: "planId", as: "subscriptionPlan" });

Payment.hasMany(Subscription, { foreignKey: "paymentId", as: "subscriptions" });
Subscription.belongsTo(Payment, { foreignKey: "paymentId", as: "payment" });

export default Subscription;
