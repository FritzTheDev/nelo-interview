// middleware/error.ts
// This file is where we'll write our global error handling middleware.
// All errors will be passed to this middleware, and it will be responsible for sending the appropriate response.
// We're only specifically handling validation errors here, but we could handle any error type we want.

import { environment } from "../utils/environment";

/**
 * Express error handling middleware.
 * Handles ZodError validation errors specifically.
 * Returns a generic error message for everything else.
 */
export function errorHandler(err: any, _req: any, res: any, _next: any) {
  if (err.name === "ZodError") {
    res.status(400).json({
      message: "Validation failed.",
      errors: err.errors.map((error: any) => {
        const { path, message } = error;
        return { path, message };
      }),
    });
  } else {
    environment.NODE_ENV === "development" && console.error(err);
    res.status(500).json({
      message: "An unexpected error occurred.",
    });
  }
}
