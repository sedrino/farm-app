import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { announcementKeys } from "@/query/options/announcements";
import { $createAnnouncement } from "@/server/functions/announcement";

export function useCreateAnnouncementMutation() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof $createAnnouncement>[0]) => {
      const result = await $createAnnouncement(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: announcementKeys.all(),
      });
    },
  });
}
