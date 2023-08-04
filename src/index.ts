// index.ts
// Entry point for the application

import { app } from "./app";
import { environment } from "./utils/env";

app.listen(environment.PORT, () => {
  console.log(`Listening on port ${environment.PORT} 🚀`);
});
