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
import { useAdjustPaymentMutation } from "@/query/mutations/payments";
import { paymentsListOptions } from "@/query/options/payments";

const paymentsSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  dateRange: z.string().optional(),
  boarderId: z.string().optional(),
  paymentMethod: z.string().optional(),
});

export const Route = createFileRoute("/billing/payments/")({
  component: PaymentsPageComponent,
  validateSearch: zodSearchValidator(paymentsSearchSchema),
  loaderDeps: ({ search }) => search,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      paymentsListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
        dateRange: opts.deps.dateRange,
        boarderId: opts.deps.boarderId,
        paymentMethod: opts.deps.paymentMethod,
      })
    );
  },
});

function PaymentsPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    paymentsListOptions({
      page: search.page,
      pageSize: search.pageSize,
      dateRange: search.dateRange,
      boarderId: search.boarderId,
      paymentMethod: search.paymentMethod,
    })
  );

  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof data)[0]>(),
    []
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("paymentDate", {
        header: "Date",
        cell: (info) => formatDate(info.getValue()),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("boarder.name", {
        header: "Boarder",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link
              to={"/boarders/$boarderId"}
              params={{ boarderId: info.row.original.boarderId }}
            >
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("paymentMethod", {
        header: "Method",
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={"/payments/$paymentId/edit"}
                params={{
                  paymentId: info.row.original.paymentId,
                }}
              >
                Edit
              </Link>
            </Button>
            <AdjustPaymentButton paymentId={info.row.original.paymentId} />
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
          <Button variant="default" asChild>
            <Link to={"/payments/create"}>Record New Payment</Link>
          </Button>
        </div>
        <BasicTable columns={columns} data={data} caption="List of payments." />
        <div className="mt-4">
          <h2 className="text-xl font-bold">Summary Statistics</h2>
          <p>Total Received: {data.totalReceived}</p>
          <p>Average Payment: {data.averagePayment}</p>
        </div>
      </Panel>
    </div>
  );
}

function AdjustPaymentButton({ paymentId }: { paymentId: string }) {
  const adjustPaymentMutation = useAdjustPaymentMutation(paymentId);
  return (
    <Button variant="outline" onClick={() => adjustPaymentMutation.mutate()}>
      Adjust
    </Button>
  );
}