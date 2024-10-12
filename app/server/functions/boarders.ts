import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  findBoarders,
  getBoarderBilling,
  getBoarderById,
} from "@/server/db/queries/boarder/read";

// Define the input schema
const GetBoarderBillingInput = z.object({
  boarderId: z.string().min(1, "Boarder ID is required"),
});

export const $getBoarderBilling = createServerFn(
  "GET",
  async (input: z.input<typeof GetBoarderBillingInput>) => {
    try {
      const result = GetBoarderBillingInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const boarderBilling = await getBoarderBilling(result.data.boarderId);

      return {
        data: boarderBilling ?? null, // Return null if no data is found
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

// Define the input schema
const GetBoarderByIdInput = z.object({
  boarderId: z.string().min(1, "Boarder ID is required"),
});

export const $getBoarderById = createServerFn(
  "GET",
  async (input: z.input<typeof GetBoarderByIdInput>) => {
    try {
      const result = GetBoarderByIdInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const boarder = await getBoarderById(result.data.boarderId);

      return {
        data: boarder ?? null, // Return null if no boarder is found
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

// Define the input schema for listing boarders
const ListBoardersInput = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
  sort: z.enum(["name", "contractStatus", "lengthOfStay"]).optional(),
});

export const $listBoarders = createServerFn(
  "GET",
  async (input: z.input<typeof ListBoardersInput>) => {
    try {
      const result = ListBoardersInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const boarders = await findBoarders(result.data);

      return {
        data: boarders ?? [],
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
