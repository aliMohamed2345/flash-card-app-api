import dotenv from "dotenv";
dotenv.config();

type ConfigType = {
  port: number;
  connectionString: string;
  jwtSecret: string;
  nodeEnv: "development" | "production";
  cloud_name: string;
  api_key: string;
  api_secret: string;
};

export const config: ConfigType = {
  port: +process.env.PORT!,
  connectionString: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  nodeEnv: process.env.NODE_ENV === "development" ? "development" : "production",
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  api_key: process.env.CLOUDINARY_API_KEY ?? "",
  api_secret: process.env.CLOUDINARY_API_SECRET ?? "",
};
