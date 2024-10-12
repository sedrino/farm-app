import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { addHealthRecord } from "@/server/db/queries/health-record/write";

// Define the input schema
const CreateHealthRecordInput = z.object({
  horseId: z.string().min(1, "Horse is required"),
  eventDate: z.number().min(1, "Date is required"),
  eventType: z
    .enum(["vaccination", "check-up", "injury", "treatment", "other"])
    .default("other"),
  description: z.string().min(1, "Description is required"),
  veterinarian: z.string().min(1, "Veterinarian is required"),
  medications: z.string().optional(),
  followUpRequired: z.boolean().default(false),
  followUpDate: z.number().optional(),
  documents: z.array(z.string()).default([]).optional(),
});

export const $createHealthRecord = createServerFn(
  "POST",
  async (input: z.input<typeof CreateHealthRecordInput>) => {
    try {
      const result = CreateHealthRecordInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const healthRecord = await addHealthRecord(result.data);

      return {
        healthRecord,
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
