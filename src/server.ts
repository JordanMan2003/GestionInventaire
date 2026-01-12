// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import swaggerUi from "swagger-ui-express";
// import yaml from "yamljs";
// import dotenv from "dotenv";
// import path from "path";
// import cookieParser from "cookie-parser";

// import { createAuthRoutes } from "./routes/auth.routes";
// import { createProductRoutes } from "./routes/product.routes";

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3001;

// app.use(helmet());
// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "x-client-id"],
//   })
// );
// app.use(express.json());
// app.use(cookieParser());

// app.use("/api/auth", createAuthRoutes());
// app.use("/api/products", createProductRoutes());

// if (process.env.NODE_ENV !== "production") {
//   const swaggerDocument = yaml.load(path.join(__dirname, "../swagger.yml"));
//   app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// }

// app.get("/ping", (req, res) => {
//   res.json({ message: "pong", timestamp: new Date().toISOString() });
// });

// // app.use(errorHandler);

// process.on("uncaughtException", (error) => {
//   console.error("Uncaught Exception:", error);
// });

// process.on("unhandledRejection", (reason, promise) => {
//   console.error("Unhandled Rejection at:", promise, "reason:", reason);
// });

// app.listen(port, () => {
//   console.log(`🚀 Server is running on port ${port}`);
//   console.log(
//     `📚 API Documentation available at http://localhost:${port}/swagger`
//   );
//   console.log(`❤️  Health check available at http://localhost:${port}/health`);
//   console.log(`🏓 Ping endpoint available at http://localhost:${port}/ping`);
// });

import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";

import { createAuthRoutes } from "./routes/auth.routes";
import { createProductRoutes } from "./routes/product.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3001", // Swagger
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", createAuthRoutes());
app.use("/api/products", createProductRoutes());

if (process.env.NODE_ENV !== "production") {
  const swaggerDocument = yaml.load(path.join(__dirname, "../swagger.yml"));
  app.use(
    "/swagger",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      swaggerOptions: {
        withCredentials: true,
      },
    })
  );
}

app.get("/ping", (req, res) => {
  res.json({ message: "pong", timestamp: new Date().toISOString() });
});

/* ✅ ERROR HANDLER (OBLIGATOIRE) */
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({
    error: err.message || "Internal Server Error",
  });
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📚 Swagger: http://localhost:${port}/swagger`);
});
