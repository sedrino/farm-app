import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useDeleteExerciseSessionMutation } from "@/query/mutations/exercise-sessions";
import { exerciseSessionsListOptions } from "@/query/options/exercise-sessions";

const exerciseCalendarSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  horseId: z.string().optional(),
  exerciseTypeId: z.string().optional(),
  trainerId: z.string().optional(),
  dateRange: z.string().optional(),
});

export const Route = createFileRoute("/horses/exercise-calendar/")({
  component: ExerciseCalendarComponent,
  validateSearch: zodSearchValidator(exerciseCalendarSearchSchema),
  loaderDeps: ({ search }) => search,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      exerciseSessionsListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
        horseId: opts.deps.horseId,
        exerciseTypeId: opts.deps.exerciseTypeId,
        trainerId: opts.deps.trainerId,
        dateRange: opts.deps.dateRange,
      })
    );
  },
});

function ExerciseCalendarComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    exerciseSessionsListOptions({
      page: search.page,
      pageSize: search.pageSize,
      horseId: search.horseId,
      exerciseTypeId: search.exerciseTypeId,
      trainerId: search.trainerId,
      dateRange: search.dateRange,
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
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("horse.name", {
        header: "Horse Name",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link
              to={"/horses/$horseId"}
              params={{ horseId: info.row.original.horse.horseId }}
            >
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("exerciseType.name", {
        header: "Exercise Type",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("startTime", {
        header: "Start Time",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("endTime", {
        header: "End Time",
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={"/exercise-sessions/$sessionId/edit"}
                params={{
                  sessionId: info.row.original.sessionId,
                }}
              >
                Edit
              </Link>
            </Button>
            <DeleteExerciseSessionButton
              sessionId={info.row.original.sessionId}
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
            <Link to={"/exercise-sessions/create"}>Add New Session</Link>
          </Button>
          {/* Add filters and view toggle here */}
        </div>
        <BasicTable columns={columns} data={data} caption="Exercise Calendar" />
      </Panel>
    </div>
  );
}

function DeleteExerciseSessionButton({ sessionId }: { sessionId: string }) {
  const deleteExerciseSessionMutation =
    useDeleteExerciseSessionMutation(sessionId);
  return (
    <Button
      variant="destructive"
      onClick={() => deleteExerciseSessionMutation.mutate()}
    >
      Delete
    </Button>
  );
}
