import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user.model";

export class File extends Model {
  public id!: number;
  public name!: string;
  public size!: number;
  public userId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

File.init(
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
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "files",
  }
);

// Define association with User model
User.hasMany(File, { foreignKey: "userId", as: "Files" });
File.belongsTo(User, { foreignKey: "userId" });
