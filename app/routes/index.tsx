import React from "react";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <div>Hello World!</div>;
}
