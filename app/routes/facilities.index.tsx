import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useDeleteFacilityMutation } from "@/query/mutations/facilities";
import { facilitiesListOptions } from "@/query/options/facilities";
import { Input } from "@/components/ui/input"; // Import missing Input component


const facilitiesSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["name", "type", "capacity"]).catch("name"),
});

export const Route = createFileRoute("/facilities/")({
  component: FacilitiesPageComponent,
  validateSearch: zodSearchValidator(facilitiesSearchSchema),
  loaderDeps: ({ search: { page, pageSize, search, sort } }) => ({
    page,
    pageSize,
    search,
    sort,
  }),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      facilitiesListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
      })
    );
  },
});

function FacilitiesPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    facilitiesListOptions({
      page: search.page,
      pageSize: search.pageSize,
    })
  );

  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof data)[0]>(),
    []
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Facility Name",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link
              to={`/facilities/${info.row.original.facilityId}`} //Simplified Link
              params={{ facilityId: info.row.original.facilityId }}
            >
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
        id: "bookNow",
        header: "Book Now",
        cell: (info) => <Button variant="primary">Book Now</Button>,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={`/facilities/${info.row.original.facilityId}/edit`} //Simplified Link
                params={{
                  facilityId: info.row.original.facilityId,
                }}
              >
                Edit
              </Link>
            </Button>
            <DeleteFacilityButton facilityId={info.row.original.facilityId} />
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
          <Input placeholder="Search facilities..." /> {/* Added Input component */}
          <Button variant="default" asChild>
            <Link to="/facilities/create">Add New Facility</Link>
          </Button>
        </div>
        <BasicTable
          columns={columns}
          data={data}
          caption="List of facilities."
        />
      </Panel>
    </div>
  );
}

function DeleteFacilityButton({ facilityId }: { facilityId: string }) {
  const deleteFacilityMutation = useDeleteFacilityMutation(facilityId);
  return (
    <Button
      variant="destructive"
      onClick={() => deleteFacilityMutation.mutate()}
    >
      Delete
    </Button>
  );
}