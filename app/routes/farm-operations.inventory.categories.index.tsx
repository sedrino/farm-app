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
import { useDeleteCategoryMutation } from "@/query/mutations/inventory-categories";
import { inventoryCategoriesListOptions } from "@/query/options/inventory-categories";

const inventoryCategoriesSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
});

export const Route = createFileRoute("/farm-operations/inventory/categories/")({
  component: InventoryCategoriesPageComponent,
  validateSearch: zodSearchValidator(inventoryCategoriesSearchSchema),
  loaderDeps: ({ search: { page, pageSize, search } }) => ({
    page,
    pageSize,
    search,
  }),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      inventoryCategoriesListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
        search: opts.deps.search,
      })
    );
  },
});

function InventoryCategoriesPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    inventoryCategoriesListOptions({
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
        header: "Category Name",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link
              to={"/farm-operations/inventory/categories/$categoryId/edit"}
              params={{ categoryId: info.row.original.categoryId }}
            >
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("description", {
        header: "Description",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("transactionCount", {
        header: "Item Count",
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={"/farm-operations/inventory/categories/$categoryId/edit"}
                params={{
                  categoryId: info.row.original.categoryId,
                }}
              >
                Edit
              </Link>
            </Button>
            <DeleteCategoryButton categoryId={info.row.original.categoryId} />
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
          <Input placeholder="Search categories..." />
          <Button variant="default" asChild>
            <Link to={"/farm-operations/inventory/categories/create"}>
              Create New Category
            </Link>
          </Button>
        </div>
        <BasicTable
          columns={columns}
          data={data}
          caption="List of inventory categories."
        />
      </Panel>
    </div>
  );
}

function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
  const deleteCategoryMutation = useDeleteCategoryMutation(categoryId);
  return (
    <Button
      variant="destructive"
      onClick={() => deleteCategoryMutation.mutate()}
    >
      Delete
    </Button>
  );
}