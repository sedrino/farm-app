import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { reportKeys } from "@/query/options/reports";
import {
  $createReport,
  $deleteReport,
  $generateMaintenanceReport,
  $generateReport,
} from "@/server/functions/report";

export function useCreateReportMutation() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof $createReport>[0]) => {
      const result = await $createReport(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reportKeys.all(),
      });
    },
  });
}

export function useDeleteReportMutation(reportId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteReport({ reportId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reportKeys.all(),
      });
    },
  });
}

export function useGenerateMaintenanceReportMutation() {
  return useMutation({
    mutationFn: async (
      data: Parameters<typeof $generateMaintenanceReport>[0]
    ) => {
      const result = await $generateMaintenanceReport(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reportKeys.all(),
      });
    },
  });
}

export function useGenerateReportMutation() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof $generateReport>[0]) => {
      const result = await $generateReport(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reportKeys.all(),
      });
    },
  });
}
