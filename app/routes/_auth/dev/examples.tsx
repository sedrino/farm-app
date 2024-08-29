import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_auth/dev/examples")({
  component: () => <div>Hello /_auth/dev/examples!</div>,
});
