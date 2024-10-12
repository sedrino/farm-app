import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  addHorse,
  deleteHorse,
  updateHorse,
} from "@/server/db/queries/horse/write";

// Define the input schema
const CreateHorseInput = z.object({
  horse: z.object({
    name: z.string().min(1, "Name is required"),
    breed: z.string().min(1, "Breed is required"),
    dateOfBirth: z.string().min(1, "Date of Birth is required"),
    gender: z.string().min(1, "Gender is required"),
    color: z.string().min(1, "Color is required"),
    markings: z.string().optional(),
    height: z.number().optional(),
    weight: z.number().optional(),
    microchipNumber: z.string().optional(),
    ownerId: z.string().optional(),
    stallId: z.string().optional(),
    specialNeeds: z.string().optional(),
    medicalHistory: z.string().optional(),
    feedingPreferences: z.string().optional(),
    exercisePreferences: z.string().optional(),
    profilePicture: z.string().optional(),
    documents: z.string().optional(),
    arrivalDate: z.string().optional(),
    status: z.string().optional(),
  }),
  photos: z.array(z.string()).default([]).optional(),
  documents: z.array(z.string()).default([]).optional(),
});

export const $createHorse = createServerFn(
  "POST",
  async (input: z.input<typeof CreateHorseInput>) => {
    try {
      const result = CreateHorseInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const horse = await addHorse(result.data.horse);

      return {
        horse,
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
const DeleteHorseInput = z.object({
  horseId: z.string().min(1, "Horse ID is required"),
});

export const $deleteHorse = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteHorseInput>) => {
    try {
      const result = DeleteHorseInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteHorse(result.data.horseId);

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
const UpdateHorseInput = z.object({
  horseId: z.string().min(1, "Horse ID is required"),
  horse: z.object({
    name: z.string().min(1, "Name is required"),
    breed: z.string().min(1, "Breed is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    gender: z.string().min(1, "Gender is required"),
    color: z.string().min(1, "Color is required"),
    markings: z.string().optional(),
    height: z.number().optional(),
    weight: z.number().optional(),
    microchipNumber: z.string().optional(),
    ownerId: z.string().optional(),
    stallId: z.string().optional(),
    specialNeeds: z.string().optional(),
    medicalHistory: z.string().optional(),
    feedingPreferences: z.string().optional(),
    exercisePreferences: z.string().optional(),
    profilePicture: z.string().optional(),
    knownConditions: z.string().optional(),
    allergies: z.string().optional(),
    currentMedication: z.string().optional(),
    documents: z.string().optional(),
    photos: z.string().optional(),
    arrivalDate: z.string().min(1, "Arrival date is required"),
    lastViewed: z.string().optional(),
    status: z.string().optional(),
  }),
});

export const $updateHorse = createServerFn(
  "POST",
  async (input: z.input<typeof UpdateHorseInput>) => {
    try {
      const result = UpdateHorseInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const updatedHorse = await updateHorse(result.data);

      return {
        horse: updatedHorse,
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
