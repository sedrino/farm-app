import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  findEvents,
  findEventsByType,
  getEventById,
} from "@/server/db/queries/event/read";

// Define the input schema
const GetEventByIdInput = z.object({
  eventId: z.string().min(1, "Event ID is required"),
});

export const $getEventById = createServerFn(
  "GET",
  async (input: z.input<typeof GetEventByIdInput>) => {
    try {
      const result = GetEventByIdInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const event = await getEventById(result.data.eventId);

      return {
        data: event ?? null, // Return null if no event is found
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

// Define the input schema for listing events
const ListEventsInput = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  eventType: z.string().optional(),
  dateRange: z
    .object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    })
    .optional(),
  facilityId: z.string().optional(),
  participantId: z.string().optional(),
});

export const $listEvents = createServerFn(
  "GET",
  async (input: z.input<typeof ListEventsInput>) => {
    try {
      const result = ListEventsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const events = await findEvents(result.data);

      return {
        data: events ?? [],
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
const ListEventsByTypeInput = z.object({
  eventType: z.string().min(1, "Event type is required"),
  page: z.number().optional(),
  pageSize: z.number().optional(),
});

export const $listEventsByType = createServerFn(
  "GET",
  async (input: z.input<typeof ListEventsByTypeInput>) => {
    try {
      const result = ListEventsByTypeInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const events = await findEventsByType(result.data);

      return {
        data: events ?? [],
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
