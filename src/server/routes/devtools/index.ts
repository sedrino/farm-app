import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getTableData } from "@/server/db/queries";

const devToolsApp = new Hono();

export const devToolsRoute = devToolsApp.get(
  "/get-table-data",
  zValidator(
    "query",
    z.object({
      name: z.string(),
    })
  ),
  async (c) => {
    const { name } = c.req.valid("query");
    const data = await getTableData(name);
    console.log("all data", data);
    return c.json(data);
  }
);
