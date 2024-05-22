import { BasicTable } from "@/components/tables/basic-table";
import { Link, createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Panel } from "@/components/ui/panel";
import { Person, peopleQuery } from "@/examples/query-options";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_auth/dev/examples/basic-table")({
  component: () => <BasicTableComponent />,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(peopleQuery);
  },
});

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor("firstName", {
    header: "First Name",
    cell: (info) => (
      <Button variant="link" asChild>
        <Link to={"/dev/examples/person"}>{info.getValue()}</Link>
      </Button>
    ),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: "lastName",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("age", {
    header: () => "Age",
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("visits", {
    header: () => <span>Visits</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("progress", {
    header: "Profile Progress",
    footer: (info) => info.column.id,
  }),
];

function BasicTableComponent() {
  const { data } = useSuspenseQuery(peopleQuery);

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <BasicTable columns={columns} data={data} caption="List of people." />
      </Panel>
    </div>
  );
}
