import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  findContracts,
  getContractById,
} from "@/server/db/queries/contract/read";

// Define the input schema
const GetContractByIdInput = z.object({
  contractId: z.string().min(1, "Contract ID is required"),
});

export const $getContractById = createServerFn(
  "GET",
  async (input: z.input<typeof GetContractByIdInput>) => {
    try {
      const result = GetContractByIdInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const contract = await getContractById(result.data.contractId);

      return {
        data: contract ?? null, // Return null if no contract is found
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
const ListContractsInput = z.object({
  boarderId: z.string().optional(),
  page: z.number().catch(1),
  pageSize: z.number().catch(50),
  search: z.string().optional(),
  sort: z
    .enum(["expiring_soon", "revenue_projection", "renewal_rate"])
    .catch("expiring_soon"),
});

export const $listContracts = createServerFn(
  "GET",
  async (input: z.input<typeof ListContractsInput>) => {
    try {
      const result = ListContractsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const contracts = await findContracts(result.data);

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
