import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { useStartPastureRotationMutation } from "@/query/mutations/pastures";
import { pasturesListOptions } from "@/query/options/pastures";

export const Route = createFileRoute("/pastures/")({
  component: PasturesPageComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      pasturesListOptions({
        page: 1,
        pageSize: 100,
      })
    );
  },
});

function PasturesPageComponent() {
  const { data } = useSuspenseQuery(
    pasturesListOptions({
      page: 1,
      pageSize: 100,
    })
  );

  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof data)[0]>(),
    []
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Pasture Name",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link
              to={"/pastures/$pastureId"}
              params={{ pastureId: info.row.original.pastureId }}
            >
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("currentStatus", {
        header: "Current Status",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("currentOccupancy", {
        header: "Current Occupancy",
        cell: (info) => info.getValue() || "Empty",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("daysLeft", {
        header: "Days Left in Current Rotation",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("grassCondition", {
        header: "Grass Condition",
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={"/pastures/$pastureId/edit"}
                params={{
                  pastureId: info.row.original.pastureId,
                }}
              >
                Edit
              </Link>
            </Button>
            <StartPastureRotationButton
              pastureId={info.row.original.pastureId}
            />
          </div>
        ),
      }),
    ],
    [columnHelper]
  );

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <Button variant="default" asChild>
            <Link to={"/pastures/create"}>Add New Pasture</Link>
          </Button>
        </div>
        <BasicTable columns={columns} data={data} caption="List of pastures." />
      </Panel>
    </div>
  );
}

function StartPastureRotationButton({ pastureId }: { pastureId: string }) {
  const startPastureRotationMutation =
    useStartPastureRotationMutation(pastureId);
  return (
    <Button
      variant="outline"
      onClick={() => startPastureRotationMutation.mutate()}
    >
      Start Rotation
    </Button>
  );
}
