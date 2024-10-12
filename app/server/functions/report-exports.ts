import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  findReportExports,
  getReportExportById,
} from "@/server/db/queries/report-export/read";

// Define the input schema
const ListReportExportsInput = z.object({});

export const $listReportExports = createServerFn(
  "GET",
  async (input: z.input<typeof ListReportExportsInput>) => {
    try {
      const result = ListReportExportsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const reportExports = await findReportExports();

      return {
        data: reportExports ?? [], // Return an empty array if no data is found
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
const GetReportExportByIdInput = z.object({
  reportExportId: z.string().min(1, "Report Export ID is required"),
});

export const $getReportExportById = createServerFn(
  "GET",
  async (input: z.input<typeof GetReportExportByIdInput>) => {
    try {
      const result = GetReportExportByIdInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const reportExport = await getReportExportById(
        result.data.reportExportId
      );

      return {
        data: reportExport ?? null, // the result from the query function returns undefined if no data is found, we need to that to be translated to null
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
