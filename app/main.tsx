import "@/styles/globals.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

import { ThemeProvider } from "@/components/theme-provider";

import { queryClient } from "./query/client";
import { routeTree } from "./routeTree.gen";

// import { Devtools } from "sedrino-devtools";
// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    queryClient,
  },
});
// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {" "}
        <RouterProvider router={router} />
        {/* <Devtools.ElementInspector /> */}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
