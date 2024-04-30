import { Outlet, createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_auth")({
  component: () => (
    <div className="min-h-full flex flex-col">
      <Outlet />
    </div>
  ),
});
