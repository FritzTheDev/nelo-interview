import { z } from "zod";

/**
 * validate a request body to create a reservation
 */
export const reservationSearchSchema = z.object({
  dateTime: z.date(),
  party: z.array(z.string().cuid()),
  restaurant: z.string().cuid(),
});
