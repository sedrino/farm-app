import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import {
  useDeleteStallMutation,
  useUpdateStallMutation,
} from "@/query/mutations/stalls";
import { stallDetailsOptions } from "@/query/options/stalls";

export const Route = createFileRoute("/stalls/$stallId/")({
  component: StallDetailsComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      stallDetailsOptions({
        stallId: opts.params.stallId,
      })
    );
  },
});

function StallDetailsComponent() {
  const { stallId } = Route.useParams();
  const { data: stall } = useSuspenseQuery(
    stallDetailsOptions({
      stallId,
    })
  );
  const deleteStallMutation = useDeleteStallMutation(stallId);
  const updateStallMutation = useUpdateStallMutation(stallId);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this stall?")) {
      deleteStallMutation.mutate();
    }
  };

  const handleUpdate = () => {
    // Logic to update stall information
    updateStallMutation.mutate({
      stallId,
      stallData: {
        // Updated stall data
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="text-2xl font-bold">Stall Details</h1>
        <div className="mt-4">
          <h2 className="text-xl">Stall Information</h2>
          <p>
            <strong>Stall Number:</strong> {stall.number}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {stall.isAvailable ? "Available" : "Occupied"}
          </p>
          {stall.currentHorseId && (
            <p>
              <strong>Current Occupant:</strong>{" "}
              <a href={`/horses/${stall.currentHorseId}`}>Horse Profile</a>
            </p>
          )}
          <p>
            <strong>Size:</strong> {stall.size}
          </p>
          <p>
            <strong>Features:</strong> {stall.features}
          </p>
          <p>
            <strong>Customizations:</strong> {stall.customizations}
          </p>
          <p>
            <strong>Special Requirements:</strong> {stall.notes}
          </p>
        </div>
        <div className="mt-4">
          <h2 className="text-xl">Maintenance History</h2>
          <ul>
            {stall.maintenanceTasks.map((task) => (
              <li key={task.maintenanceTaskId}>
                {task.taskName} - {formatDate(task.scheduledDate)}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <h2 className="text-xl">Location on Barn Map</h2>
          {/* Placeholder for barn map location */}
          <p>
            Stall is located at coordinates ({stall.xCoordinate},{" "}
            {stall.yCoordinate})
          </p>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button onClick={handleUpdate}>Edit Stall Info</Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete Stall
          </Button>
          <Button
            onClick={() =>
              updateStallMutation.mutate({
                stallId,
                stallData: {
                  isAvailable: !stall.isAvailable,
                },
              })
            }
          >
            Mark as {stall.isAvailable ? "Occupied" : "Available"}
          </Button>
        </div>
      </Panel>
    </div>
  );
}
