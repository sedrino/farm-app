import { meta } from "@/meta";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dev/")({
  component: DevHomePage,
});

export function DevHomePage() {
  return (
    <div className="flex flex-col gap-2 justify-start items-start">
      <div>Application Name: {meta.name}</div>
      <div>Application Description: {meta.description}</div>
      <div>Application Version: {meta.version}</div>
    </div>
  );
}
