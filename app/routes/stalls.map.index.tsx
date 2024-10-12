import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { stallsMapOptions } from "@/query/options/stalls";

export const Route = createFileRoute("/stalls/map/")({
  component: StallsMapComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      stallsMapOptions({
        barnId: opts.params.barnId,
      })
    );
  },
});

function StallsMapComponent() {
  const { barnId } = Route.useParams();
  const { data } = useSuspenseQuery(
    stallsMapOptions({
      barnId,
    })
  );

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Barn Layout - Stall Map</h1>
        <div className="relative">
          {/* Placeholder for the interactive map */}
          <div className="h-96 w-full bg-gray-200">
            {/* Map representation goes here */}
          </div>
          <div className="absolute right-0 top-0 p-4">
            <Button variant="outline">Print Map</Button>
          </div>
        </div>
      </Panel>
      <Panel className="p-4">
        <h2 className="text-xl font-bold">Stall Occupancy Summary</h2>
        <ul>
          <li>Total Stalls: {data.totalStalls}</li>
          <li>Occupied Stalls: {data.occupiedStalls}</li>
          <li>Available Stalls: {data.availableStalls}</li>
          <li>Stalls Under Maintenance: {data.maintenanceStalls}</li>
        </ul>
      </Panel>
    </div>
  );
}
