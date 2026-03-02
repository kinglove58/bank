import swaggerJSDoc from "swagger-jsdoc";
const productionUrl = process.env.RENDER_EXTERNAL_URL ?? "https://bank-xw7m.onrender.com";
const options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Bank API",
            version: "1.0.0",
            description: "API documentation for the Bank API",
        },
        servers: [
            {
                url: productionUrl,
                description: "Production server",
            },
            {
                url: "http://localhost:3000",
                description: "Local development server",
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
        //tHIS applies the jwt security globally to all route
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./src/app.ts"],
};
export const swaggerSpec = swaggerJSDoc(options);
