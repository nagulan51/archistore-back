import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user.model";

export class File extends Model {
  public id!: number;
  public name!: string;
  public size!: number;
  public type!: string;
  public path!: string;
  public originalName!: string;
  public userId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  //pour des raisons de sécurité, nous ne voulons pas renvoyer le chemin du fichier
  toJSON() {
    const values = { ...this.get() };
    delete values.path;
    return values;
  }
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
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalName: {
      type: DataTypes.STRING,
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
