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
import { useDeleteInventoryItemMutation } from "@/query/mutations/inventory-items";
import { inventoryItemsListOptions } from "@/query/options/inventory-items";

const inventoryItemsSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["name", "category", "quantity", "date"]).catch("name"),
});

export const Route = createFileRoute("/farm-operations/inventory/items/")({
  component: InventoryItemsPageComponent,
  validateSearch: zodSearchValidator(inventoryItemsSearchSchema),
  loaderDeps: ({ search }) => search,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      inventoryItemsListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
        search: opts.deps.search,
        sort: opts.deps.sort,
      })
    );
  },
});

function InventoryItemsPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    inventoryItemsListOptions({
      page: search.page,
      pageSize: search.pageSize,
      search: search.search,
      sort: search.sort,
    })
  );

  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof data)[0]>(),
    []
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Item Name",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link
              to={`/inventory/items/${info.row.original.inventoryItemId}/edit`}
            >
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("category", {
        header: "Category",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("quantity", {
        header: "Current Quantity",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("unitOfMeasurement", {
        header: "Unit of Measure",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("reorderPoint", {
        header: "Reorder Point",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("supplier", {
        header: "Supplier",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("lastUpdated", {
        header: "Last Updated",
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={`/inventory/items/${info.row.original.inventoryItemId}/edit`}
              >
                Edit
              </Link>
            </Button>
            <DeleteInventoryItemButton
              inventoryItemId={info.row.original.inventoryItemId}
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
          <Input placeholder="Search items..." />
          <Button variant="default" asChild>
            <Link to="/inventory/items/create">Add New Item</Link>
          </Button>
        </div>
        <BasicTable
          columns={columns}
          data={data}
          caption="List of inventory items."
        />
      </Panel>
    </div>
  );
}

function DeleteInventoryItemButton({
  inventoryItemId,
}: {
  inventoryItemId: string;
}) {
  const deleteInventoryItemMutation =
    useDeleteInventoryItemMutation(inventoryItemId);
  return (
    <Button
      variant="destructive"
      onClick={() => deleteInventoryItemMutation.mutate()}
    >
      Delete
    </Button>
  );
}