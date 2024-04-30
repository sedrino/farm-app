import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Login,
});

function Login() {
  return <div className="flex flex-1 justify-center items-center"></div>;
}
