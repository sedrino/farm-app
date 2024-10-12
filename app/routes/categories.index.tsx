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
import { expenseCategoriesListOptions } from "@/query/options/expense-categories";
import { incomeCategoriesListOptions } from "@/query/options/income-categories";

const categoriesSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["name", "date"]).catch("name"),
});

export const Route = createFileRoute("/categories/")({
  component: CategoriesPageComponent,
  validateSearch: zodSearchValidator(categoriesSearchSchema),
  loader: async ({ request, context }) => {
    const search = categoriesSearchSchema.parse(request.searchParams);
    return Promise.all([
      context.queryClient.ensureQueryData(
        incomeCategoriesListOptions({
          page: search.page,
          pageSize: search.pageSize,
        })
      ),
      context.queryClient.ensureQueryData(
        expenseCategoriesListOptions({
          page: search.page,
          pageSize: search.pageSize,
        })
      ),
    ]);
  },
});

function CategoriesPageComponent() {
  const search = Route.useSearch();
  const { data: incomeCategories } = useSuspenseQuery(
    incomeCategoriesListOptions({
      page: search.page,
      pageSize: search.pageSize,
    })
  );
  const { data: expenseCategories } = useSuspenseQuery(
    expenseCategoriesListOptions({
      page: search.page,
      pageSize: search.pageSize,
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
              to={`/income-categories/${info.row.original.categoryId}/edit`}
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
      incomeColumnHelper.accessor("transactionCount", {
        header: "Transactions Count",
        footer: (info) => info.column.id,
      }),
      incomeColumnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={`/income-categories/${info.row.original.categoryId}/edit`}
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
              to={`/expense-categories/${info.row.original.categoryId}/edit`}
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
      expenseColumnHelper.accessor("transactionCount", {
        header: "Transactions Count",
        footer: (info) => info.column.id,
      }),
      expenseColumnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={`/expense-categories/${info.row.original.categoryId}/edit`}
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
        <h2 className="text-xl font-bold">Income Categories</h2>
        <BasicTable
          columns={incomeColumns}
          data={incomeCategories}
          caption="List of income categories."
        />
      </Panel>
      <Panel className="p-4">
        <h2 className="text-xl font-bold">Expense Categories</h2>
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