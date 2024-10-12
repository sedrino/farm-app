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
import { useSendInvoiceMutation } from "@/query/mutations/invoices";
import { boarderBillingOptions } from "@/query/options/boarders";

const billingSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["date", "amount"]).catch("date"),
});

export const Route = createFileRoute("/boarders/$boarderId/billing/")({
  component: BoarderBillingPageComponent,
  validateSearch: zodSearchValidator(billingSearchSchema),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      boarderBillingOptions({
        boarderId: opts.params.boarderId,
        page: opts.search.page,
        pageSize: opts.search.pageSize,
      })
    );
  },
});

function BoarderBillingPageComponent() {
  const { boarderId } = Route.useParams();
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    boarderBillingOptions({
      boarderId,
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
      columnHelper.accessor("invoiceDate", {
        header: "Invoice Date",
        cell: (info) => formatDate(info.getValue()),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("totalAmount", {
        header: "Total Amount",
        cell: (info) => `$${info.getValue().toFixed(2)}`,
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
              <Link
                to={"/invoices/$invoiceId/edit"}
                params={{
                  invoiceId: info.row.original.invoiceId,
                }}
              >
                Edit
              </Link>
            </Button>
            <SendInvoiceButton invoiceId={info.row.original.invoiceId} />
          </div>
        ),
      }),
    ],
    [columnHelper]
  );

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Billing for Boarder</h1>
        <BasicTable columns={columns} data={data} caption="List of invoices." />
      </Panel>
    </div>
  );
}

function SendInvoiceButton({ invoiceId }: { invoiceId: string }) {
  const sendInvoiceMutation = useSendInvoiceMutation(invoiceId);
  return (
    <Button variant="outline" onClick={() => sendInvoiceMutation.mutate()}>
      Send Invoice
    </Button>
  );
}