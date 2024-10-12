import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findBoardingContracts } from "@/server/db/queries/boarding-contract/read";

// Define the input schema
const ListBoardingContractsInput = z.object({
  page: z.number().min(1).catch(1),
  pageSize: z.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["startDate", "endDate", "status"]).catch("startDate"),
});

export const $listBoardingContracts = createServerFn(
  "GET",
  async (input: z.input<typeof ListBoardingContractsInput>) => {
    try {
      const result = ListBoardingContractsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const contracts = await findBoardingContracts(result.data);

      return {
        data: contracts ?? [],
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
