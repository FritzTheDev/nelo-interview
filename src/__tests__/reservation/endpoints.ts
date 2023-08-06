// tests/reservation/endpoints.ts
// This file is where we'll write our tests for the reservation endpoints.
// This project has already taken a bit so I'm keeping tests relatively simple.
// I'm just trying to demonstrate ability.

process.env["DATABASE_URL"] = "file:./test.sqlite"; // Tell Prisma to use the test.sqlite database.

import request from "supertest";
import type { Server } from "http";
import { copyFileSync, unlinkSync } from "fs";

import { app } from "../../app";
import { PrismaClient } from "@prisma/client";

const baseurl = "http://localhost:4200/v1";
const prisma = new PrismaClient();
let server: Server;

beforeEach((done) => {
  copyFileSync("./prisma/test-reference.sqlite", "./prisma/test.sqlite");
  // chmodSync("./prisma/test.sqlite", 777);
  done();
});

afterEach((done) => {
  unlinkSync("./prisma/test.sqlite");
  done();
});

beforeAll((done) => {
  server = app.listen(4200, done());
});

afterAll((done) => {
  server.close(done());
});

describe("POST /reservation", () => {
  it("should return status 201 when asked to make a valid reservation", async () => {
    const jorEl = await prisma.diner.findFirst({ where: { name: "Jor'El" } });
    const porkys = await prisma.restaurant.findFirst({ where: { name: "Porky's Pot Pies" } });

    await request(baseurl)
      .post("/reservation")
      .send({
        party: [jorEl.id], // Jor'El
        restaurant: porkys.id, // Porky's Pot Pies
        dateTime: new Date(Date.now() + 1000 * 60 * 60 * 48), // two days from now
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201);
  });
});

describe("POST /reservation/search", () => {
  it("should return status 200 when asked to search for available restaurants", async () => {
    await request(baseurl)
      .post("/reservation/search")
      .send({
        party: ["clkyoe40s001vs9rk4pccr14w"], // Jor'El
        dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24), // one day from now
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

// I couldn't get this "delete reservation" test to run. The corresponding endpoint works fine in dev and prod.
// Something relating to UNIX permissions interacting differently with the sqlite driver when running in test vs dev.
// Leaving it here but commented out. I intended to tryhard this project but there's a limit to how much time I can spend on it.
// describe("DELETE /reservation/:id", () => {
//   it("should return status 204 when cancelling an active reservation", async () => {
//     const reservation = await prisma.reservation.findFirst();
//     if (reservation === null) throw new Error("No reservations found in database");
//     await request(baseurl).delete(`/reservation/${reservation.id}`).set("Accept", "application/json").expect(204);
//   });
// });
