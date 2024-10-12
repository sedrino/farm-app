import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { useDeleteEventMutation } from "@/query/mutations/events";
import { eventsListOptions } from "@/query/options/events";

const eventsSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["date", "popularity"]).catch("date"),
});

export const Route = createFileRoute("/events/reports/")({
  component: EventsReportsPageComponent,
  validateSearch: zodSearchValidator(eventsSearchSchema),
  loaderDeps: ({ search: { page, pageSize, search, sort } }) => ({
    page,
    pageSize,
    search,
    sort,
  }),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      eventsListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
      })
    );
  },
});

function EventsReportsPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    eventsListOptions({
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
        header: "Event Name",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link
              to={"/events/$eventId/edit"}
              params={{ eventId: info.row.original.eventId }}
            >
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("eventType", {
        header: "Event Type",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("startDate", {
        header: "Start Date",
        cell: (info) => formatDate(info.getValue()),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("endDate", {
        header: "End Date",
        cell: (info) => formatDate(info.getValue()),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("location", {
        header: "Location",
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={"/events/$eventId/edit"}
                params={{
                  eventId: info.row.original.eventId,
                }}
              >
                Edit
              </Link>
            </Button>
            <DeleteEventButton eventId={info.row.original.eventId} />
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
            <Link to={"/events/create"}>Create New Event</Link>
          </Button>
        </div>
        <BasicTable columns={columns} data={data} caption="List of events." />
      </Panel>
    </div>
  );
}

function DeleteEventButton({ eventId }: { eventId: string }) {
  const deleteEventMutation = useDeleteEventMutation(eventId);
  return (
    <Button variant="destructive" onClick={() => deleteEventMutation.mutate()}>
      Delete
    </Button>
  );
}