import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format, parse, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useCreateMaintenanceTaskMutation } from "@/query/mutations/maintenance-tasks";
import { maintenanceTasksListOptions } from "@/query/options/maintenance-tasks";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay: (date) => date.getDay(),
  locales,
});

export const Route = createFileRoute("/maintenance/calendar/")({
  component: MaintenanceCalendarComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      maintenanceTasksListOptions({
        page: 1,
        pageSize: 100,
      })
    );
  },
});

function MaintenanceCalendarComponent() {
  const { data } = useSuspenseQuery(
    maintenanceTasksListOptions({
      page: 1,
      pageSize: 100,
    })
  );
  const createMaintenanceTaskMutation = useCreateMaintenanceTaskMutation();

  const events = data.map((task) => ({
    id: task.maintenanceTaskId,
    title: task.taskName,
    start: new Date(task.scheduledDate),
    end: new Date(task.scheduledDate),
    allDay: true,
    resource: task,
  }));

  const handleSelectSlot = ({ start }) => {
    const title = window.prompt("New Task Name");
    if (title) {
      createMaintenanceTaskMutation.mutate({
        taskName: title,
        scheduledDate: Math.floor(start.getTime() / 1000),
        stallId: "", // You might want to ask for this too
        priority: "medium", // Default priority
        status: "scheduled", // Default status
      });
    }
  };

  const handleEventDrop = ({ event, start }) => {
    // Update the task's scheduled date
    // You might need to create a mutation to update the task
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Maintenance Calendar</h1>
        <div className="flex">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ flexGrow: 1, height: 500 }}
            selectable
            onSelectSlot={handleSelectSlot}
            onEventDrop={handleEventDrop}
            views={["month", "week", "day"]}
            defaultView="month"
            eventPropGetter={(event) => ({
              style: {
                backgroundColor:
                  event.resource.priority === "high"
                    ? "red"
                    : event.resource.priority === "medium"
                      ? "orange"
                      : "green",
              },
            })}
            components={{
              event: ({ event }) => (
                <span>
                  <strong>{event.title}</strong>
                  <br />
                  <small>{event.resource.status}</small>
                </span>
              ),
            }}
          />
          <div className="ml-4">
            <h2 className="text-xl font-bold">Filters</h2>
            {/* Add filters for task types and stalls */}
          </div>
        </div>
        <Button
          variant="default"
          onClick={() => createMaintenanceTaskMutation.mutate()}
        >
          Create New Task
        </Button>
      </Panel>
    </div>
  );
}
