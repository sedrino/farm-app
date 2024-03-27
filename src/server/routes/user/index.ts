import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getUsers } from "@/server/db/queries";
import { createUser } from "@/server/db/inserts";
const names: any = [];

const schema = z.object({
  id: z.string(),
  name: z.string(),
});

const userApp = new Hono();

export const userRoute = userApp
  .get("/", async (c) => {
    const users = await getUsers();
    console.log("sql-lite", users);
    return c.text("Hello Hono!");
  })
  .get(
    "/hello",
    zValidator(
      "query",
      z.object({
        name: z.string(),
      })
    ),
    (c) => {
      const { name } = c.req.valid("query");
      return c.json({
        message: `Hello! ${name}`,
      });
    }
  )
  .post("/create", async (c) => {
    const randomEmail = Math.random().toString(36).substring(7) + "@gmail.com";
    const randomFirstName = Math.random().toString(36).substring(7);
    const randomLastName = Math.random().toString(36).substring(7);
    const createdUser = await createUser(
      randomEmail,
      randomFirstName,
      randomLastName
    );
    return c.json({
      message: `created! here is a db usage example:  ${createdUser}`,
    });
  })
  .post("/name", zValidator("form", schema), async (c) => {
    const name = c.req.valid("form");
    names.push(name.name);
    return c.json({
      message: `created! here is a db usage example:  ${names.concat()}`,
    });
  });
