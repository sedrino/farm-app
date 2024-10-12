import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { addAnnouncement } from "@/server/db/queries/announcement/write";

// Define the input schema
const CreateAnnouncementInput = z.object({
  announcement: z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    scheduledAt: z.number().optional(),
    targetGroup: z.array(z.string()).optional(),
  }),
});

export const $createAnnouncement = createServerFn(
  "POST",
  async (input: z.input<typeof CreateAnnouncementInput>) => {
    try {
      const result = CreateAnnouncementInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const announcement = await addAnnouncement(result.data);
      return {
        announcement,
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
