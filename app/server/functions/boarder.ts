import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  addBoarder,
  deleteBoarder,
  updateBoarder,
} from "@/server/db/queries/boarder/write";

// Define the input schema
const CreateBoarderInput = z.object({
  boarder: z.object({
    name: z.string().min(1, "Name is required"),
    contactDetails: z.string().min(1, "Contact details are required"),
    emergencyContact: z.string().optional(),
    preferences: z.string().optional(),
    billingInfo: z.string().optional(),
    contractStatus: z.string().default("active"),
    contractDetails: z.string().optional(),
  }),
  horses: z.array(z.string()).default([]).optional(),
  documents: z.array(z.string()).default([]).optional(),
});

export const $createBoarder = createServerFn(
  "POST",
  async (input: z.input<typeof CreateBoarderInput>) => {
    try {
      const result = CreateBoarderInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const boarder = await addBoarder(result.data);

      return {
        boarder,
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
const DeleteBoarderInput = z.object({
  boarderId: z.string().min(1, "Boarder ID is required"),
});

export const $deleteBoarder = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteBoarderInput>) => {
    try {
      const result = DeleteBoarderInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteBoarder(result.data.boarderId);

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
const UpdateBoarderInput = z.object({
  boarderId: z.string().min(1, "Boarder ID is required"),
  boarder: z.object({
    name: z.string().min(1, "Name is required"),
    contactDetails: z.string().min(1, "Contact details are required"),
    emergencyContact: z.string().optional(),
    contractStatus: z.string().min(1, "Contract status is required"),
    billingInfo: z.string().optional(),
    preferences: z.string().optional(),
    profilePicture: z.string().optional(),
  }),
  horses: z.array(z.string()).default([]).optional(),
  documents: z.array(z.string()).default([]).optional(),
});

export const $updateBoarder = createServerFn(
  "POST",
  async (input: z.input<typeof UpdateBoarderInput>) => {
    try {
      const result = UpdateBoarderInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const updatedBoarder = await updateBoarder(result.data);

      return {
        boarder: updatedBoarder,
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
