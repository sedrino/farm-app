import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dev/examples/data-table")({
  component:DataTableComponent,
});

function DataTableComponent() {
  return <div>Data Table</div>;
}
