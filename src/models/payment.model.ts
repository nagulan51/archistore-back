// payment.model.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user.model";
class Payment extends Model {
  public id!: number;
  public method!: "cash" | "stripe" | "paypal" | "coupon";
  public userId!: number;
  public amount!: number;
  public tvaPercent!: number;
  public statutJuridique!: "entreprise" | "particulier";
  public siret!: number;
  public firstname!: string;
  public lastname!: string;
  public rue!: string;
  public codePostal!: number;
  public ville!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    method: {
      type: DataTypes.ENUM("cash", "stripe", "paypal", "coupon"),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    tvaPercent: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    statutJuridique: {
      type: DataTypes.ENUM("entreprise", "particulier"),
      allowNull: false,
      defaultValue: "particulier",
    },
    siret: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    firstname: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rue: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    codePostal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ville: {
      type: DataTypes.STRING(255),
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
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "payments",
    timestamps: true,
    underscored: true,
  }
);
User.hasMany(Payment, { foreignKey: "userId", as: "payments" });
Payment.belongsTo(User, { foreignKey: "userId", as: "user" });
export default Payment;
