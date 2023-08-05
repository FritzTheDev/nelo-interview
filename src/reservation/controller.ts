// reservation/controller.ts
// This file is where we'll write the business logic for our reservations controller.

import { z } from "zod";
import { PrismaClient } from "@prisma/client";

import { createReservationSchema, restaurantSearchSchema } from "./validation";
import { PartyMemberBookedError, TableNotAvailableError } from "../utils/errors";

const prisma = new PrismaClient();

type RestaurantSearchBody = z.infer<typeof restaurantSearchSchema>;
type CreateReservationBody = z.infer<typeof createReservationSchema>;

/**
 * Find all restaurants that can be booked by a given party at a given time
 * - Checks that every member of the party is free for two hours following the given time.
 * - Searches for all restaurants that have at least one table that can accommodate the party at the given time.
 *   - This is determined by finding one table that has at least as many seats as the party and no reservations two hours after the given time.
 * - Checks that the restaurant has at least one table that can accommodate the party.
 * - Checks that the restaurant has all of the attributes each member of the party requires.
 */
export async function findAvailableRestaurants(data: RestaurantSearchBody) {
  // Ensure every member of the party is free at the given time.
  const bookedDiners = await prisma.diner.findMany({
    where: {
      id: {
        in: data.party,
      },
      reservations: {
        every: {
          dateTime: {
            gte: data.dateTime,
            lte: new Date(data.dateTime.getTime() + 2 * 60 * 60 * 1000),
          },
        },
      },
    },
  });

  if (bookedDiners.length > 0) {
    throw new PartyMemberBookedError(bookedDiners.map((diner) => diner.name));
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
  // This is in an attempt to reduce database load. This is something I'd come back to if doing it "for real".
  const filteredRestaurants = candidateRestaurants.filter((restaurant) => {
    return requiredAttributes.every((attribute) => {
      return restaurant.attributeIds.includes(attribute.id);
    });
  });

  return filteredRestaurants;
}

/**
 * Create a reservation for a given party at a given restaurant at a given time.
 * - Checks that every member of the party is free for two hours following the given time.
 * - Checks that the restaurant has at least one table that can accommodate the party.
 * - Does not check that the restaurant has all of the attributes each member of the party requires.
 * - Creates a reservation for the party at the restaurant at the given time,
 *  - Using the table with the fewest seats that can accommodate the party.
 * - Use the first table returned if there is a "tie".
 * - Returns the reservation.
 * - Throws an error if the restaurant does not have a table that can accommodate the party.
 * - Throws an error if the party is not free at the given time.
  */
export async function createReservation(data: CreateReservationBody) {
  // Ensure every member of the party is free at the given time.
  const occupiedDiners = await prisma.diner.findMany({
    where: {
      id: {
        in: data.party,
      },
      reservations: {
         every: {
          dateTime: {
            gte: data.dateTime,
            lte: new Date(data.dateTime.getTime() + 2 * 60 * 60 * 1000),
          },
        },
      },
    },
  });

  if (occupiedDiners.length > 0) {
    throw new PartyMemberBookedError(occupiedDiners.map((diner) => diner.name));
  }

  // Ensure the restaurant has at least one table that can accommodate the party.
  const candidateTable = await prisma.table.findFirst({
    where: {
      seats: {
        gte: data.party.length,
      },
      restaurantId: data.restaurantId,
      reservations: {
        none: {
          dateTime: {
            gte: data.dateTime,
            lte: new Date(data.dateTime.getTime() + 2 * 60 * 60 * 1000),
          },
        },
      },
    },
    orderBy: {
      seats: "asc",
    },
  });

  if (candidateTable === null) {
    throw new TableNotAvailableError();
  }
  console.log(data.restaurantId)
  // Create the reservation.
  const reservation = await prisma.reservation.create({
    data: {
      dateTime: data.dateTime,
      diners: {
        connect: data.party.map((dinerId) => {
          return { id: dinerId };
        }),
      },
      table: {
        connect: {
          id: candidateTable.id,
        },
      },
    },
  });

  return reservation;
}
