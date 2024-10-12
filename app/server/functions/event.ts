import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  addEvent,
  cancelRegistration,
  deleteEvent,
  updateEvent,
} from "@/server/db/queries/event/write";

// Define the input schema
const CancelRegistrationInput = z.object({
  eventId: z.string().min(1, "Event ID is required"),
});

export const $cancelRegistration = createServerFn(
  "POST",
  async (input: z.input<typeof CancelRegistrationInput>) => {
    try {
      const result = CancelRegistrationInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const cancellationResult = await cancelRegistration(result.data.eventId);

      return {
        success: cancellationResult,
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
const CreateEventInput = z.object({
  event: z.object({
    title: z.string().min(1, "Event title is required"),
    eventType: z.string().min(1, "Event type is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    location: z.string().min(1, "Location is required"),
    description: z.string().optional(),
    participantLimit: z.number().optional(),
    associatedCosts: z.number().optional(),
    notificationSettings: z.array(z.string()).default([]).optional(),
    isRecurring: z.boolean().default(false),
    maxParticipants: z.number().optional(),
    isPublic: z.boolean().default(false),
    registrationRequirements: z.string().optional(),
    registrationFees: z.number().optional(),
  }),
  participants: z.array(z.string()).default([]).optional(),
  attachments: z.array(z.string()).default([]).optional(),
});

export const $createEvent = createServerFn(
  "POST",
  async (input: z.input<typeof CreateEventInput>) => {
    try {
      const result = CreateEventInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const event = await addEvent(result.data.event);

      return {
        event,
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
const DeleteEventInput = z.object({
  eventId: z.string().min(1, "Event ID is required"),
});

export const $deleteEvent = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteEventInput>) => {
    try {
      const result = DeleteEventInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteEvent(result.data.eventId);

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
const UpdateEventInput = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  event: z.object({
    name: z.string().min(1, "Name is required"),
    eventType: z.string().min(1, "Event type is required"),
    startDate: z.number().min(1, "Start date is required"),
    endDate: z.number().min(1, "End date is required"),
    location: z.string().min(1, "Location is required"),
    description: z.string().optional(),
    maxParticipants: z.number().optional(),
    isPublic: z.boolean().default(false),
    capacity: z.number().optional(),
    revenue: z.number().optional(),
    color: z.string().optional(),
    eventCategory: z.string().optional(),
    recurrencePattern: z.string().optional(),
    isRecurring: z.boolean().default(false),
  }),
});

export const $updateEvent = createServerFn(
  "POST",
  async (input: z.input<typeof UpdateEventInput>) => {
    try {
      const result = UpdateEventInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const updatedEvent = await updateEvent(result.data);

      return {
        event: updatedEvent,
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
