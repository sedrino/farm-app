import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findMessages, getMessageById } from "@/server/db/queries/message/read";

// Define the input schema
const GetMessageByIdInput = z.object({
  messageId: z.string().min(1, "Message ID is required"),
});

export const $getMessageById = createServerFn(
  "GET",
  async (input: z.input<typeof GetMessageByIdInput>) => {
    try {
      const result = GetMessageByIdInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const message = await getMessageById(result.data.messageId);

      return {
        data: message ?? null, // Return null if no message is found
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

// Define the input schema for listing messages
const ListMessagesInput = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
  sort: z.enum(["date", "sender"]).optional(),
});

export const $listMessages = createServerFn(
  "GET",
  async (input: z.input<typeof ListMessagesInput>) => {
    try {
      const result = ListMessagesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const messages = await findMessages(result.data);

      return {
        data: messages ?? [],
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
