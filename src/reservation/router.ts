// reservation/router.ts
// This file is where we'll write the routing logic for our reservations router.
// Routers are exclusively concerned with HTTP request/response handling. It should not contain any business logic.

import { Router } from "express";

import { validationMiddleware } from "../middleware/validation";
import { createReservation, findAvailableRestaurants } from "./controller";
import { createReservationSchema, restaurantSearchSchema } from "./validation";

export const reservationRouter = Router();

// Create a reservation for a given party at a given restaurant at a given time.
reservationRouter.post("/", validationMiddleware(createReservationSchema), async (req, res) => {
  const resBody = await createReservation(req.body);
  return res.json(resBody);
});

// Search for restaurants that can accommodate a given party at a given time.
reservationRouter.post("/search", validationMiddleware(restaurantSearchSchema), async (req, res) => {
  const resBody = await findAvailableRestaurants(req.body);
  return res.json(resBody);
});

// Cancel a given reservation.
reservationRouter.delete("/:id");
