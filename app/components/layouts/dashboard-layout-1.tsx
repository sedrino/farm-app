import React from "react";
import { Link, LinkProps } from "@tanstack/react-router";
import { CircleUser } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function DashboardLayout1(props: {
  children: React.ReactNode;
  sideNav: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-none"></div>
      <div className="h-screen min-h-[0px] flex-1 basis-0">
        <div className="flex h-full">
          {props.sideNav}
          <div className="ml-14 w-full lg:ml-[13rem]">{props.children}</div>
        </div>
      </div>
    </div>
  );
}
export function LeftCollapsableSideNav(props: { topNav: React.ReactNode }) {
  const [navOpen, setNavOpen] = React.useState(false);
  return (
    <div className="fixed flex h-full w-14 flex-col lg:w-[13rem]">
      <nav
        className="border-default transition-width hide-scrollbar group z-10 flex h-full w-14 flex-col justify-between overflow-y-auto overflow-x-hidden border-r bg-background py-2 duration-200 data-[state=expanded]:w-[13rem] data-[state=expanded]:shadow-xl lg:w-[13rem]"
        data-state={navOpen ? "expanded" : "collapsed"}
        onMouseEnter={() => setNavOpen(true)}
        onMouseLeave={() => setNavOpen(false)}
      >
        <ul className="flex flex-col justify-start gap-y-1 px-2">
          {props.topNav}
        </ul>
        <ul className="flex flex-col gap-y-1 px-2">
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
const NavLink = ({
  children,
  icon,
  ...linkProps
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
} & LinkProps) => {
  return (
    <Link className={navItemClasses} {...linkProps}>
      <span
        id="icon-link"
        className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded"
      >
        {icon}
      </span>
      <span className="text-foreground-light group-aria-current/item:text-foreground absolute left-7 min-w-[128px] text-sm opacity-0 transition-all group-hover/item:text-foreground group-data-[state=expanded]:left-12 group-data-[state=expanded]:opacity-100 lg:left-12 lg:opacity-100 lg:transition-none">
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
      <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded">
        {icon}
      </span>
      <span className="text-foreground-light group-aria-current/item:text-foreground absolute left-7 min-w-[128px] max-w-[128px] overflow-hidden text-sm opacity-0 transition-all group-hover/item:text-foreground group-data-[state=expanded]:left-12 group-data-[state=expanded]:opacity-100 lg:left-12 lg:opacity-100 lg:transition-none">
        {props.children}
      </span>
    </button>
  );
});
DashboardLayout1.NavButton = NavButton;
