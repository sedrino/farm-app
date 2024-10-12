import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useDeleteCategoryMutation } from "@/query/mutations/categories";
import { categoriesListOptions } from "@/query/options/categories";

const categoriesSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["name", "date"]).catch("name"),
});

export const Route = createFileRoute("/financial-management/categories/")({
  component: CategoriesPageComponent,
  validateSearch: zodSearchValidator(categoriesSearchSchema),
  loaderDeps: ({ search }) => search,
  loader: (opts) => {
    return Promise.all([
      opts.context.queryClient.ensureQueryData(
        categoriesListOptions({
          page: opts.deps.page,
          pageSize: opts.deps.pageSize,
          type: "income",
        })
      ),
      opts.context.queryClient.ensureQueryData(
        categoriesListOptions({
          page: opts.deps.page,
          pageSize: opts.deps.pageSize,
          type: "expense",
        })
      ),
    ]);
  },
});

function CategoriesPageComponent() {
  const search = Route.useSearch();
  const { data: incomeCategories } = useSuspenseQuery(
    categoriesListOptions({
      page: search.page,
      pageSize: search.pageSize,
      type: "income",
    })
  );
  const { data: expenseCategories } = useSuspenseQuery(
    categoriesListOptions({
      page: search.page,
      pageSize: search.pageSize,
      type: "expense",
    })
  );

  const incomeColumnHelper = React.useMemo(
    () => createColumnHelper<(typeof incomeCategories)[0]>(),
    []
  );

  const expenseColumnHelper = React.useMemo(
    () => createColumnHelper<(typeof expenseCategories)[0]>(),
    []
  );

  const incomeColumns = React.useMemo(
    () => [
      incomeColumnHelper.accessor("name", {
        header: "Income Category Name",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link
              to={"/financial-management/categories/income/$categoryId/edit"}
              params={{ categoryId: info.row.original.categoryId }}
            >
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      incomeColumnHelper.accessor("description", {
        header: "Description",
        footer: (info) => info.column.id,
      }),
      incomeColumnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={"/financial-management/categories/income/$categoryId/edit"}
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
    [incomeColumnHelper]
  );

  const expenseColumns = React.useMemo(
    () => [
      expenseColumnHelper.accessor("name", {
        header: "Expense Category Name",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link
              to={"/financial-management/categories/expense/$categoryId/edit"}
              params={{ categoryId: info.row.original.categoryId }}
            >
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      expenseColumnHelper.accessor("description", {
        header: "Description",
        footer: (info) => info.column.id,
      }),
      expenseColumnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={"/financial-management/categories/expense/$categoryId/edit"}
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
    [expenseColumnHelper]
  );

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Income Categories</h1>
        <div className="mb-4 flex items-center justify-between">
          <Button variant="default" asChild>
            <Link to={"/financial-management/categories/income/create"}>
              Add New Income Category
            </Link>
          </Button>
        </div>
        <BasicTable
          columns={incomeColumns}
          data={incomeCategories}
          caption="List of income categories."
        />
      </Panel>
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Expense Categories</h1>
        <div className="mb-4 flex items-center justify-between">
          <Button variant="default" asChild>
            <Link to={"/financial-management/categories/expense/create"}>
              Add New Expense Category
            </Link>
          </Button>
        </div>
        <BasicTable
          columns={expenseColumns}
          data={expenseCategories}
          caption="List of expense categories."
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