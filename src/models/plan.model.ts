import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user.model"; // Assuming you have a user model

class Plan extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public duration!: number; // Duration in months or other unit
  public createdAt!: Date;
  public updatedAt!: Date;
}

Plan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Duration of the plan in months",
    },
  },
  {
    sequelize,
    tableName: "plans",
  }
);

// Add associations
Plan.hasMany(User, {
  foreignKey: "planId",
});
User.belongsTo(Plan, {
  foreignKey: "planId",
});

export default Plan;
