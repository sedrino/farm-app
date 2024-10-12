import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { invoicesListOptions } from "@/query/options/invoices";

const billingSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  dateRange: z.string().optional(),
  boarder: z.string().optional(),
  paymentStatus: z.enum(["paid", "unpaid", "overdue"]).optional(),
});

export const Route = createFileRoute("/billing/")({
  component: BillingDashboardComponent,
  validateSearch: zodSearchValidator(billingSearchSchema),
  loaderDeps: ({ search }) => search,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      invoicesListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
        dateRange: opts.deps.dateRange,
        boarder: opts.deps.boarder,
        paymentStatus: opts.deps.paymentStatus,
      })
    );
  },
});

function BillingDashboardComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    invoicesListOptions({
      page: search.page,
      pageSize: search.pageSize,
      dateRange: search.dateRange,
      boarder: search.boarder,
      paymentStatus: search.paymentStatus,
    })
  );

  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof data)[0]>(),
    []
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("invoiceId", {
        header: "Invoice ID",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link to={`/invoices/${info.getValue()}`}>{info.getValue()}</Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("invoiceDate", {
        header: "Invoice Date",
        cell: (info) => formatDate(info.getValue()),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("dueDate", {
        header: "Due Date",
        cell: (info) => formatDate(info.getValue()),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("totalAmount", {
        header: "Total Amount",
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
              <Link to={`/invoices/${info.row.original.invoiceId}/edit`}>
                Edit
              </Link>
            </Button>
            <Button variant="destructive">Send Reminder</Button>
          </div>
        ),
      }),
    ],
    [columnHelper]
  );

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Billing Dashboard</h1>
        <div className="mb-4 flex items-center justify-between">
          <Button variant="default" asChild>
            <Link to="/invoices/create">Generate New Invoice</Link>
          </Button>
          {/* Add filtering options here */}
        </div>
        <BasicTable columns={columns} data={data} caption="Recent Invoices" />
      </Panel>
      {/* Add sections for outstanding payments and overdue invoices */}
    </div>
  );
}
