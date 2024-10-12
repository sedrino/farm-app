import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { useDeletePastureMutation } from "@/query/mutations/pastures";
import {
  pastureDetailsOptions,
  pastureMaintenanceHistoryOptions,
  pastureRotationHistoryOptions,
  scheduledRotationsOptions,
} from "@/query/options/pastures";

export const Route = createFileRoute("/pastures/$pastureId/")({
  component: PastureDetailsComponent,
  loader: (opts) => {
    return Promise.all([
      opts.context.queryClient.ensureQueryData(
        pastureDetailsOptions({
          pastureId: opts.params.pastureId,
        })
      ),
      opts.context.queryClient.ensureQueryData(
        pastureRotationHistoryOptions({
          pastureId: opts.params.pastureId,
        })
      ),
      opts.context.queryClient.ensureQueryData(
        pastureMaintenanceHistoryOptions({
          pastureId: opts.params.pastureId,
        })
      ),
      opts.context.queryClient.ensureQueryData(
        scheduledRotationsOptions({
          pastureId: opts.params.pastureId,
        })
      ),
    ]);
  },
});

function PastureDetailsComponent() {
  const { pastureId } = Route.useParams();
  const { data: pasture } = useSuspenseQuery(
    pastureDetailsOptions({
      pastureId,
    })
  );
  const { data: rotationHistory } = useSuspenseQuery(
    pastureRotationHistoryOptions({
      pastureId,
    })
  );
  const { data: maintenanceHistory } = useSuspenseQuery(
    pastureMaintenanceHistoryOptions({
      pastureId,
    })
  );
  const { data: scheduledRotations } = useSuspenseQuery(
    scheduledRotationsOptions({
      pastureId,
    })
  );

  const deletePastureMutation = useDeletePastureMutation(pastureId);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this pasture?")) {
      deletePastureMutation.mutate();
    }
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">{pasture.name}</h1>
        <p>
          <strong>Location:</strong> {pasture.location}
        </p>
        <p>
          <strong>Size:</strong> {pasture.size}
        </p>
        <p>
          <strong>Fencing Type:</strong> {pasture.fencingType}
        </p>
        <p>
          <strong>Water Source:</strong> {pasture.waterSource}
        </p>
        <p>
          <strong>Shade Availability:</strong> {pasture.shadeAvailability}
        </p>
        <p>
          <strong>Max Capacity:</strong> {pasture.maxCapacity}
        </p>
        <p>
          <strong>Current Status:</strong> {pasture.currentStatus}
        </p>
        <p>
          <strong>Notes:</strong> {pasture.notes}
        </p>
        <div className="mt-4 flex space-x-2">
          <Button variant="default">Edit</Button>
          <Button variant="default">Start Rotation</Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Panel>

      <Panel className="p-4">
        <h2 className="text-xl font-bold">Rotation History</h2>
        <ul>
          {rotationHistory.map((rotation) => (
            <li key={rotation.rotationId}>
              {formatDate(rotation.startDate)} - {formatDate(rotation.endDate)}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel className="p-4">
        <h2 className="text-xl font-bold">Maintenance History</h2>
        <ul>
          {maintenanceHistory.map((maintenance) => (
            <li key={maintenance.maintenanceId}>
              {formatDate(maintenance.date)} - {maintenance.description}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel className="p-4">
        <h2 className="text-xl font-bold">Upcoming Scheduled Rotations</h2>
        <ul>
          {scheduledRotations.map((rotation) => (
            <li key={rotation.rotationId}>
              {formatDate(rotation.startDate)} - {rotation.pastureId}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
