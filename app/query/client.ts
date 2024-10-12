import { QueryClient } from "@tanstack/react-query";
import { hc } from "hono/client";

import { AppType } from "@/server";

export const queryClient = new QueryClient();
export const client = hc<AppType>("/api");
