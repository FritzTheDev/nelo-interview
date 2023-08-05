// reservation/controller.ts
// This file is where we'll write the business logic for our reservations controller.

import { z } from "zod";
import { PrismaClient } from "@prisma/client";

import { restaurantSearchSchema } from "./validation";

const prisma = new PrismaClient();

type ReservationSearchBody = z.infer<typeof restaurantSearchSchema>;

/**
 * Find all restaurants that can be booked by a given party at a given time
 * - Searches for all restaurants that have at least one table that can accommodate the party at the given time.
 *   - This is determined by finding one table that has at least as many seats as the party and no reservations two hours after the given time.
 * - Checks that the restaurant has at least one table that can accommodate the party.
 * - Checks that the restaurant has all of the attributes each member of the party requires.
 */
export async function findAvailableRestaurants(data: ReservationSearchBody) {
  // Ensure every member of the party is free at the given time.
  const partyIsFree = await prisma.diner.findMany({
    where: {
      id: {
        in: data.party,
      },
      reservations: {
        none: {
          dateTime: {
            gte: data.dateTime,
            lte: new Date(data.dateTime.getTime() + 2 * 60 * 60 * 1000),
          },
        },
      },
    },
  });

  if (partyIsFree.length !== data.party.length) {
    throw new Error("One or more members of the party is not free at the given time.");
  }

  // Ensure we know the full list of attributes the party requires.
  const requiredAttributes = await prisma.restaurantAttribute.findMany({
    where: {
      diners: {
        some: {
          id: {
            in: data.party,
          },
        },
      },
    },
  });

  const candidateRestaurants = await prisma.restaurant.findMany({
    where: {
      tables: {
        some: {
          seats: {
            gte: data.party.length,
          },
          reservations: {
            none: {
              dateTime: {
                gte: data.dateTime,
                lte: new Date(data.dateTime.getTime() + 2 * 60 * 60 * 1000),
              },
            },
          },
        },
      },
    },
  });

  // Filter any restaurants whose attributesString doesn't contain each required attribute.
  const filteredRestaurants = candidateRestaurants.filter((restaurant) => {
    return requiredAttributes.every((attribute) => {
      return restaurant.attributeString.includes(attribute.id);
    });
  });

  return filteredRestaurants;
}
