import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// String enum docs: (feature not present in JS)
// https://www.typescriptlang.org/docs/handbook/enums.html#string-enums
enum attributes {
  halal = "Halal",
  vegan = "Vegan",
  glutenFree = "Gluten Free",
  dairyFree = "Dairy Free",
  nutFree = "Nut Free",
  soyFree = "Soy Free",
  carnivore = "Carnivore",
};

// Define restaurant seed data.
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
        attributes: [attributes.nutFree, attributes.soyFree],
    },
    {
        name: "Jill",
        attributes: [attributes.soyFree],
    },
    {
        name: "Jack",
        attributes: [],
    },
    {
        name: "Jenny",
        attributes: [attributes.halal, attributes.carnivore],
    },
    {
        name: "Jared",
        attributes: [attributes.vegan],
    },
]



async function seed() {
    // Seed restaurant attributes
    const attributePromises = Object.values(attributes).map((attribute) => {
        return prisma.restaurantAttribute.create({
            data: { name: attribute },
        });
    });

    const createdAttributes = await Promise.all(attributePromises);
    
    // Seed restaurants with tables & attributes
    const restaurantPromises = restaurants.map((restaurant) => {
        return prisma.restaurant.create({
            data: {
                name: restaurant.name,
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
    });

    const dinerPromises = diners.map((diner) => {
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
    });

    await Promise.all([...restaurantPromises, ...dinerPromises]);
}

seed()
    


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