import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@clerk/clerk-react";

export const Route = createFileRoute("/")({
  component: Login,
});

function Login() {
  return (
    <div className="flex flex-1 justify-center items-center">
      <SignIn/>
    </div>
  );
}
