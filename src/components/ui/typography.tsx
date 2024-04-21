import { cn } from "@/lib/utils";
import { type ClassValue } from "clsx";

export function headline(...inputs: ClassValue[]) {
  return cn("text-sm font-medium leading-none", ...inputs);
}

export function title(...inputs: ClassValue[]) {
  return cn("text-lg font-medium leading-none", ...inputs);
}

export function pageBreadcrumb(...inputs: ClassValue[]) {
  return cn("text-sm font-medium leading-none text-gray-500", ...inputs);
}

export function pageTitle(...inputs: ClassValue[]) {
  return cn("text-2xl font-medium leading-none text-3xl pt-6 pb-4", ...inputs);
}
