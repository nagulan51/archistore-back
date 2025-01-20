import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

class Plan extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public tvaPercent!: number;
  public duration!: number;
  public storageSize!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Plan.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED, // Changed to UNSIGNED to match the subscription table
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
    tvaPercent: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Durée de validité en mois",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    storageSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Taille de stockage en Mo",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "plans",
    timestamps: true,
    underscored: true, // Added to match the subscription table's naming convention
  }
);

export default Plan;
