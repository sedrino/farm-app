import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { getFinancialReportById } from "@/server/db/queries/financial-report/read";

// Define the input schema
const GetFinancialReportByIdInput = z.object({
  reportId: z.string().min(1, "Report ID is required"),
});

export const $getFinancialReportById = createServerFn(
  "GET",
  async (input: z.input<typeof GetFinancialReportByIdInput>) => {
    try {
      const result = GetFinancialReportByIdInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const financialReport = await getFinancialReportById(
        result.data.reportId
      );

      return {
        data: financialReport ?? null, // the result from the query function returns undefined if no data is found, we need to that to be translated to null
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
