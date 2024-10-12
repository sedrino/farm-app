import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  findHorsesPaginated,
  getHorseById,
} from "@/server/db/queries/horse/read";

// Define the input schema
const GetHorseByIdInput = z.object({
  horseId: z.string().min(1, "Horse ID is required"),
});

export const $getHorseById = createServerFn(
  "GET",
  async (input: z.input<typeof GetHorseByIdInput>) => {
    try {
      const result = GetHorseByIdInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const horse = await getHorseById(result.data.horseId);

      return {
        data: horse ?? null, // Return null if no horse is found
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

// Define the input schema for listing horses
const ListHorsesInput = z.object({
  page: z.number().catch(1),
  pageSize: z.number().catch(50),
  search: z.string().optional(),
  breed: z.string().optional(),
  ageRange: z.string().optional(),
  specialNeeds: z.string().optional(),
});

export const $listHorses = createServerFn(
  "GET",
  async (input: z.input<typeof ListHorsesInput>) => {
    try {
      const result = ListHorsesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const horses = await findHorsesPaginated(result.data);

      return {
        data: horses ?? [],
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
