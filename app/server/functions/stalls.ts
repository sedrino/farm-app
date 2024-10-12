import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findStallFeatures } from "@/server/db/queries/stall-feature/read";
import {
  findStalls,
  findStallsOccupancy,
  getStallById,
  getStallsMap,
} from "@/server/db/queries/stall/read";

// Define the input schema
const ListStallsOccupancyInput = z.object({
  dateRange: z.string().min(1, "Date range is required"),
});

export const $listStallsOccupancy = createServerFn(
  "GET",
  async (input: z.input<typeof ListStallsOccupancyInput>) => {
    try {
      const result = ListStallsOccupancyInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const stallsOccupancy = await findStallsOccupancy(result.data.dateRange);

      return {
        data: stallsOccupancy ?? [], // Return an empty array if no data is found
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
const ListStallFeaturesInput = z.object({});

export const $listStallFeatures = createServerFn(
  "GET",
  async (input: z.input<typeof ListStallFeaturesInput>) => {
    try {
      const result = ListStallFeaturesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const stallFeatures = await findStallFeatures();

      return {
        data: stallFeatures ?? [], // Return an empty array if no features are found
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
const GetStallByIdInput = z.object({
  stallId: z.string().min(1, "Stall ID is required"),
});

export const $getStallById = createServerFn(
  "GET",
  async (input: z.input<typeof GetStallByIdInput>) => {
    try {
      const result = GetStallByIdInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const stall = await getStallById(result.data.stallId);

      return {
        data: stall ?? null, // the result from the query function returns undefined if no data is found, we need to that to be translated to null
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
const GetStallsMapInput = z.object({
  barnId: z.string().min(1, "Barn ID is required"),
});

export const $getStallsMap = createServerFn(
  "GET",
  async (input: z.input<typeof GetStallsMapInput>) => {
    try {
      const result = GetStallsMapInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const stallsMap = await getStallsMap(result.data.barnId);

      return {
        data: stallsMap ?? null, // the result from the query function returns undefined if no data is found, we need to that to be translated to null
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
const ListStallsInput = z.object({
  page: z.number().min(1).catch(1),
  pageSize: z.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["stallNumber", "status", "lastCleaned"]).catch("stallNumber"),
});

export const $listStalls = createServerFn(
  "GET",
  async (input: z.input<typeof ListStallsInput>) => {
    try {
      const result = ListStallsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const stalls = await findStalls(result.data);

      return {
        data: stalls ?? [],
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
