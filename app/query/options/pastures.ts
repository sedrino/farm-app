import { queryOptions } from "@tanstack/react-query";

import {
  $getPastureDetails,
  $listPastureMaintenanceHistory,
  $listPastureRotationHistory,
  $listPastures,
  $listScheduledRotations,
} from "@/server/functions/pastures";

// Query Key Factories
export const pastureKeys = {
  all: () => [{ scope: "pastures" }] as const,
  details: ({ pastureId }: { pastureId: string }) =>
    [{ ...pastureKeys.all()[0], pastureId }] as const,
  maintenanceHistory: ({ pastureId }: { pastureId: string }) =>
    [
      { ...pastureKeys.all()[0], pastureId, action: "maintenance-history" },
    ] as const,
  rotationHistory: ({ pastureId }: { pastureId: string }) =>
    [
      { ...pastureKeys.all()[0], pastureId, action: "rotation-history" },
    ] as const,
  scheduledRotations: ({ pastureId }: { pastureId: string }) =>
    [
      { ...pastureKeys.all()[0], pastureId, action: "scheduled-rotations" },
    ] as const,
};

// Query Options
export const pastureDetailsOptions = ({ pastureId }: { pastureId: string }) =>
  queryOptions({
    queryKey: pastureKeys.details({ pastureId }),
    queryFn: async () => {
      const response = await $getPastureDetails({ pastureId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Pasture not found");
      }
      return response.data;
    },
  });

export const pastureMaintenanceHistoryOptions = ({
  pastureId,
}: {
  pastureId: string;
}) =>
  queryOptions({
    queryKey: pastureKeys.maintenanceHistory({ pastureId }),
    queryFn: async () => {
      const response = await $listPastureMaintenanceHistory({ pastureId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        return [];
      }
      return response.data;
    },
  });

export const pastureOptions = ({ pastureId }: { pastureId: string }) =>
  queryOptions({
    queryKey: pastureKeys.details({ pastureId }),
    queryFn: async () => {
      const response = await $getPastureDetails({ pastureId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Pasture not found");
      }
      return response.data;
    },
  });

export const pastureRotationHistoryOptions = ({
  pastureId,
}: {
  pastureId: string;
}) =>
  queryOptions({
    queryKey: pastureKeys.rotationHistory({ pastureId }),
    queryFn: async () => {
      const response = await $listPastureRotationHistory({ pastureId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        return [];
      }
      return response.data;
    },
  });

export const pasturesListOptions = ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) =>
  queryOptions({
    queryKey: pastureKeys.all(),
    queryFn: async () => {
      const response = await $listPastures({ page, pageSize });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        return [];
      }
      return response.data;
    },
  });

export const scheduledRotationsOptions = ({
  pastureId,
}: {
  pastureId: string;
}) =>
  queryOptions({
    queryKey: pastureKeys.scheduledRotations({ pastureId }),
    queryFn: async () => {
      const response = await $listScheduledRotations({ pastureId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        return [];
      }
      return response.data;
    },
  });
