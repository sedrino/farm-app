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
import { useDeleteMessageMutation } from "@/query/mutations/messages";
import { messagesListOptions } from "@/query/options/messages";

const messagesSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["date", "sender"]).catch("date"),
});

export const Route = createFileRoute("/communication/")({
  component: CommunicationPageComponent,
  validateSearch: zodSearchValidator(messagesSearchSchema),
  loaderDeps: ({ search: { page, pageSize, search, sort } }) => ({
    page,
    pageSize,
    search,
    sort,
  }),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      messagesListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
      })
    );
  },
});

function CommunicationPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    messagesListOptions({
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
      columnHelper.accessor("subject", {
        header: "Subject",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link
              to={"/messages/$messageId"}
              params={{ messageId: info.row.original.messageId }}
            >
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("sender", {
        header: "Sender",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("date", {
        header: "Date",
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={"/messages/$messageId/edit"}
                params={{
                  messageId: info.row.original.messageId,
                }}
              >
                Edit
              </Link>
            </Button>
            <DeleteMessageButton messageId={info.row.original.messageId} />
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
          <Input placeholder="Search messages..." />
          <Button variant="default" asChild>
            <Link to={"/messages/compose"}>Compose New Message</Link>
          </Button>
        </div>
        <BasicTable columns={columns} data={data} caption="Message Center" />
      </Panel>
    </div>
  );
}

function DeleteMessageButton({ messageId }: { messageId: string }) {
  const deleteMessageMutation = useDeleteMessageMutation(messageId);
  return (
    <Button
      variant="destructive"
      onClick={() => deleteMessageMutation.mutate()}
    >
      Delete
    </Button>
  );
}