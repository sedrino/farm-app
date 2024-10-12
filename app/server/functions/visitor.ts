import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  addVisitor,
  checkInVisitor,
  deleteVisitor,
} from "@/server/db/queries/visitor/write";

// Define the input schema
const CheckInVisitorInput = z.object({
  visitorId: z.string().min(1, "Visitor ID is required"),
});

export const $checkInVisitor = createServerFn(
  "POST",
  async (input: z.input<typeof CheckInVisitorInput>) => {
    try {
      const result = CheckInVisitorInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const checkedInVisitor = await checkInVisitor(result.data.visitorId);

      return {
        visitor: checkedInVisitor,
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
const CreateVisitorInput = z.object({
  visitor: z.object({
    name: z.string().min(1, "Name is required"),
    contactInfo: z.string().min(1, "Contact information is required"),
    visitorType: z.string().min(1, "Visitor type is required"),
    purpose: z.string().min(1, "Purpose is required"),
    visitDate: z.string().min(1, "Visit date is required"),
    visitTime: z.string().min(1, "Visit time is required"),
    duration: z.string().min(1, "Duration is required"),
    associatedBoarderId: z.string().optional(),
    associatedHorseId: z.string().optional(),
    specialRequirements: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const $createVisitor = createServerFn(
  "POST",
  async (input: z.input<typeof CreateVisitorInput>) => {
    try {
      const result = CreateVisitorInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const visitor = await addVisitor(result.data.visitor);

      return {
        visitor,
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
const DeleteVisitorInput = z.object({
  visitorId: z.string().min(1, "Visitor ID is required"),
});

export const $deleteVisitor = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteVisitorInput>) => {
    try {
      const result = DeleteVisitorInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteVisitor(result.data.visitorId);

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
