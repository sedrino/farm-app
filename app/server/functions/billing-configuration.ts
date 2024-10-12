import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { updateBillingConfiguration } from "@/server/db/queries/billing-configuration/write";

// Define the input schema
const UpdateBillingConfigurationInput = z.object({
  billingConfiguration: z.object({
    defaultPaymentTerms: z.string().optional(),
    taxRate: z.number().optional(),
    standardServiceRates: z
      .object({
        boarding: z.number().optional(),
        additionalServices: z.number().optional(),
      })
      .optional(),
    automaticBillingEnabled: z.boolean().optional(),
    acceptedPaymentMethods: z.array(z.string()).optional(),
    invoiceEmailTemplate: z.string().optional(),
    reminderEmailTemplate: z.string().optional(),
  }),
});

export const $updateBillingConfiguration = createServerFn(
  "POST",
  async (input: z.input<typeof UpdateBillingConfigurationInput>) => {
    try {
      const result = UpdateBillingConfigurationInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const updatedConfiguration = await updateBillingConfiguration(
        result.data
      );

      return {
        billingConfiguration: updatedConfiguration,
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
