// reservation/validation.ts
// Validation schemas for the reservation module.

import { z } from "zod";

export const restaurantSearchSchema = z.object({
  dateTime: z.date(),
  party: z.array(z.string().cuid()).nonempty(),
});
