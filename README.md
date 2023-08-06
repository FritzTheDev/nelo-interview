# Nelo Take-Home (Restaurant Booking API)

## Description

This is my response to a take-home assignment from nelo, asking me to build an API.

## Installation & Usage

- Clone this repository
- Run `npm install` to install dependencies
- Run `npm run migrate` to create & seed the sqlite database
- Run `npm run dev` to start the server in development mode

## Testing

**Check the TODO & notes below**

- Run `npm run test` to run the test suite.
  - You can also run `npm run test:watch` to re-run tests as you make changes to the code.

## TODO:

- [x] Create a basic express setup (sans routers / controllers / etc)
- [x] Configure Prisma & take a crack at the schema.
- [x] Craft a seed.ts script & use it to seed a sqlite database.
- [x] Validation & Error Handling Middleware
- [x] Create "reservations" router & controller modules
  - [x] validation schema for reservation search
  - [x] validation schema for reservation creation
  - [x] controller to find a reservation slot
  - [x] controller to find a reservation slot
  - [x] controller to book a reservation
  - [x] controller to cancel a reservation
  - [x] router to find a reservation slot
  - [x] endpoint to book a reservation
  - [x] endpoint to cancel a reservation
  - [x] tie them together with a router
- [x] Testing
  - [x] Example Endpoint tests with Jest & Supertest (See Notes Below)
  - [ ] Additional Testing as it makes sense
- [x] Miscellaneous
  - [x] Generally just a manual QA pass on the API to ensure it's working as expected.

## Development Notes

- **I'm more familiar with the testing process in python - django in particular. I got two endpoint tests in place & working to demonstrate the idea, but didn't go as hard as I would normally for pragmatism reasons.**
- I'm a big fan of "black box" testing for apis. If it behaves correctly, unit testing isn't always called for. My approximate typical approach is demonstrated in this repo.
- Diner preferences & restaurant traits are closely related & can be defined at the same time in the same table.
- We're going to work from the assumption that a party can book any size of table that can fit them. However, we should try to give the smallest possible table to a party to make it more likely that larger parties can be accomodated if they book later.
  - If I were establishing requirements for this API in reality, I would seek to clarify the first assumption. Comparable platforms often won't let a party of two book a table for eight "no matter what".
- I am going to assume constant timezones based on a fiction that the client is responsible for converting all tz-aware datetimes to UTC before sending them to the API, and converting them back to local before displaying responses from the API. Life is too short.
- If I were doing this "for real" I would implement a "soft delete" on reservations to cancel instead of just deleting them. That feels out of scope for this exercise, but it wouldn't be a huge lift to implement.
- The question of whether a party should be able to book a table at a restaurant that doesn't match their dietary preferences isn't addressed in the spec. I am proceeding under the assumption that the users can book whatever restaurant they'd like as long as both the party & a table is available. In a broader application (ala opentable) with more than 3 endpoints, that's how you'd do it.