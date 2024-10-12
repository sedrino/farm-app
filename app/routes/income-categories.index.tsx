import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useDeleteIncomeCategoryMutation } from "@/query/mutations/income-categories";
import { incomeCategoriesListOptions } from "@/query/options/income-categories";
import { Input } from "@/components/ui/input";


const incomeCategoriesSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["name", "date"]).catch("name"),
});

export const Route = createFileRoute("/income-categories/")({
  component: IncomeCategoriesPageComponent,
  validateSearch: zodSearchValidator(incomeCategoriesSearchSchema),
  loaderDeps: ({ search: { page, pageSize, search, sort } }) => ({
    page,
    pageSize,
    search,
    sort,
  }),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      incomeCategoriesListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
      })
    );
  },
});

function IncomeCategoriesPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    incomeCategoriesListOptions({
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
        header: "Category Name",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link
              to={`/income-categories/${info.row.original.categoryId}/edit`}
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
        header: "Transactions",
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={`/income-categories/${info.row.original.categoryId}/edit`}
                params={{
                  categoryId: info.row.original.categoryId,
                }}
              >
                Edit
              </Link>
            </Button>
            <DeleteIncomeCategoryButton
              categoryId={info.row.original.categoryId}
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
          <Input placeholder="Search categories..." />
          <Button variant="default" asChild>
            <Link to="/income-categories/create">Add New Category</Link>
          </Button>
        </div>
        <BasicTable
          columns={columns}
          data={data}
          caption="List of income categories."
        />
      </Panel>
    </div>
  );
}

function DeleteIncomeCategoryButton({ categoryId }: { categoryId: string }) {
  const deleteIncomeCategoryMutation =
    useDeleteIncomeCategoryMutation(categoryId);
  return (
    <Button
      variant="destructive"
      onClick={() => deleteIncomeCategoryMutation.mutate()}
    >
      Delete
    </Button>
  );
}