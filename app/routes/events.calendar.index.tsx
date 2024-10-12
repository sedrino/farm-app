import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";

import { Panel } from "@/components/ui/panel";
import { eventsListOptions } from "@/query/options/events";

const locales = ["en-US"];
const localizer = dateFnsLocalizer({
  format,
  parse: (dateString) => parseISO(dateString),
  locales,
});

export const Route = createFileRoute("/events/calendar/")({
  component: EventsCalendarComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(eventsListOptions({}));
  },
});

function EventsCalendarComponent() {
  const { data } = useSuspenseQuery(eventsListOptions({}));

  const events = data.map((event) => ({
    id: event.eventId,
    title: event.name,
    start: new Date(event.startDate),
    end: new Date(event.endDate),
    allDay: true,
    resource: event,
  }));

  const handleSelectEvent = (event) => {
    // Navigate to event details or edit page
  };

  const handleSelectSlot = (slotInfo) => {
    // Navigate to add event or booking page
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Events Calendar</h1>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          selectable
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          views={["month", "week", "day"]}
          defaultView="month"
          eventPropGetter={(event) => ({
            style: {
              backgroundColor:
                event.resource.eventType === "booking"
                  ? "#f0ad4e"
                  : event.resource.eventType === "clinic"
                    ? "#5bc0de"
                    : "#d9534f",
            },
          })}
        />
      </Panel>
    </div>
  );
}
