import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { useDeleteVisitorMutation } from "@/query/mutations/visitors";
import { visitorsListOptions } from "@/query/options/visitors";

const visitorsSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["name", "type", "date"]).catch("name"),
});

export const Route = createFileRoute("/visitors/")({
  component: VisitorsPageComponent,
  validateSearch: zodSearchValidator(visitorsSearchSchema),
  loaderDeps: ({ search: { page, pageSize, search, sort } }) => ({
    page,
    pageSize,
    search,
    sort,
  }),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      visitorsListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
      })
    );
  },
});

function VisitorsPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    visitorsListOptions({
      page: search.page,
      pageSize: search.pageSize,
    })
  );

  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof data)[0]>(),
    []
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link
              to={`/visitors/${info.row.original.visitorId}`}
              params={{ visitorId: info.row.original.visitorId }}
            >
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("type", {
        header: "Type",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("lastVisitDate", {
        header: "Last Visit Date",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={`/visitors/${info.row.original.visitorId}/edit`}
                params={{
                  visitorId: info.row.original.visitorId,
                }}
              >
                Edit
              </Link>
            </Button>
            <DeleteVisitorButton visitorId={info.row.original.visitorId} />
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
          <Input placeholder="Search visitors..." />
          <Button variant="default" asChild>
            <Link to="/visitors/create">Add New Visitor</Link>
          </Button>
        </div>
        <BasicTable columns={columns} data={data} caption="List of visitors." />
      </Panel>
    </div>
  );
}

function DeleteVisitorButton({ visitorId }: { visitorId: string }) {
  const deleteVisitorMutation = useDeleteVisitorMutation(visitorId);
  return (
    <Button
      variant="destructive"
      onClick={() => deleteVisitorMutation.mutate()}
    >
      Delete
    </Button>
  );
}