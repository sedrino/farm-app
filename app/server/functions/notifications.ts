import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findNotifications } from "@/server/db/queries/notification/read";

// Define the input schema
const ListNotificationsInput = z.object({});

export const $listNotifications = createServerFn(
  "GET",
  async (input: z.input<typeof ListNotificationsInput>) => {
    try {
      const result = ListNotificationsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const notifications = await findNotifications();

      return {
        data: notifications ?? [], // Return an empty array if no notifications are found
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
