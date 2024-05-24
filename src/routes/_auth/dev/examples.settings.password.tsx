import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dev/examples/settings/password")({
  component: () => (
    <div className="bg-surface-100 border-default overflow-hidden  rounded-md border shadow"></div>
  ),
});
