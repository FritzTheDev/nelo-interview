// tests/reservation/endpoints.ts
// This file is where we'll write our tests for the reservation endpoints.

process.env["DATABASE_URL"] = "file:./test.sqlite";

import request from "supertest";
import { exec } from "child_process";

const baseurl = "https://localhost:4200";

// beforeAll(async () => {
//   exec("npx prisma migrate dev", () => {
//     exec("npx prisma migrate reset --force", () => {
//       return seed();
//     });
//   });
// });

beforeEach(async () => {
  return new Promise((resolve, reject) => {
    exec('DATABASE_URL="file:./test.sqlite" && npm run test:seed', () => {
      console.log("seeded");
      exec("npm run dev", () => {
        resolve(0);
      });
    });
  });
});

describe("POST /reservation", () => {
  it("should return status 201 when asked to make a valid reservation", async () => {
    await request(baseurl)
      .post("/reservation")
      .send({
        party: ["1", "2"],
        restaurant: "1",
        dateTime: new Date(),
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201);
  });
});

describe("POST /reservation/search", () => {
  it("should return status 201 when asked to search for available restaurants", async () => {
    await request(baseurl)
      .post("/reservation/search")
      .send({
        party: ["1", "2"],
        dateTime: new Date(),
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201);
  });
});

describe("DELETE /reservation/:id", () => {
  it("should return status 204 when asked to cancel a reservation", async () => {
    await request(baseurl).delete("/reservation/1").set("Accept", "application/json").expect(204);
  });
});
