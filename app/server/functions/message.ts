import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { deleteMessage, flagMessage } from "@/server/db/queries/message/write";

// Define the input schema
const DeleteMessageInput = z.object({
  messageId: z.string().min(1, "Message ID is required"),
});

export const $deleteMessage = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteMessageInput>) => {
    try {
      const result = DeleteMessageInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteMessage(result.data.messageId);

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
const FlagMessageInput = z.object({
  messageId: z.string().min(1, "Message ID is required"),
  reason: z.string().min(1, "Reason is required"),
});

export const $flagMessage = createServerFn(
  "POST",
  async (input: z.input<typeof FlagMessageInput>) => {
    try {
      const result = FlagMessageInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const flaggedMessage = await flagMessage(result.data);

      return {
        message: flaggedMessage,
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
