import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { examplesRoute } from "./routes/examples";
import { apiRoutes } from "./routes";
const app = new Hono();
app.use(
  "/*",
  cors({
    origin: "*",
  })
);
const port = 3000;
console.log(`Server is running on port http://localhost:${port}`);
const routes = app.route("/examples", examplesRoute).route("/", apiRoutes);
serve({
  fetch: app.fetch,
  port,
});
export type AppType = typeof routes;
