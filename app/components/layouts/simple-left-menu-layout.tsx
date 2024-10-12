import React from "react";
import { Link, LinkProps } from "@tanstack/react-router";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export function SimpleLeftMenuLayout(props: {
  content?: React.ReactNode;
  sideNav?: React.ReactNode;
}) {
  return (
    <ResizablePanelGroup direction="horizontal" className="flex h-full w-full">
      <ResizablePanel minSize={20} maxSize={30} className="min-w-64">
        <div className="hide-scrollbar bg-studio border-default flex h-full w-full flex-col">
          {props.sideNav}
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="h-full" defaultSize={80}>
        {props.content}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
SimpleLeftMenuLayout.Header = (props: { children?: React.ReactNode }) => {
  return (
    <div className="border-default flex h-12 max-h-12 min-h-12 items-center border-b px-6">
      {props.children}
    </div>
  );
};
SimpleLeftMenuLayout.ScrollArea = (props: { children?: React.ReactNode }) => {
  return (
    <div className="flex-grow overflow-y-auto">
      <div className="flex flex-col space-y-8 overflow-y-auto">
        <nav
          role="menu"
          aria-label="Sidebar"
          aira-orientation="vertical"
          aria-labelledby="options-menu
                "
        >
          <ul>{props.children}</ul>
        </nav>
      </div>
    </div>
  );
};
export function SimpleVerticalNavSection(props: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <div className="my-6 space-y-8">
        <div className="mx-3">
          <div className="mb-2 flex space-x-3 px-3 font-normal">
            <span className="text-foreground-lighter w-full text-sm">
              <div className="flex flex-col space-y-2 font-mono uppercase">
                <span>{props.title}</span>
              </div>
            </span>
          </div>
          <div>{props.children}</div>
        </div>
      </div>
      <div className="bg-border-overlay h-px w-full"></div>
    </div>
  );
}
export const SimpleNavLink = ({
  children,
  icon,
  ...linkProps
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
} & LinkProps) => {
  return (
    <Link {...linkProps}>
      <li
        role="menuitem"
        className="ring-foreground-muted border-default group-hover:border-foreground-muted group flex cursor-pointer items-center space-x-3 px-3 py-1 font-normal outline-none focus-visible:z-10 focus-visible:ring-1"
      >
        <span className="text-foreground-light w-full truncate text-sm transition group-hover:text-foreground">
          <div className="flex w-full items-center justify-between gap-1">
            <div
              title="Publications"
              className="flex w-full items-center gap-2 truncate"
            >
              <span className="truncate">{children}</span>
            </div>
          </div>
        </span>
      </li>
    </Link>
  );
};
