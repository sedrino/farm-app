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
import { useDeleteBoarderMutation } from "@/query/mutations/boarders";
import { boardersListOptions } from "@/query/options/boarders";

const boardersSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["name", "contractStatus"]).catch("name"),
});

export const Route = createFileRoute("/boarders/list")({
  component: BoardersPageComponent,
  validateSearch: zodSearchValidator(boardersSearchSchema),
  loaderDeps: ({ search: { page, pageSize, search, sort } }) => ({
    page,
    pageSize,
    search,
    sort,
  }),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      boardersListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
        search: opts.deps.search,
        sort: opts.deps.sort,
      })
    );
  },
});

function BoardersPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    boardersListOptions({
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
      columnHelper.accessor("name", {
        header: "Boarder Name",
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
      columnHelper.accessor(
        (data) => data.horses?.map((e) => e.name).join(", "),
        {
          header: "Associated Horse(s)",
          footer: (info) => info.column.id,
        }
      ),
      columnHelper.accessor("contractStatus", {
        header: "Contract Status",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor(
        (data) => data.contactDetails?.map((e) => e.email).join(", "),
        {
          header: "Contact Information",
          footer: (info) => info.column.id,
        }
      ),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={"/boarders/$boarderId/edit"}
                params={{
                  boarderId: info.row.original.boarderId,
                }}
              >
                Edit
              </Link>
            </Button>
            <DeleteBoarderButton boarderId={info.row.original.boarderId} />
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
          <Input placeholder="Search boarders..." />
          <Button variant="default" asChild>
            <Link to={"/boarders/create"}>Create New Boarder</Link>
          </Button>
        </div>
        <BasicTable columns={columns} data={data} caption="List of boarders." />
      </Panel>
    </div>
  );
}

function DeleteBoarderButton({ boarderId }: { boarderId: string }) {
  const deleteBoarderMutation = useDeleteBoarderMutation(boarderId);
  return (
    <Button
      variant="destructive"
      onClick={() => deleteBoarderMutation.mutate()}
    >
      Delete
    </Button>
  );
}