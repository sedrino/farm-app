import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { inventoryItemsListOptions } from "@/query/options/inventory-items";
import { maintenanceRequestsListOptions } from "@/query/options/maintenance-requests";
import { notificationsListOptions } from "@/query/options/notifications";
import { pastureRotationsListOptions } from "@/query/options/pasture-rotations";
import { staffSchedulesListOptions } from "@/query/options/staff-schedules";

export const Route = createFileRoute("/farm-operations/")({
  component: FarmOperationsDashboardComponent,
  loader: (opts) => {
    return Promise.all([
      opts.context.queryClient.ensureQueryData(
        inventoryItemsListOptions({
          page: 1,
          pageSize: 100,
        })
      ),
      opts.context.queryClient.ensureQueryData(
        staffSchedulesListOptions({
          page: 1,
          pageSize: 100,
        })
      ),
      opts.context.queryClient.ensureQueryData(
        maintenanceRequestsListOptions({
          page: 1,
          pageSize: 100,
        })
      ),
      opts.context.queryClient.ensureQueryData(
        pastureRotationsListOptions({
          page: 1,
          pageSize: 100,
        })
      ),
      opts.context.queryClient.ensureQueryData(
        notificationsListOptions({
          page: 1,
          pageSize: 100,
        })
      ),
    ]);
  },
});

function FarmOperationsDashboardComponent() {
  const { data: inventoryItems } = useSuspenseQuery(
    inventoryItemsListOptions({
      page: 1,
      pageSize: 100,
    })
  );
  const { data: staffSchedules } = useSuspenseQuery(
    staffSchedulesListOptions({
      page: 1,
      pageSize: 100,
    })
  );
  const { data: maintenanceRequests } = useSuspenseQuery(
    maintenanceRequestsListOptions({
      page: 1,
      pageSize: 100,
    })
  );
  const { data: pastureRotations } = useSuspenseQuery(
    pastureRotationsListOptions({
      page: 1,
      pageSize: 100,
    })
  );
  const { data: notifications } = useSuspenseQuery(
    notificationsListOptions({
      page: 1,
      pageSize: 100,
    })
  );

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Farm Operations Dashboard</h1>
        <Input placeholder="Search..." className="mb-4" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Panel className="p-4">
            <h2 className="text-xl font-bold">Inventory Levels</h2>
            <ul>
              {inventoryItems.items.map((item) => (
                <li key={item.inventoryItemId}>
                  {item.name}: {item.quantity} (Low Stock Alert)
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="p-4">
            <h2 className="text-xl font-bold">Staff Schedule</h2>
            <ul>
              {staffSchedules.items.map((schedule) => (
                <li key={schedule.staffScheduleId}>
                  {schedule.userId} - {schedule.shiftStart} to{" "}
                  {schedule.shiftEnd}
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="p-4">
            <h2 className="text-xl font-bold">Maintenance Requests</h2>
            <ul>
              {maintenanceRequests.items.map((request) => (
                <li key={request.maintenanceRequestId}>
                  {request.title} - {request.status}
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="p-4">
            <h2 className="text-xl font-bold">Pasture Rotation Status</h2>
            <ul>
              {pastureRotations.items.map((rotation) => (
                <li key={rotation.pastureRotationId}>
                  {rotation.pastureId} - {rotation.status}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </Panel>
      <Panel className="p-4">
        <h2 className="text-xl font-bold">Notifications</h2>
        <ul>
          {notifications.items.map((notification) => (
            <li key={notification.notificationId}>
              {notification.message} - {notification.type}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
