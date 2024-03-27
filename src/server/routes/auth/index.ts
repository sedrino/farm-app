import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { createUser } from "@/server/db/inserts";
export const newUserSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
});
const authApp = new Hono();

export const authRoute = authApp.post(
  "/register",
  zValidator("form", newUserSchema),
  async (c) => {
    const newUser = c.req.valid("form");
    // create user
    await createUser(newUser.email, newUser.first_name, newUser.last_name);
    return c.json({
      message: `created!`,
    });
  }
);
