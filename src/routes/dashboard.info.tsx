import { SimpleLeftMenuLayout } from "@/components/layouts/simple-left-menu-layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/info")({
  component: () => <SimpleLeftMenuLayout />,
});
