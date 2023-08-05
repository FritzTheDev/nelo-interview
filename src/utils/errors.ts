// utils/errors.ts
// This file defines custom errors, particularly those we want to detect in our error handler

export class PartyMemberBookedError extends Error {
  status: number;

  constructor(diners: string[]) {
    super(
      "The following members of your party are not free: " +
        diners.join(", ") +
        ". Please choose a different time or cancel your existing reservations.",
    );
    this.name = "PartyMemberBookedError";
    this.status = 400;
  }
}

export class TableNotAvailableError extends Error {
  status: number;

  constructor() {
    super("No tables are available at this restaurant at the given time.");
    this.name = "TableNotAvailableError";
    this.status = 400;
  }
}
