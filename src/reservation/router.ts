// reservation/router.ts
// This file is where we'll write the routing logic for our reservations router.
// Routers are exclusively concerned with HTTP request/response handling. It should not contain any business logic.

import { Router } from "express";

import { validationMiddleware } from "../middleware/validation";
import { createReservationSchema, restaurantSearchSchema } from "./validation";
import { cancelReservation, createReservation, findAvailableRestaurants } from "./controller";

export const reservationRouter = Router();

// Create a reservation for a given party at a given restaurant at a given time.
reservationRouter.post("/", validationMiddleware(createReservationSchema), async (req, res, next) => {
  try {
    const resBody = await createReservation(req.body);
    return res.status(201).json(resBody);
  } catch (err) {
    return next(err);
  }
});

// Search for restaurants that can accommodate a given party at a given time.
reservationRouter.post("/search", validationMiddleware(restaurantSearchSchema), async (req, res, next) => {
  try {
    const resBody = await findAvailableRestaurants(req.body);
    return res.status(200).json(resBody);
  } catch (err) {
    return next(err);
  }
});

// Cancel a given reservation.
reservationRouter.delete("/:id", async (req, res, next) => {
  try {
    await cancelReservation(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});