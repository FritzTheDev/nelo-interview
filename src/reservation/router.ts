// reservation/router.ts
// This file is where we'll write the routing logic for our reservations router.
// Routers are exclusively concerned with HTTP request/response handling. It should not contain any business logic.

import { Router } from "express";

import { restaurantSearchSchema } from "./validation";
import { findAvailableRestaurants } from "./controller";
import { validationMiddleware } from "../middleware/validation";

export const reservationRouter = Router();

reservationRouter.post("/", validationMiddleware(restaurantSearchSchema), findAvailableRestaurants);
reservationRouter.post("/search", validationMiddleware(restaurantSearchSchema), async (req, res) => {
  const resBody = await findAvailableRestaurants(req.body);

  return res.json(resBody);
});
reservationRouter.delete("/:id");
