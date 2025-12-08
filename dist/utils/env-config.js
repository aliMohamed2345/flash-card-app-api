import dotenv from "dotenv";
dotenv.config();
export const config = {
    port: +process.env.PORT,
    connectionString: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV === "development" ? "development" : "production",
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    api_key: process.env.CLOUDINARY_API_KEY ?? "",
    api_secret: process.env.CLOUDINARY_API_SECRET ?? "",
};
//# sourceMappingURL=env-config.js.map