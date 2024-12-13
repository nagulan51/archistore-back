import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Client extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone!: string;
}

Client.init(
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
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "clients",
  }
);

export default Client;
