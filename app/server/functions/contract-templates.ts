import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findContractTemplates } from "@/server/db/queries/contract-template/read";

// Define the input schema
const ListContractTemplatesInput = z.object({
  page: z.number().min(1).catch(1),
  pageSize: z.number().min(1).catch(10),
  search: z.string().optional(),
});

export const $listContractTemplates = createServerFn(
  "GET",
  async (input: z.input<typeof ListContractTemplatesInput>) => {
    try {
      const result = ListContractTemplatesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const contractTemplates = await findContractTemplates(result.data);

      return {
        data: contractTemplates ?? [],
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
