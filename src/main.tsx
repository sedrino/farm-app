import "@/styles/globals.css";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query/client";
import { Devtools } from 'sedrino-devtools'
import {
  ClerkProvider,
} from "@clerk/clerk-react";
// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
const clerkPubKey = "pk_test_YXdhcmUtcHl0aG9uLTk4LmNsZXJrLmFjY291bnRzLmRldiQ";
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <ThemeProvider>
       <ClerkProvider publishableKey={clerkPubKey}>
      <QueryClientProvider client={queryClient}>
        {" "}
        <RouterProvider router={router} />
        <Devtools.ElementInspector/>
      </QueryClientProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
}
