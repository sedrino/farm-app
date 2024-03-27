
import { createFileRoute } from "@tanstack/react-router";
import { SignUp } from "@clerk/clerk-react";

export const Route = createFileRoute("/signup")({
  component: Signup,
});

function Signup() {
  return (
    <div className="flex flex-1 justify-center items-center">
      <SignUp />
    </div>
  );
}
