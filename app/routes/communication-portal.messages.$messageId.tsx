import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/query/client";
import { useFlagMessageMutation } from "@/query/mutations/messages";
import { messageOptions } from "@/query/options/messages";

export const Route = createFileRoute(
  "/communication-portal/messages/$messageId"
)({
  component: MessageThreadComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      messageOptions({
        messageId: opts.params.messageId,
      })
    );
  },
});

function MessageThreadComponent() {
  const { messageId } = Route.useParams();
  const { data } = useSuspenseQuery(
    messageOptions({
      messageId,
    })
  );

  const flagMessageMutation = useFlagMessageMutation(messageId);

  const handleFlagMessage = () => {
    flagMessageMutation.mutate({
      reason: "Inappropriate content",
    });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Message Thread</h1>
        <div className="mt-2">
          <h2 className="text-xl font-semibold">Conversation History</h2>
          <ul>
            {data.messages.map((message) => (
              <li key={message.messageId}>
                <strong>{message.senderName}:</strong> {message.content}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Reply</h2>
        <Textarea placeholder="Type your reply here..." />
      </div>

      <div className="mb-4 flex space-x-2">
        <Button type="button" variant="outline">
          Add Attachment
        </Button>
        <Button type="button" variant="outline">
          Add Photo
        </Button>
        <Button type="button" variant="outline" onClick={handleFlagMessage}>
          Flag Conversation
        </Button>
        <Button type="button" variant="outline">
          Archive Conversation
        </Button>
        <Button type="button" variant="outline">
          Close Conversation
        </Button>
      </div>
    </div>
  );
}
