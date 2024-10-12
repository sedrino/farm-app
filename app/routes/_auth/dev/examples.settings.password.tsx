import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dev/examples/settings/password")({
  component: () => (
    <div className="border-default overflow-hidden rounded-md border bg-surface-100 shadow"></div>
  ),
});
