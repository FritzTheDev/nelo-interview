// utils/environment.ts
// This file handles the loading, validation, transformation, & typing of environment variables.

// The approach seen below with envalid ensures two things work better than they would with .env
// 1) vars that the app needs to run are defined & shaped then typed correctly. If something's wrong, we'll get a useful error.
// 2) vars that the app needs to run are typed. This saves us a headache fixing typescript warnings while enforcing type safety.

import "dotenv/config";
import { cleanEnv, str, port } from "envalid";

export const environment = cleanEnv(process.env, {
  PORT: port(),
  NODE_ENV: str({
    choices: ["development", "production", "test"],
    default: "development",
  }),
  CLIENT_ROOT: str(),
});

// We don't want to use the environment variable directly now that we've validated it.
// To enforce this practice, we *could* set process.env to an empty object (see below) or (better yet) add a linter rule.
// We won't do either here. The first approach would break prisma and the second is overkill for the task at hand.

// process.env = {};
