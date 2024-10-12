import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { eventsListOptions } from "@/query/options/events";

export const Route = createFileRoute("/events/")({
  component: EventsDashboardComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      eventsListOptions({
        page: 1,
        pageSize: 100,
      })
    );
  },
});

function EventsDashboardComponent() {
  const { data: events } = useSuspenseQuery(
    eventsListOptions({
      page: 1,
      pageSize: 100,
    })
  );

  const upcomingEvents = events.filter((event) => event.startDate > Date.now());
  const recentEvents = events.slice(0, 5); // Assuming the first 5 are recent

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="text-2xl font-bold">Event Management Dashboard</h1>
        <div className="mt-4 flex justify-between">
          <div>
            <h2 className="text-xl">Upcoming Events</h2>
            <ul>
              {upcomingEvents.map((event) => (
                <li key={event.eventId}>
                  <Link to={`/events/${event.eventId}`}>
                    {event.name} - {formatDate(event.startDate)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex space-x-2">
            <Button variant="default" asChild>
              <Link to="/facility-bookings/create">New Booking</Link>
            </Button>
            <Button variant="default" asChild>
              <Link to="/events/create">New Event</Link>
            </Button>
            <Button variant="default" asChild>
              <Link to="/visitors/create">Add Visitor</Link>
            </Button>
          </div>
        </div>
      </Panel>

      <Panel className="p-4">
        <h2 className="text-xl">Recent Activity</h2>
        <ul>
          {recentEvents.map((event) => (
            <li key={event.eventId}>
              <Link to={`/events/${event.eventId}`}>
                {event.name} - {formatDate(event.startDate)}
              </Link>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel className="p-4">
        <h2 className="text-xl">Key Statistics</h2>
        <ul>
          <li>
            Total Events This Month:{" "}
            {
              events.filter(
                (event) =>
                  event.startDate > Date.now() &&
                  new Date(event.startDate).getMonth() === new Date().getMonth()
              ).length
            }
          </li>
          <li>Most Popular Facilities: {/* Logic to determine this */}</li>
          <li>Busiest Days: {/* Logic to determine this */}</li>
        </ul>
      </Panel>

      <Panel className="p-4">
        <h2 className="text-xl">Links to Other Features</h2>
        <ul>
          <li>
            <Button variant="link" asChild>
              <Link to="/calendar">Full Calendar</Link>
            </Button>
          </li>
          <li>
            <Button variant="link" asChild>
              <Link to="/visitors">Visitor Management</Link>
            </Button>
          </li>
        </ul>
      </Panel>

      <Panel className="p-4">
        <h2 className="text-xl">Recent Event Reports</h2>
        <ul>
          {/* Assuming we have a way to list reports */}
          <li>
            <Link to="/reports/event-reports">Event Reports</Link>
          </li>
        </ul>
      </Panel>
    </div>
  );
}
