import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useMarkInvoicePaidMutation } from "@/query/mutations/invoices";
import { invoicesListOptions } from "@/query/options/invoices";

const invoicesSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  status: z.enum(["paid", "unpaid", "overdue"]).catch("unpaid"),
});

export const Route = createFileRoute("/boarders/$boarderId/invoices/")({
  component: InvoicesPageComponent,
  validateSearch: zodSearchValidator(invoicesSearchSchema),
  loaderDeps: ({ search: { page, pageSize, status } }) => ({
    page,
    pageSize,
    status,
  }),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      invoicesListOptions({
        boarderId: opts.params.boarderId,
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
        status: opts.deps.status,
      })
    );
  },
});

function InvoicesPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    invoicesListOptions({
      boarderId: Route.useParams().boarderId,
      page: search.page,
      pageSize: search.pageSize,
      status: search.status,
    })
  );

  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof data)[0]>(),
    []
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("invoiceDate", {
        header: "Invoice Date",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("dueDate", {
        header: "Due Date",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("totalAmount", {
        header: "Total Amount",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link to={`/invoices/${info.row.original.invoiceId}/download`}>
                Download
              </Link>
            </Button>
            <MarkInvoicePaidButton invoiceId={info.row.original.invoiceId} />
          </div>
        ),
      }),
    ],
    [columnHelper]
  );

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <BasicTable columns={columns} data={data} caption="List of invoices." />
      </Panel>
    </div>
  );
}

function MarkInvoicePaidButton({ invoiceId }: { invoiceId: string }) {
  const markInvoicePaidMutation = useMarkInvoicePaidMutation(invoiceId);
  return (
    <Button variant="outline" onClick={() => markInvoicePaidMutation.mutate()}>
      Mark as Paid
    </Button>
  );
}