import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useDeleteFeedingScheduleMutation } from "@/query/mutations/feeding-schedules";
import { feedingSchedulesListOptions } from "@/query/options/feeding-schedules";

const horseFeedingSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["time", "date"]).catch("time"),
});

export const Route = createFileRoute("/horses/$horseId/feeding/")({
  component: HorseFeedingPageComponent,
  validateSearch: zodSearchValidator(horseFeedingSearchSchema),
  loaderDeps: ({ search: { page, pageSize, search, sort } }) => ({
    page,
    pageSize,
    search,
    sort,
  }),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      feedingSchedulesListOptions({
        horseId: opts.params.horseId,
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
      })
    );
  },
});

function HorseFeedingPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    feedingSchedulesListOptions({
      horseId: Route.useParams().horseId,
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
      columnHelper.accessor("feedingTime", {
        header: "Feeding Time",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("feedType", {
        header: "Feed Type",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("quantity", {
        header: "Quantity",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("specialInstructions", {
        header: "Special Instructions",
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={"/horses/$horseId/feeding/$feedingScheduleId/edit"}
                params={{
                  feedingScheduleId: info.row.original.feedingScheduleId,
                }}
              >
                Edit
              </Link>
            </Button>
            <DeleteFeedingScheduleButton
              feedingScheduleId={info.row.original.feedingScheduleId}
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
            <Link
              to={"/horses/$horseId/feeding/create"}
              params={{ horseId: Route.useParams().horseId }}
            >
              Add New Feeding Schedule
            </Link>
          </Button>
        </div>
        <BasicTable columns={columns} data={data} caption="Feeding Schedule" />
      </Panel>
    </div>
  );
}

function DeleteFeedingScheduleButton({
  feedingScheduleId,
}: {
  feedingScheduleId: string;
}) {
  const deleteFeedingScheduleMutation =
    useDeleteFeedingScheduleMutation(feedingScheduleId);
  return (
    <Button
      variant="destructive"
      onClick={() => deleteFeedingScheduleMutation.mutate()}
    >
      Delete
    </Button>
  );
}