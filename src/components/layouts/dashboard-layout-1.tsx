import React from "react";
import {
  AnyRoute,
  Link,
  LinkProps,
  RegisteredRouter,
  RoutePaths,
} from "@tanstack/react-router";
import { CircleUser } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export function DashboardLayout1(props: {
  children: React.ReactNode;
  sideNav: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex-none"></div>
      <div className="h-screen min-h-[0px] basis-0 flex-1">
        <div className="flex h-full">
          {props.sideNav}
          <div className="w-full lg:ml-[13rem] ml-14">{props.children}</div>
        </div>
      </div>
    </div>
  );
}
export function LeftCollapsableSideNav(props: { topNav: React.ReactNode }) {
  const [navOpen, setNavOpen] = React.useState(false);
  return (
    <div className="w-14 h-full flex flex-col lg:w-[13rem] fixed">
      <nav
        className="group py-2 z-10 h-full w-14 data-[state=expanded]:w-[13rem] border-r bg-background border-default data-[state=expanded]:shadow-xl transition-width duration-200 hide-scrollbar flex flex-col justify-between overflow-y-auto lg:w-[13rem] overflow-x-hidden"
        data-state={navOpen ? "expanded" : "collapsed"}
        onMouseEnter={() => setNavOpen(true)}
        onMouseLeave={() => setNavOpen(false)}
      >
        <ul className="flex flex-col gap-y-1 justify-start px-2">
          {props.topNav}
        </ul>
        <ul className="flex flex-col px-2 gap-y-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <NavButton icon={<CircleUser />}>
                <div>Michael Francis</div>
                <div className="text-xs dark:text-gray-500">
                  mfrancis107@gmail.com
                </div>
              </NavButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[12rem]">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ul>
      </nav>
    </div>
  );
}
DashboardLayout1.LeftSideNav = LeftCollapsableSideNav;
const navItemClasses =
  "relative h-10 w-10 group-data-[state=expanded]:w-full lg:w-full transition-all duration-200 flex items-center rounded group-data-[state=collapsed]:justify-center lg:group-data-[state=expanded]:space-x-0 group-data-[state=expanded]:-space-x-2 text-foreground-lighter hover:text-foreground hover:bg-surface-200 !bg-selection !text-foreground shadow-sm group/item hover:bg-selected data-[status=active]:bg-selected";
const NavLink = <
  TRouteTree extends AnyRoute = RegisteredRouter["routeTree"],
  TFrom extends RoutePaths<TRouteTree> | string = string,
  TTo extends string = "",
  TMaskFrom extends RoutePaths<TRouteTree> | string = TFrom,
  TMaskTo extends string = "",
>(props: {
  children: React.ReactNode;
  icon: React.ReactNode;
  linkProps: Omit<
    React.PropsWithoutRef<
      LinkProps<TRouteTree, TFrom, TTo, TMaskFrom, TMaskTo> &
        Omit<React.ComponentPropsWithoutRef<"a">, "preload">
    >,
    "children" | "className" | "activeProps" | "inactiveProps"
  >;
}) => {
  const { children, icon, linkProps } = props;
  return (
    <Link className={navItemClasses} {...linkProps}>
      <span
        id="icon-link"
        className="absolute left-0 top-0 flex rounded h-10 w-10 items-center justify-center"
      >
        {icon}
      </span>
      <span className="min-w-[128px] text-sm text-foreground-light group-hover/item:text-foreground group-aria-current/item:text-foreground absolute left-7 group-data-[state=expanded]:left-12 opacity-0 group-data-[state=expanded]:opacity-100 transition-all lg:left-12 lg:opacity-100 lg:transition-none">
        {children}
      </span>
    </Link>
  );
};
DashboardLayout1.NavLink = NavLink;
const NavButton = React.forwardRef<
  React.ElementRef<"button">,
  React.ComponentPropsWithoutRef<"button"> & {
    icon: React.ReactNode;
  }
>(({ className, icon, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(navItemClasses, className, "w-full text-left")}
      {...props}
    >
      <span className="absolute left-0 top-0 flex rounded h-10 w-10 items-center justify-center">
        {icon}
      </span>
      <span className="min-w-[128px] text-sm text-foreground-light group-hover/item:text-foreground group-aria-current/item:text-foreground absolute left-7 group-data-[state=expanded]:left-12 opacity-0 group-data-[state=expanded]:opacity-100 transition-all lg:left-12 lg:opacity-100 lg:transition-none overflow-hidden max-w-[128px]">
        {props.children}
      </span>
    </button>
  );
});
DashboardLayout1.NavButton = NavButton;
