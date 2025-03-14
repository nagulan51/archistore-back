import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

// Define the attributes for the User model
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  role: "client" | "admin" | "moderator"; // Role options as a TypeScript union type
}

// Define optional fields for creation
interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt"> {}

// Extend the Sequelize Model class
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public role!: "client" | "admin" | "moderator"; // Ensure TypeScript enforces enum-like behavior
}

// Initialize the model
User.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
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
    role: {
      type: DataTypes.ENUM("client", "admin", "moderator"), // Enum options
      allowNull: false,
      defaultValue: "client", // Set default to match the enum options
    },
  },
  {
    sequelize, // Database connection instance
    tableName: "users",
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    underscored: true, // Use snake_case in the database
  }
);

export default User;
