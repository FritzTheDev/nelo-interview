// reservation/validation.ts
// Validation schemas for the reservation module.

import { z } from "zod";

export const restaurantSearchSchema = z.object({
  dateTime: z.date({ coerce: true }).min(new Date()), // We don't want to allow reservations in the past.
  party: z.array(z.string().cuid()).nonempty(), // We don't want to allow empty parties.
});

export const createReservationSchema = z.object({
  dateTime: z.date({ coerce: true }).min(new Date()), // We don't want to allow reservations in the past.
  party: z.array(z.string().cuid()).nonempty(), // We don't want to allow empty parties.
  restaurant: z.string().cuid(),
});