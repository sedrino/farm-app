import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { useDeleteEventMutation } from "@/query/mutations/events";
import { eventDetailsOptions } from "@/query/options/events";

export const Route = createFileRoute("/events/$eventId/")({
  component: EventDetailsComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      eventDetailsOptions({
        eventId: opts.params.eventId,
      })
    );
  },
});

function EventDetailsComponent() {
  const { eventId } = Route.useParams();
  const { data } = useSuspenseQuery(
    eventDetailsOptions({
      eventId,
    })
  );

  const deleteEventMutation = useDeleteEventMutation(eventId);

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="text-2xl font-bold">{data.name}</h1>
        <p className="mt-2 text-lg">
          {formatDate(data.startDate)} - {formatDate(data.endDate)}
        </p>
        <p className="mt-2 text-lg">{data.location}</p>
        <p className="mt-2">{data.description}</p>
        {data.specialInstructions && (
          <p className="mt-2 font-semibold">
            Special Instructions: {data.specialInstructions}
          </p>
        )}
        <div className="mt-4 flex space-x-2">
          <Button variant="default">Edit</Button>
          <Button
            variant="destructive"
            onClick={() => deleteEventMutation.mutate()}
          >
            Delete
          </Button>
          <Button variant="outline">Cancel</Button>
          <Button variant="outline">Reschedule</Button>
          <Button variant="outline">Duplicate</Button>
        </div>
      </Panel>
      <Panel className="p-4">
        <h2 className="text-xl font-bold">Participants</h2>
        <ul>
          {data.participants.map((participant) => (
            <li key={participant.userId}>
              {participant.name} - {participant.contactInfo}
            </li>
          ))}
        </ul>
      </Panel>
      <Panel className="p-4">
        <h2 className="text-xl font-bold">Comments/Notes</h2>
        <textarea className="w-full rounded border p-2" rows={4} />
      </Panel>
      <Panel className="p-4">
        <h2 className="text-xl font-bold">Related Documents</h2>
        <ul>
          {data.documents.map((document) => (
            <li key={document.documentId}>
              <a href={document.fileUrl}>{document.fileName}</a>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
