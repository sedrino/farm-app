import React from "react";
import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/ui/basic-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/query/client";
import {
  useCreateMaintenanceTaskMutation,
  useDeleteMaintenanceTaskMutation,
} from "@/query/mutations/maintenance-tasks";
import { maintenanceTasksListOptions } from "@/query/options/maintenance-tasks";

export const Route = createFileRoute("/stalls/maintenance/")({
  component: MaintenanceTasksPageComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      maintenanceTasksListOptions({
        page: 1,
        pageSize: 100,
      })
    );
  },
});

function MaintenanceTasksPageComponent() {
  const { data } = useSuspenseQuery(
    maintenanceTasksListOptions({
      page: 1,
      pageSize: 100,
    })
  );

  const columnHelper = React.useMemo(
    () =>
      createColumnHelper<
        (typeof data)[0] extends undefined ? never : (typeof data)[0]
      >(),
    []
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("taskName", {
        header: "Task Name",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("scheduledDate", {
        header: "Scheduled Date",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("stallId", {
        header: "Stall",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("maintenanceType", {
        header: "Maintenance Type",
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
                to={`/stalls/maintenance/${info.row.original.maintenanceTaskId}/edit`}
              >
                Edit
              </Link>
            </Button>
            <DeleteMaintenanceTaskButton
              taskId={info.row.original.maintenanceTaskId}
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
          <Input placeholder="Search tasks..." />
          <Button variant="default" asChild>
            <Link to={"/stalls/maintenance/create"}>Add New Task</Link>
          </Button>
        </div>
        {data && (
          <BasicTable
            columns={columns}
            data={data}
            caption="List of maintenance tasks."
          />
        )}
      </Panel>
    </div>
  );
}

function DeleteMaintenanceTaskButton({ taskId }: { taskId: string }) {
  const deleteMaintenanceTaskMutation =
    useDeleteMaintenanceTaskMutation(taskId);
  return (
    <Button
      variant="destructive"
      onClick={() => deleteMaintenanceTaskMutation.mutate()}
    >
      Delete
    </Button>
  );
}
