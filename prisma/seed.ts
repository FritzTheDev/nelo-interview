// seed.ts
// This file is used to seed the database with data.
// It must not used in production - only for testing & development.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const attributes = {
  halal: "Halal",
  vegan: "Vegan",
  glutenFree: "Gluten Free",
  dairyFree: "Dairy Free",
  nutFree: "Nut Free",
  soyFree: "Soy Free",
  carnivore: "Carnivore",
};

const restaurants = [
  {
    name: "Meat & Greet",
    attributes: [attributes.carnivore, attributes.glutenFree, attributes.dairyFree, attributes.soyFree],
    tables: [
      { seats: 2, count: 4 },
      { seats: 4, count: 4 },
      { seats: 6, count: 2 },
      { seats: 8, count: 1 },
    ],
  },
  {
    name: "Porky's Pot Pies",
    attributes: [attributes.nutFree, attributes.soyFree],
    tables: [
      { seats: 2, count: 4 },
      { seats: 4, count: 4 },
      { seats: 6, count: 2 },
      { seats: 8, count: 1 },
    ],
  },
  {
    name: "Burger Caliph",
    attributes: [attributes.halal, attributes.dairyFree, attributes.nutFree, attributes.soyFree],
    tables: [
      { seats: 2, count: 4 },
      { seats: 4, count: 4 },
      { seats: 6, count: 1 },
    ],
  },
  {
    name: "Vegan Vibes",
    attributes: [attributes.halal, attributes.vegan, attributes.dairyFree, attributes.nutFree],
    tables: [
      { seats: 2, count: 4 },
      { seats: 4, count: 4 },
      { seats: 6, count: 4 },
    ],
  },
];

const diners = [
  {
    name: "John",
    attributes: [attributes.carnivore, attributes.soyFree],
  },
  {
    name: "Jane",
    attributes: [attributes.nutFree],
  },
  {
    name: "Jill",
    attributes: [],
  },
  {
    name: "Jack",
    attributes: [],
  },
  {
    name: "Jenny",
    attributes: [attributes.halal],
  },
  {
    name: "Jared",
    attributes: [],
  },
  {
    name: "Jones",
    attributes: [],
  },
  {
    name: "Johann",
    attributes: [],
  },
  {
    name: "Johanna",
    attributes: [attributes.halal],
  },
  {
    name: "Janet",
    attributes: [attributes.dairyFree],
  },
  {
    name: "Jasper",
    attributes: [],
  },
  {
    name: "Jupiter",
    attributes: [],
  },
  {
    name: "Jabba",
    attributes: [attributes.nutFree],
  },
  {
    name: "Jor'El",
    attributes: [],
  },
];

async function seed() {
  // Seed restaurant attributes
  const attributePromises = Object.values(attributes).map((attribute) => {
    return prisma.restaurantAttribute.create({
      data: { name: attribute },
    });
  });

  const createdAttributes = await Promise.all(attributePromises);

  // Seed restaurants with tables & attributes
  const restaurantPromises = await Promise.all(
    restaurants.map((restaurant) => {
      return prisma.restaurant.create({
        data: {
          name: restaurant.name,
          // Create a string of this restaurant's attribute ids to store in the database
          attributeIds: createdAttributes
            .filter((attribute) => Object.values(restaurant.attributes).includes(attribute.name))
            .map((attribute) => attribute.id)
            .join(","),
          attributes: {
            connect: restaurant.attributes.map((attribute) => {
              // Find the attribute id from the createdAttributes array
              const match = createdAttributes.find((createdAttribute) => {
                return createdAttribute.name === attribute;
              });

              // This should never happen, but we'll throw an error just in case.
              if (!match) throw new Error(`No match found for attribute ${attribute}`);

              // Connect the attribute to the restaurant
              return { id: match.id };
            }),
          },
          tables: {
            create: convertTableDataIntoFlatArray(restaurant.tables).map((seats) => {
              return { seats };
            }),
          },
        },
      });
    }),
  );

  // Seed diners with attributes
  const dinerPromises = await Promise.all(
    diners.map((diner) => {
      return prisma.diner.create({
        data: {
          name: diner.name,
          requiredRestaurauntAttributes: {
            connect: diner.attributes.map((attribute) => {
              // Find the attribute id from the createdAttributes array
              const match = createdAttributes.find((createdAttribute) => {
                return createdAttribute.name === attribute;
              });

              // This should never happen, but we'll throw an error just in case.
              if (!match) throw new Error(`No match found for attribute ${attribute}`);

              // Connect the attribute to the restaurant
              return { id: match.id };
            }),
          },
        },
      });
    }),
  );

  // Create reservation for Jor'El at Porky's Pot Pies
  const jorEl = await prisma.diner.findFirst({ where: { name: "Jor'El" } });
  const porkys = await prisma.restaurant.findFirst({ where: { name: "Porky's Pot Pies" }, include: { tables: true } });

  if (jorEl && porkys) {
    await prisma.reservation.create({
      data: {
        diners: { connect: { id: jorEl.id } },
        table: { connect: { id: porkys.tables[0].id } },
        dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24), // one day from now
      },
    });
  }
}

seed();

/**
 * Converts the table data into a flat array of integers, each of which correspond with the number of seats at a table.
 *
 * @param tables
 * @returns number[]
 */
function convertTableDataIntoFlatArray(tables: { seats: number; count: number }[]): number[] {
  const tableData = tables.map((table) => {
    const { seats, count } = table;
    return Array(count).fill(seats);
  });

  return tableData.flat();
}
