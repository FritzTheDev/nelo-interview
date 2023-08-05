// app.ts
// The "main" express application file.
// This is where we configure our middleware and register our routers.
// The `app` export is used in index.ts to start the application.

import cors from "cors";
import morgan from "morgan";
import Express, { json } from "express";

import { environment } from "./utils/environment";
import { reservationRouter } from "./reservation/router";
import { errorHandler } from "./middleware/errorHandler";

// Create the express application
export const app = Express();

// Configure middleware
app.use(json()); // Request body parsing
environment.NODE_ENV === "development" ? app.use(cors()) : app.use(cors({ origin: environment.CLIENT_ROOT })); // CORS
environment.NODE_ENV === "development" ? app.use(morgan("dev")) : app.use(morgan("tiny")); // Logging

// Register routers
app.use("/v1/reservation", reservationRouter);

// Configure global error handling
app.use(errorHandler);
