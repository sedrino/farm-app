import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findReportTypes } from "@/server/db/queries/report-type/read";
import {
  findMaintenanceReports,
  findReports,
  findSavedReports,
} from "@/server/db/queries/report/read";

// Define the input schema
const ListReportsInput = z.object({
  page: z.number().min(1).catch(1),
  pageSize: z.number().min(1).catch(10),
  search: z.string().optional(),
  sort: z.enum(["date", "type"]).catch("date"),
});

export const $listReports = createServerFn(
  "GET",
  async (input: z.input<typeof ListReportsInput>) => {
    try {
      const result = ListReportsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const reports = await findReports(result.data);

      return {
        data: reports ?? [],
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
const ListSavedReportsInput = z.object({
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).optional(),
});

export const $listSavedReports = createServerFn(
  "GET",
  async (input: z.input<typeof ListSavedReportsInput>) => {
    try {
      const result = ListSavedReportsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const savedReports = await findSavedReports(result.data);

      return {
        data: savedReports ?? [], // Return an empty array if no reports are found
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
const ListReportTypesInput = z.object({});

export const $listReportTypes = createServerFn(
  "GET",
  async (input: z.input<typeof ListReportTypesInput>) => {
    try {
      const result = ListReportTypesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const reportTypes = await findReportTypes();

      return {
        data: reportTypes ?? [], // Return an empty array if no report types are found
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
const ListMaintenanceReportsInput = z.object({
  page: z.number().min(1).catch(1),
  pageSize: z.number().min(1).catch(50),
  dateRange: z.string().optional(),
  reportType: z.string().optional(),
  stallId: z.string().optional(),
});

export const $listMaintenanceReports = createServerFn(
  "GET",
  async (input: z.input<typeof ListMaintenanceReportsInput>) => {
    try {
      const result = ListMaintenanceReportsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const reports = await findMaintenanceReports(result.data);

      return {
        data: reports ?? [],
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
