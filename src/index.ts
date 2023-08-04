// index.ts
// Entry point for the application. Sometimes it's nice to have this separate from app.ts.
// Sometimes the app file can get unwieldy and I like separating huge modules with instantiation logic.

import { app } from "./app";
import { environment } from "./utils/environment";

app.listen(environment.PORT, () => {
  console.log(`Listening on port ${environment.PORT} 🚀`);
});
