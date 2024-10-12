import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useCancelBookingMutation } from "@/query/mutations/facility-bookings";
import { facilitiesListOptions } from "@/query/options/facilities";
import { facilityBookingsListOptions } from "@/query/options/facility-bookings";

const facilitiesSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["name", "date"]).catch("name"),
});

export const Route = createFileRoute("/facilities/booking/")({
  component: FacilitiesBookingPageComponent,
  validateSearch: zodSearchValidator(facilitiesSearchSchema),
  loaderDeps: ({ search }) => search,
  loader: (opts) => {
    return Promise.all([
      opts.context.queryClient.ensureQueryData(
        facilitiesListOptions({
          page: opts.deps.page,
          pageSize: opts.deps.pageSize,
        })
      ),
      opts.context.queryClient.ensureQueryData(
        facilityBookingsListOptions({
          page: opts.deps.page,
          pageSize: opts.deps.pageSize,
        })
      ),
    ]);
  },
});

function FacilitiesBookingPageComponent() {
  const search = Route.useSearch();
  const { data: facilities } = useSuspenseQuery(
    facilitiesListOptions({
      page: search.page,
      pageSize: search.pageSize,
    })
  );
  const { data: bookings } = useSuspenseQuery(
    facilityBookingsListOptions({
      page: search.page,
      pageSize: search.pageSize,
    })
  );

  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof facilities)[0]>(),
    []
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Facility Name",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link to={`/facilities/${info.row.original.facilityId}`}>
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("type", {
        header: "Type",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("capacity", {
        header: "Capacity",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("currentAvailability", {
        header: "Current Availability",
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={`/facilities/${info.row.original.facilityId}/book`}
                params={{
                  facilityId: info.row.original.facilityId,
                }}
              >
                Book
              </Link>
            </Button>
            <CancelBookingButton
              bookingId={info.row.original.facilityBookingId}
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
            <Link to="/facilities/create">Create New Facility</Link>
          </Button>
        </div>
        <BasicTable
          columns={columns}
          data={facilities}
          caption="List of facilities."
        />
      </Panel>
      <Panel className="p-4">
        <h2 className="text-xl font-bold">Your Bookings</h2>
        <BasicTable
          columns={columns}
          data={bookings}
          caption="List of your bookings."
        />
      </Panel>
    </div>
  );
}

function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const cancelBookingMutation = useCancelBookingMutation(bookingId);
  return (
    <Button
      variant="destructive"
      onClick={() => cancelBookingMutation.mutate()}
    >
      Cancel
    </Button>
  );
}