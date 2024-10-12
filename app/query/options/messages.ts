import { queryOptions } from "@tanstack/react-query";

import { $getMessageById, $listMessages } from "@/server/functions/messages";

// Define query keys for messages
export const messageKeys = {
  all: () => [{ scope: "messages" }] as const,
  byId: ({ messageId }: { messageId: string }) =>
    [{ ...messageKeys.all()[0], messageId }] as const,
};

// Query option for fetching a single message by ID
export const messageOptions = ({ messageId }: { messageId: string }) =>
  queryOptions({
    queryKey: messageKeys.byId({ messageId }),
    queryFn: async () => {
      const response = await $getMessageById({ messageId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Message not found");
      }
      return response.data;
    },
  });

// Query option for fetching a list of messages
export const messagesListOptions = ({
  page,
  pageSize,
  search,
  sort,
}: {
  page: number;
  pageSize: number;
  search?: string;
  sort?: "date" | "sender";
}) =>
  queryOptions({
    queryKey: messageKeys.all(),
    queryFn: async () => {
      const response = await $listMessages({
        page,
        pageSize,
        search,
        sort,
      });
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
