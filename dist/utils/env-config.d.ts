type ConfigType = {
    port: number;
    connectionString: string;
    jwtSecret: string;
    nodeEnv: "development" | "production";
    cloud_name: string;
    api_key: string;
    api_secret: string;
    frontend_url: string;
};
export declare const config: ConfigType;
export {};
//# sourceMappingURL=env-config.d.ts.map