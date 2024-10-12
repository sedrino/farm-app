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
import { useDeleteSupplierMutation } from "@/query/mutations/suppliers";
import { suppliersListOptions } from "@/query/options/suppliers";

const suppliersSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
});

export const Route = createFileRoute("/farm-operations/inventory/suppliers/")({
  component: SuppliersPageComponent,
  validateSearch: zodSearchValidator(suppliersSearchSchema),
  loaderDeps: ({ search: { page, pageSize, search } }) => ({
    page,
    pageSize,
    search,
  }),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      suppliersListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
        search: opts.deps.search,
      })
    );
  },
});

function SuppliersPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    suppliersListOptions({
      page: search.page,
      pageSize: search.pageSize,
      search: search.search,
    })
  );

  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof data)[0]>(),
    []
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Supplier Name",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link
              to={`/suppliers/${info.row.original.supplierId}/edit`}
              params={{ supplierId: info.row.original.supplierId }}
            >
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("contactInformation", {
        header: "Contact Information",
        cell: (info) => JSON.stringify(info.getValue()),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("lastOrderDate", {
        header: "Last Order Date",
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={`/suppliers/${info.row.original.supplierId}/edit`}
                params={{
                  supplierId: info.row.original.supplierId,
                }}
              >
                Edit
              </Link>
            </Button>
            <DeleteSupplierButton supplierId={info.row.original.supplierId} />
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
          <Input placeholder="Search suppliers..." />
          <Button variant="default" asChild>
            <Link to="/suppliers/create">Add New Supplier</Link>
          </Button>
        </div>
        <BasicTable
          columns={columns}
          data={data}
          caption="List of suppliers."
        />
      </Panel>
    </div>
  );
}

function DeleteSupplierButton({ supplierId }: { supplierId: string }) {
  const deleteSupplierMutation = useDeleteSupplierMutation(supplierId);
  return (
    <Button
      variant="destructive"
      onClick={() => deleteSupplierMutation.mutate()}
    >
      Delete
    </Button>
  );
}