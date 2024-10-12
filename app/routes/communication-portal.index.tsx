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

export const Route = createFileRoute("/communication-portal/")({
  component: CommunicationPortalPageComponent,
  validateSearch: zodSearchValidator(messagesSearchSchema),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      messagesListOptions({
        page: opts.params.page,
        pageSize: opts.params.pageSize,
        search: opts.params.search,
        sort: opts.params.sort,
      })
    );
  },
});

function CommunicationPortalPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    messagesListOptions({
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
      columnHelper.accessor("subject", {
        header: "Subject",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link to={`/messages/${info.row.original.messageId}`}>
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
              <Link to={`/messages/${info.row.original.messageId}/edit`}>
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
            <Link to="/messages/compose">Compose New Message</Link>
          </Button>
        </div>
        <BasicTable columns={columns} data={data} caption="Messages" />
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