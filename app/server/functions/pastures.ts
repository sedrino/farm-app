import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  findPastureMaintenanceHistory,
  findPastureRotationHistory,
  findPastures,
  findScheduledRotations,
  getPastureDetails,
} from "@/server/db/queries/pasture/read";

// Define the input schema
const GetPastureDetailsInput = z.object({
  pastureId: z.string().min(1, "Pasture ID is required"),
});

export const $getPastureDetails = createServerFn(
  "GET",
  async (input: z.input<typeof GetPastureDetailsInput>) => {
    try {
      const result = GetPastureDetailsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const pastureDetails = await getPastureDetails(result.data.pastureId);

      return {
        data: pastureDetails ?? null, // the result from the query function returns undefined if no data is found, we need to that to be translated to null
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
const ListPastureMaintenanceHistoryInput = z.object({
  pastureId: z.string().min(1, "Pasture ID is required"),
});

export const $listPastureMaintenanceHistory = createServerFn(
  "GET",
  async (input: z.input<typeof ListPastureMaintenanceHistoryInput>) => {
    try {
      const result = ListPastureMaintenanceHistoryInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const maintenanceHistory = await findPastureMaintenanceHistory(
        result.data.pastureId
      );

      return {
        data: maintenanceHistory ?? [], // Return an empty array if no data is found
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
const ListPastureRotationHistoryInput = z.object({
  pastureId: z.string().min(1, "Pasture ID is required"),
});

export const $listPastureRotationHistory = createServerFn(
  "GET",
  async (input: z.input<typeof ListPastureRotationHistoryInput>) => {
    try {
      const result = ListPastureRotationHistoryInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const rotationHistory = await findPastureRotationHistory(
        result.data.pastureId
      );

      return {
        data: rotationHistory ?? [], // Return an empty array if no data is found
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
const ListPasturesInput = z.object({
  page: z.number().min(1).catch(1),
  pageSize: z.number().min(1).catch(50),
});

export const $listPastures = createServerFn(
  "GET",
  async (input: z.input<typeof ListPasturesInput>) => {
    try {
      const result = ListPasturesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const pastures = await findPastures(result.data);

      return {
        data: pastures ?? [], // Return an empty array if no pastures are found
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
const ListScheduledRotationsInput = z.object({
  pastureId: z.string().min(1, "Pasture ID is required"),
});

export const $listScheduledRotations = createServerFn(
  "GET",
  async (input: z.input<typeof ListScheduledRotationsInput>) => {
    try {
      const result = ListScheduledRotationsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const scheduledRotations = await findScheduledRotations(
        result.data.pastureId
      );

      return {
        data: scheduledRotations ?? [], // Return an empty array if no data is found
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
