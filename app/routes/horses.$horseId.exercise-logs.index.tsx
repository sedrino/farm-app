import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useDeleteExerciseLogMutation } from "@/query/mutations/exercise-logs";
import { exerciseLogsListOptions } from "@/query/options/exercise-logs";

const exerciseLogsSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  horseId: z.string().min(1, "Horse ID is required"),
});

export const Route = createFileRoute("/horses/$horseId/exercise-logs/")({
  component: ExerciseLogsPageComponent,
  validateSearch: zodSearchValidator(exerciseLogsSearchSchema),
  loaderDeps: ({ search: { page, pageSize } }) => ({ page, pageSize }),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      exerciseLogsListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
        horseId: opts.params.horseId,
      })
    );
  },
});

function ExerciseLogsPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    exerciseLogsListOptions({
      page: search.page,
      pageSize: search.pageSize,
      horseId: search.horseId,
    })
  );

  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof data)[0]>(),
    []
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("type", {
        header: "Type",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("duration", {
        header: "Duration",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("summary", {
        header: "Summary",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link
              to={"/horses/$horseId/exercise-logs/$exerciseLogId"}
              params={{
                exerciseLogId: info.row.original.exerciseLogId,
                horseId: info.row.original.horseId,
              }}
            >
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <DeleteExerciseLogButton
              exerciseLogId={info.row.original.exerciseLogId}
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
              to={"/horses/$horseId/exercise-logs/create"}
              params={{ horseId: search.horseId }}
            >
              Add New Log
            </Link>
          </Button>
          {/* TODO: Add filters and calendar view toggle */}
        </div>
        <BasicTable
          columns={columns}
          data={data}
          caption="List of exercise logs."
        />
        <div className="mt-4">
          <h2 className="text-xl font-bold">Summary</h2>
          <p>
            Total exercise time this month: {/* TODO: Calculate and display */}
          </p>
          <p>Most frequent activities: {/* TODO: Calculate and display */}</p>
          <p>Notable achievements: {/* TODO: Calculate and display */}</p>
        </div>
      </Panel>
    </div>
  );
}

function DeleteExerciseLogButton({ exerciseLogId }: { exerciseLogId: string }) {
  const deleteExerciseLogMutation = useDeleteExerciseLogMutation(exerciseLogId);
  return (
    <Button
      variant="destructive"
      onClick={() => deleteExerciseLogMutation.mutate()}
    >
      Delete
    </Button>
  );
}