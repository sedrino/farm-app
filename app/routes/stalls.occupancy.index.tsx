import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { stallsOccupancyOptions } from "@/query/options/stalls-occupancy";

export const Route = createFileRoute("/stalls/occupancy/")({
  component: StallsOccupancyComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      stallsOccupancyOptions({
        dateRange: "last_30_days",
      })
    );
  },
});

function StallsOccupancyComponent() {
  const { data } = useSuspenseQuery(
    stallsOccupancyOptions({
      dateRange: "last_30_days",
    })
  );

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Stall Occupancy</h1>
        <div className="mb-4">
          <p>
            Summary statistics of current occupancy rates as of{" "}
            {formatDate(Date.now())}.
          </p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Occupancy Chart</h2>
          <p>
            This chart provides a visual representation of stall occupancy and
            availability.
          </p>
          {/* Placeholder for the occupancy chart */}
          <div className="h-64 w-full bg-gray-200"></div>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Stall Details</h2>
          <ul>
            {data.stalls.map((stall) => (
              <li key={stall.stallId}>
                Stall {stall.number}: {stall.status}
              </li>
            ))}
          </ul>
        </div>
      </Panel>
    </div>
  );
}
