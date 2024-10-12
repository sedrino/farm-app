import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findVisitors, getVisitorById } from "@/server/db/queries/visitor/read";

// Define the input schema
const GetVisitorByIdInput = z.object({
  visitorId: z.string().min(1, "Visitor ID is required"),
});

export const $getVisitorById = createServerFn(
  "GET",
  async (input: z.input<typeof GetVisitorByIdInput>) => {
    try {
      const result = GetVisitorByIdInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const visitor = await getVisitorById(result.data.visitorId);

      return {
        data: visitor ?? null, // Return null if no visitor is found
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: error.message,
        };
      } else {
        return {
          error: "Unknown error",
        };
      }
    }
  }
);

// Define the input schema for listing visitors
const ListVisitorsInput = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
  sort: z.enum(["name", "type", "date"]).optional(),
});

export const $listVisitors = createServerFn(
  "GET",
  async (input: z.input<typeof ListVisitorsInput>) => {
    try {
      const result = ListVisitorsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const visitors = await findVisitors(result.data);

      return {
        data: visitors ?? [],
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: error.message,
        };
      } else {
        return {
          error: "Unknown error",
        };
      }
    }
  }
);
