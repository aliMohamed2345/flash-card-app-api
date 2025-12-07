import dotenv from "dotenv";

dotenv.config();

type configType = {
  port: Number;
  connectionString: String;
  jwtSecret: String;
  nodeEnv: "development" | "production";
};

export const config: configType = {
  port: +process.env.PORT!,
  connectionString: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  nodeEnv:
    process.env.NODE_ENV === "development" ? "development" : "production",
};
