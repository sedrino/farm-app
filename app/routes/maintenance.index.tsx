import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { useCreateMaintenanceTaskMutation } from "@/query/mutations/maintenance-tasks";
import {
  maintenanceTasksListOptions,
  scheduledMaintenanceTasksListOptions,
} from "@/query/options/maintenance-tasks";

const maintenanceSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  filter: z.enum(["overdue", "today", "future"]).catch("future"),
});

export const Route = createFileRoute("/maintenance/")({
  component: MaintenanceDashboardComponent,
  validateSearch: zodSearchValidator(maintenanceSearchSchema),
  loaderDeps: ({ search: { page, pageSize, filter } }) => ({
    page,
    pageSize,
    filter,
  }),
  loader: (opts) => {
    return Promise.all([
      opts.context.queryClient.ensureQueryData(
        maintenanceTasksListOptions({
          page: opts.deps.page,
          pageSize: opts.deps.pageSize,
        })
      ),
      opts.context.queryClient.ensureQueryData(
        scheduledMaintenanceTasksListOptions({
          page: opts.deps.page,
          pageSize: opts.deps.pageSize,
          filter: opts.deps.filter,
        })
      ),
    ]);
  },
});

function MaintenanceDashboardComponent() {
  const search = Route.useSearch();
  const { data: maintenanceTasks } = useSuspenseQuery(
    maintenanceTasksListOptions({
      page: search.page,
      pageSize: search.pageSize,
    })
  );
  const { data: scheduledTasks } = useSuspenseQuery(
    scheduledMaintenanceTasksListOptions({
      page: search.page,
      pageSize: search.pageSize,
      filter: search.filter,
    })
  );
  const createMaintenanceTaskMutation = useCreateMaintenanceTaskMutation();

  const handleCreateTask = () => {
    createMaintenanceTaskMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Maintenance Scheduling</h1>
        <div className="mb-4 flex items-center justify-between">
          <Button variant="default" onClick={handleCreateTask}>
            Create New Task
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline">View Full Maintenance History</Button>
            <Button variant="outline">Generate Reports</Button>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Upcoming Maintenance Tasks</h2>
          <ul>
            {scheduledTasks.map((task) => (
              <li key={task.maintenanceTaskId}>
                {formatDate(task.scheduledDate)} - {task.taskName}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Calendar View</h2>
          {/* Placeholder for calendar view */}
          <div className="h-48 rounded border border-gray-300">
            <p className="p-4">[Calendar View]</p>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Recently Completed Tasks</h2>
          <ul>
            {maintenanceTasks.map((task) => (
              <li key={task.maintenanceTaskId}>
                {formatDate(task.completionDate)} - {task.taskName}
              </li>
            ))}
          </ul>
        </div>
      </Panel>
    </div>
  );
}
