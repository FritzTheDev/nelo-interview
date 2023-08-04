# Nelo Take-Home (Restaurant Booking API)

## Description
This is my response to a take-home assignment from nelo, asking me to build an API.

## Installation & Usage
- Clone this repository
- Run `npm install` to install dependencies
- Run `npm run seed` to create & seed the sqlite database
- Run `npm run dev` to start the server in development mode

## Testing
- Run `npm run test` to run the test suite.
    - You can also run `npm run test:watch` to re-run tests as you make changes to the code.

## TODO:
- [X] Create a basic express setup (sans routers / controllers / etc)
- [X] Configure Prisma & take a crack at the schema.
- [X] Craft a seed.ts script & use it to seed a sqlite database.
- [ ] Create "reservations" router & controller modules
    - [ ] endpoint to find a reservation slot
    - [ ] endpoint to book a reservation
    - [ ] endpoint to cancel a reservation
    - [ ] tie them together with a router
- [ ] Testing
    - [ ] Unit tests for controller business logic with Jest
    - [ ] Endpoint tests with Jest & Supertest
    - [ ] Additional Testing as it makes sense


## Development Notes
- Diner preferences & restaurant traits are closely related & can be defined at the same time in the same table.
- We're going to work from the assumption that a party can book any size of table that can fit them. However, we should try to give the smallest possible table to a party to make it more likely that larger parties can be accomodated if they book later.
    - If I were establishing requirements for this API in reality, I would seek to clarify the first assumption. Comparable platforms often won't let a party of two book a table for eight "no matter what".
- I am going to assume constant timezones based on a fiction that the client is responsible for converting all tz-aware datetimes to UTC before sending them to the API, and converting them back to local before displaying responses from the API. Life is too short.
