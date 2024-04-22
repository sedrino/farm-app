import * as React from "react";
import {
  AnyRoute,
  Link,
  LinkProps,
  RegisteredRouter,
  RoutePaths,
  Outlet,
} from "@tanstack/react-router";

import { cn } from "@/lib/utils";

// forward ref of a div
const LinkTabsRoot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />;
});

const LinkTabsList = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-10 items-center justify-center rounded-md p-1",
        className
      )}
      {...props}
    />
  );
});

const LinkTabsTrigger = <
  TRouteTree extends AnyRoute = RegisteredRouter["routeTree"],
  TFrom extends RoutePaths<TRouteTree> | string = string,
  TTo extends string = "",
  TMaskFrom extends RoutePaths<TRouteTree> | string = TFrom,
  TMaskTo extends string = "",
>(props: {
  children: React.ReactNode;
  className?: string;
  linkProps: Omit<
    React.PropsWithoutRef<
      LinkProps<TRouteTree, TFrom, TTo, TMaskFrom, TMaskTo> &
        Omit<React.ComponentPropsWithoutRef<"a">, "preload">
    >,
    "children" | "className" | "activeProps" | "inactiveProps"
  >;
}) => {
  const { children, className, linkProps } = props;
  return (
    <Link
      className={cn(
        "ring-offset-background focus-visible:ring-ring data-[status=active]:bg-background data-[status=active]:text-foreground inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[status=active]:shadow-sm",
        className
      )}
      {...linkProps}
    >
      {children}
    </Link>
  );
};

const LinkTabsOutlet = () => {
  return (
    <div className="mt-2">
      <Outlet />
    </div>
  );
};

export const LinkTabs = {
  Root: LinkTabsRoot,
  List: LinkTabsList,
  Trigger: LinkTabsTrigger,
  Outlet: LinkTabsOutlet,
};
