import "@/styles/globals.css";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query/client";
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
