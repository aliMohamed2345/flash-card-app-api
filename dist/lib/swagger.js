import swaggerJSDoc from "swagger-jsdoc";
import { config } from "../utils/env-config.js";
export const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Flashcard API",
            version: "1.0.0",
            description: "API documentation for Flashcard application",
        },
        servers: [
            {
                url: config.nodeEnv === "development"
                    ? `http://localhost:${config.port}`
                    : config.frontend_url,
                description: config.nodeEnv === "development"
                    ? "Development server"
                    : "Production server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ["./src/routes/**/*.ts", "./src/controllers/**/*.ts"],
};
export const swaggerSpec = swaggerJSDoc(swaggerOptions);
//# sourceMappingURL=swagger.js.map