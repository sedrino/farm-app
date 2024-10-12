import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useDeleteContractTemplateMutation } from "@/query/mutations/contract-templates";
import { contractTemplatesListOptions } from "@/query/options/contract-templates";

const contractTemplatesSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
});

export const Route = createFileRoute("/contracts/templates/")({
  component: ContractTemplatesPageComponent,
  validateSearch: zodSearchValidator(contractTemplatesSearchSchema),
  loaderDeps: ({ search: { page, pageSize, search } }) => ({
    page,
    pageSize,
    search,
  }),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      contractTemplatesListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
        search: opts.deps.search,
      })
    );
  },
});

function ContractTemplatesPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    contractTemplatesListOptions({
      page: search.page,
      pageSize: search.pageSize,
      search: search.search,
    })
  );

  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof data)[0]>(),
    []
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Template Name",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link
              to={"/contracts/templates/$templateId/edit"}
              params={{ templateId: info.row.original.templateId }}
            >
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("reportType", {
        header: "Report Type",
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={"/contracts/templates/$templateId/edit"}
                params={{
                  templateId: info.row.original.templateId,
                }}
              >
                Edit
              </Link>
            </Button>
            <DeleteContractTemplateButton
              templateId={info.row.original.templateId}
            />
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
            <Link to={"/contracts/templates/create"}>Create New Template</Link>
          </Button>
        </div>
        <BasicTable
          columns={columns}
          data={data}
          caption="List of contract templates."
        />
      </Panel>
    </div>
  );
}

function DeleteContractTemplateButton({ templateId }: { templateId: string }) {
  const deleteContractTemplateMutation =
    useDeleteContractTemplateMutation(templateId);
  return (
    <Button
      variant="destructive"
      onClick={() => deleteContractTemplateMutation.mutate()}
    >
      Delete
    </Button>
  );
}
