import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Validate required environment variables
const {
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_HOST = "localhost",
  MYSQL_PORT = "3306", // Default MySQL port
} = process.env;

if (!MYSQL_DATABASE || !MYSQL_USER || !MYSQL_PASSWORD) {
  throw new Error(
    "Missing required environment variables: MYSQL_DATABASE, MYSQL_USER, or MYSQL_PASSWORD"
  );
}

// Initialize Sequelize instance
export const sequelize = new Sequelize(
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  {
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT), // Convert port to a number
    dialect: "mysql",
    logging: console.log, // Enable logging for debugging (set to false in production)
  }
);

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1); // Exit the process with a failure code
  }
})();
