import { StartClient } from "@tanstack/start";
import { hydrateRoot } from "react-dom/client";

import { createRouter } from "./router.tsx";

const router = createRouter();

hydrateRoot(document.getElementById("root")!, <StartClient router={router} />);
