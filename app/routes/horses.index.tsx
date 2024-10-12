import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { useDeleteHorseMutation } from "@/query/mutations/horses";
import { horsesListOptions } from "@/query/options/horses";

const horsesSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
  breed: z.string().optional(),
  ageRange: z.string().optional(),
  specialNeeds: z.string().optional(),
});

export const Route = createFileRoute("/horses/")({
  component: HorsesPageComponent,
  validateSearch: zodSearchValidator(horsesSearchSchema), // Updated to use zodSearchValidator
  loaderDeps: ({ search }) => search,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      horsesListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
        search: opts.deps.search,
        breed: opts.deps.breed,
        ageRange: opts.deps.ageRange,
        specialNeeds: opts.deps.specialNeeds,
      })
    );
  },
});

function HorsesPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    horsesListOptions({
      page: search.page,
      pageSize: search.pageSize,
      search: search.search,
      breed: search.breed,
      ageRange: search.ageRange,
      specialNeeds: search.specialNeeds,
    })
  );

  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof data)[0]>(),
    []
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Horse Name",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link to={`/horses/${info.row.original.horseId}`}>
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("breed", {
        header: "Breed",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("age", {
        header: "Age",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("stallId", {
        header: "Stall Number",
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
              <Link to={`/horses/${info.row.original.horseId}/edit`}>Edit</Link>
            </Button>
            <DeleteHorseButton horseId={info.row.original.horseId} />
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
          <Input placeholder="Search horses..." />
          <Button variant="default" asChild>
            <Link to="/horses/create">Add New Horse</Link>
          </Button>
        </div>
        <BasicTable columns={columns} data={data} caption="List of horses." />
      </Panel>
    </div>
  );
}

function DeleteHorseButton({ horseId }: { horseId: string }) {
  const deleteHorseMutation = useDeleteHorseMutation(horseId);
  return (
    <Button variant="destructive" onClick={() => deleteHorseMutation.mutate()}>
      Delete
    </Button>
  );
}