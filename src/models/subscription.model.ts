import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user.model";

// Define the attributes for the Subscription model
interface SubscriptionAttributes {
  id: number;
  userId: number;
  plan: string;
  status: "active" | "inactive" | "cancelled";
  startDate: Date;
  endDate?: Date | null; // Optional, null for never expiring
  paymentMethod: "cash" | "stripe" | "paypal"; // New field for payment method
  createdAt?: Date;
  updatedAt?: Date;
}

// Define optional fields for creation
interface SubscriptionCreationAttributes
  extends Optional<
    SubscriptionAttributes,
    "id" | "createdAt" | "updatedAt" | "endDate"
  > {}

class Subscription
  extends Model<SubscriptionAttributes, SubscriptionCreationAttributes>
  implements SubscriptionAttributes
{
  public id!: number;
  public userId!: number;
  public plan!: string;
  public status!: "active" | "inactive" | "cancelled";
  public startDate!: Date;
  public endDate?: Date | null; // Explicit null for never expiring
  public paymentMethod!: "cash" | "stripe" | "paypal"; // New payment method field
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
      onDelete: "CASCADE", // Delete subscription if the user is deleted
    },
    plan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "cancelled"),
      allowNull: false,
      defaultValue: "active",
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null, // Null indicates no expiration
    },
    paymentMethod: {
      type: DataTypes.ENUM("cash", "stripe", "paypal"),
      allowNull: false, // This field is required
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "subscriptions",
    timestamps: true,
    underscored: true,
  }
);

Subscription.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export default Subscription;
