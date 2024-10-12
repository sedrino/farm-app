import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { useCheckInVisitorMutation } from "@/query/mutations/visitors";
import { visitorDetailsOptions } from "@/query/options/visitors";

export const Route = createFileRoute("/visitors/$visitorId/")({
  component: VisitorDetailsComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      visitorDetailsOptions({
        visitorId: opts.params.visitorId,
      })
    );
  },
});

function VisitorDetailsComponent() {
  const { visitorId } = Route.useParams();
  const { data: visitor } = useSuspenseQuery(
    visitorDetailsOptions({
      visitorId,
    })
  );
  const checkInVisitorMutation = useCheckInVisitorMutation(visitorId);

  const handleCheckIn = () => {
    checkInVisitorMutation.mutate(undefined, {
      onSuccess: () => {
        // Optionally, you can update the UI or show a success message
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Visitor Details</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            {visitor.name} ({visitor.type})
          </h2>
          <p>Contact Information: {visitor.contactInfo}</p>
          <p>Special Instructions: {visitor.specialInstructions}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Visit History</h3>
          <ul>
            {visitor.visits.map((visit) => (
              <li key={visit.visitId}>
                {formatDate(visit.visitDate)} - {visit.purpose}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Upcoming Scheduled Visits</h3>
          <ul>
            {visitor.scheduledVisits.map((scheduledVisit) => (
              <li key={scheduledVisit.scheduledVisitId}>
                {formatDate(scheduledVisit.scheduledDate)} -{" "}
                {scheduledVisit.purpose}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            Associated Boarders or Horses
          </h3>
          <ul>
            {visitor.associatedBoarders.map((boarder) => (
              <li key={boarder.boarderId}>{boarder.name}</li>
            ))}
            {visitor.associatedHorses.map((horse) => (
              <li key={horse.horseId}>{horse.name}</li>
            ))}
          </ul>
        </div>
        <div className="flex space-x-2">
          <Button variant="default" asChild>
            <Link
              to={"/visitors/$visitorId/edit"}
              params={{
                visitorId,
              }}
            >
              Edit Visitor
            </Link>
          </Button>
          <Button variant="outline" onClick={handleCheckIn}>
            Check In
          </Button>
          <Button variant="outline">
            <Link
              to={"/visitors/$visitorId/schedule-visit"}
              params={{
                visitorId,
              }}
            >
              Schedule Visit
            </Link>
          </Button>
          <Button variant="destructive">
            <Link
              to={"/visitors/$visitorId/remove-access"}
              params={{
                visitorId,
              }}
            >
              Remove Access
            </Link>
          </Button>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Notes</h3>
          <textarea
            className="w-full border border-gray-300 p-2"
            rows={4}
            placeholder="Add notes about the visitor"
          />
        </div>
      </Panel>
    </div>
  );
}
