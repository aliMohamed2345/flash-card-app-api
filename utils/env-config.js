import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT,
  connectionString: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development'
};
