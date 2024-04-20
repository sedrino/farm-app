import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { Outlet, createFileRoute } from "@tanstack/react-router";
//config required @ https://dashboard.clerk.com/apps/app_***/instances/*****/paths
export const Route = createFileRoute("/_auth")({
  component: () => (
    <div className="min-h-full flex flex-col">
      <SignedIn>
        <Outlet></Outlet>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn></RedirectToSignIn>
      </SignedOut>
    </div>
  ),
});
