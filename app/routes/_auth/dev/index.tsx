import { createFileRoute } from "@tanstack/react-router";

import { meta } from "@/meta";

export const Route = createFileRoute("/_auth/dev/")({
  component: DevHomePage,
});
export function DevHomePage() {
  return (
    <div className="flex flex-col items-start justify-start gap-2">
      <div>Application Name: {meta.name}</div>
      <div>Application Description: {meta.description}</div>
      <div>Application Version: {meta.version}</div>
    </div>
  );
}
