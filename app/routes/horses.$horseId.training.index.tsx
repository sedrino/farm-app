import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { addDays, eachDayOfInterval, format, isWeekend, parse } from "date-fns";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useCreateExerciseLogMutation } from "@/query/mutations/exercise-logs";
import { exerciseLogsListOptions } from "@/query/options/exercise-logs";

export const Route = createFileRoute("/horses/$horseId/training/")({
  component: TrainingLogsComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      exerciseLogsListOptions({
        horseId: opts.params.horseId,
      })
    );
  },
});

function TrainingLogsComponent() {
  const { horseId } = Route.useParams();
  const { data } = useSuspenseQuery(
    exerciseLogsListOptions({
      horseId,
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
        cell: (info) => format(new Date(info.getValue()), "yyyy-MM-dd"),
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
      columnHelper.accessor("intensity", {
        header: "Intensity",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("trainer", {
        header: "Trainer",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("notes", {
        header: "Notes",
        footer: (info) => info.column.id,
      }),
    ],
    [columnHelper]
  );

  const addExerciseLogMutation = useCreateExerciseLogMutation(horseId);

  const handleAddTrainingSession = () => {
    addExerciseLogMutation.mutate({
      horseId,
      date: Date.now(),
      type: "Training",
      duration: 60,
      intensity: "Medium",
      trainer: "John Doe",
      notes: "Good performance",
    });
  };

  const trainingDays = React.useMemo(() => {
    const today = new Date();
    const next30Days = addDays(today, 30);
    return eachDayOfInterval({
      start: today,
      end: next30Days,
    }).filter((date) => !isWeekend(date));
  }, []);

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <Button variant="default" onClick={handleAddTrainingSession}>
            Add Training Session
          </Button>
        </div>
        <BasicTable columns={columns} data={data} caption="Training Logs" />
      </Panel>
    </div>
  );
}
