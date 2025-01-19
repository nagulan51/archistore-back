import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

// Define the attributes for the Plan model
interface PlanAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number; // Duration in days
  createdAt?: Date;
  updatedAt?: Date;
}

// Define optional fields for creation
interface PlanCreationAttributes
  extends Optional<PlanAttributes, "id" | "createdAt" | "updatedAt"> {}

// Extend the Sequelize Model class
class Plan
  extends Model<PlanAttributes, PlanCreationAttributes>
  implements PlanAttributes
{
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public duration!: number; // Duration in days
  public createdAt!: Date;
  public updatedAt!: Date;
}

// Initialize the model
Plan.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        min: 1, // Minimum duration is 1 day
      },
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
    sequelize, // Database connection instance
    tableName: "plans",
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    underscored: true, // Use snake_case in the database
  }
);

export default Plan;
