import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { useCancelRegistrationMutation } from "@/query/mutations/events";
import { eventDetailsOptions } from "@/query/options/events";

export const Route = createFileRoute("/events/farm-events/$eventId/")({
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
  const { data: event } = useSuspenseQuery(
    eventDetailsOptions({
      eventId,
    })
  );

  const cancelRegistrationMutation = useCancelRegistrationMutation(eventId);

  const handleCancelRegistration = () => {
    cancelRegistrationMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">{event.name}</h1>
        <p className="mb-4">{event.description}</p>
        <p className="mb-4">
          Date: {formatDate(event.startDate)} - {formatDate(event.endDate)}
        </p>
        <p className="mb-4">Location: {event.location}</p>
        <p className="mb-4">
          Participants: {event.registeredParticipants} / {event.maxParticipants}
        </p>
        <p className="mb-4">Status: {event.registrationStatus}</p>
        <div className="flex space-x-2">
          <Button variant="default">Register</Button>
          <Button variant="destructive" onClick={handleCancelRegistration}>
            Cancel Registration
          </Button>
          <Button variant="outline">Edit Event</Button>
          <Button variant="outline">Cancel Event</Button>
        </div>
      </Panel>
    </div>
  );
}
