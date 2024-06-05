import {
  BasicTableWithPagination,
} from "@/components/tables/basic-table";
import React from "react";
import { Panel } from "@/components/ui/panel";
import { trainingSetOptions } from "@/query/query-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { z } from "zod";

export const Route = createFileRoute("/_auth/dev/examples/data-table")({
  component: PageTrainingSets,
  loader: async (opts) => {
    const {
      context: { queryClient },
    } = opts;
    return queryClient.ensureQueryData(trainingSetOptions.all);
  },
  validateSearch: (search) => {
    return z
      .object({
        page: z.coerce.number().min(1).catch(1),
        pageSize: z.coerce.number().min(1).catch(20),
      })
      .parse(search);
  },
});

function PageTrainingSets() {
  const { data } = useSuspenseQuery(trainingSetOptions.all);
  const { page, pageSize } = Route.useSearch();

  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof data.data)[0]>(),
    []
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      }),
    ],
    [columnHelper]
  );

  return (
    <>
      <div className="flex flex-1 justify-center items-center">
        Page for /training-sets This page provides a list view of all training
        sets. Users can search and filter the training sets based on various
        criteria. The page includes options to view details of each training
        set, as well as buttons to create a new training set, edit existing
        ones, or delete them.
      </div>
      <div className="flex flex-col gap-4 p-8">
        <Panel className="p-4">
          <BasicTableWithPagination
            columns={columns}
            data={data.data}
            page={page}
            pageSize={pageSize}
            caption="Training Sets"
          />
        </Panel>
      </div>
    </>
  );
}