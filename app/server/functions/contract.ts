import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  addContract,
  deleteContract,
  generateContract,
  terminateContract,
  updateContract,
} from "@/server/db/queries/contract/write";

// Define the input schema
const CreateContractInput = z.object({
  contract: z.object({
    boarderId: z.string().min(1, "Boarder is required"),
    startDate: z.number().min(1, "Start date is required"),
    endDate: z.number().min(1, "End date is required"),
    paymentTerms: z.string().min(1, "Payment terms are required"),
    boardingFees: z.string().min(1, "Boarding fees are required"),
    additionalServices: z.string().optional(),
    specialConditions: z.string().optional(),
    horses: z.array(z.string()).default([]),
  }),
});

export const $createContract = createServerFn(
  "POST",
  async (input: z.input<typeof CreateContractInput>) => {
    try {
      const result = CreateContractInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const contract = await addContract(result.data.contract);

      return {
        contract,
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
const DeleteContractInput = z.object({
  contractId: z.string().min(1, "Contract ID is required"),
});

export const $deleteContract = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteContractInput>) => {
    try {
      const result = DeleteContractInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteContract(result.data.contractId);

      return {
        success: true,
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
const GenerateContractInput = z.object({
  contractId: z.string().min(1, "Contract ID is required"),
});

export const $generateContract = createServerFn(
  "POST",
  async (input: z.input<typeof GenerateContractInput>) => {
    try {
      const result = GenerateContractInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const contract = await generateContract(result.data.contractId);

      return {
        contract,
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
const UpdateContractInput = z.object({
  contractId: z.string().min(1, "Contract ID is required"),
  contract: z.object({
    termsAndConditions: z.string().min(1, "Terms and conditions are required"),
    paymentTerms: z.string().min(1, "Payment terms are required"),
    status: z.string().min(1, "Status is required"),
  }),
});

export const $updateContract = createServerFn(
  "POST",
  async (input: z.input<typeof UpdateContractInput>) => {
    try {
      const result = UpdateContractInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const updatedContract = await updateContract(result.data);

      return {
        contract: updatedContract,
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
const TerminateContractInput = z.object({
  contractId: z.string().min(1, "Contract ID is required"),
});

export const $terminateContract = createServerFn(
  "POST",
  async (input: z.input<typeof TerminateContractInput>) => {
    try {
      const result = TerminateContractInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const terminatedContract = await terminateContract(
        result.data.contractId
      );

      return {
        data: terminatedContract ?? null, // the result from the query function returns undefined if no data is found, we need to that to be translated to null
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
