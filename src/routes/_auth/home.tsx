import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_auth/home")({
  component: Home,
});
function Home() {
  return <div className="flex flex-col items-center justify-center">Home</div>;
}
