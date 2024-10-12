import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { peopleQuery } from "@/examples/query-options";

export const Route = createFileRoute("/_auth/dev/examples/basic-table")({
  component: BasicTableComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(peopleQuery);
  },
});
function BasicTableComponent() {
  const { data } = useSuspenseQuery(peopleQuery);
  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof data)[0]>(),
    []
  );
  const columns = React.useMemo(
    () => [
      columnHelper.accessor("firstName", {
        header: "First Name",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link to={"/dev/examples"}>{info.getValue()}</Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor((row) => row.lastName, {
        id: "lastName",
        cell: (info) => <i>{info.getValue()}</i>,
        header: () => <span>Last Name</span>,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("age", {
        header: () => "Age",
        cell: (info) => info.renderValue(),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("visits", {
        header: () => <span>Visits</span>,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("progress", {
        header: "Profile Progress",
        footer: (info) => info.column.id,
      }),
    ],
    [columnHelper]
  );
  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <BasicTable columns={columns} data={data} caption="List of people." />
      </Panel>
    </div>
  );
}
