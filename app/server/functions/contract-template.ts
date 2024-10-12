import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { deleteContractTemplate } from "@/server/db/queries/contract-template/write";

// Define the input schema
const DeleteContractTemplateInput = z.object({
  templateId: z.string().min(1, "Template ID is required"),
});

export const $deleteContractTemplate = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteContractTemplateInput>) => {
    try {
      const result = DeleteContractTemplateInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteContractTemplate(result.data.templateId);

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
