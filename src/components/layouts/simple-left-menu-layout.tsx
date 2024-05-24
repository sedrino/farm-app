import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Link, LinkProps } from "@tanstack/react-router";

export function SimpleLeftMenuLayout(props: {
  content?: React.ReactNode;
  sideNav?: React.ReactNode;
}) {
  return (
    <ResizablePanelGroup direction="horizontal" className="w-full flex h-full">
      <ResizablePanel minSize={20} maxSize={30} className="min-w-64">
        <div className="hide-scrollbar flex flex-col w-full h-full bg-studio border-default">
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
    <div className="border-default flex max-h-12 items-center border-b px-6 h-12 min-h-12">
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
          <div className=" flex space-x-3 mb-2 font-normal px-3">
            <span className="text-sm text-foreground-lighter w-full">
              <div className="flex flex-col space-y-2 uppercase font-mono">
                <span>{props.title}</span>
              </div>
            </span>
          </div>
          <div>{props.children}</div>
        </div>
      </div>
      <div className="h-px w-full bg-border-overlay"></div>
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
        className="cursor-pointer flex space-x-3 items-center outline-none focus-visible:ring-1 ring-foreground-muted focus-visible:z-10 group px-3 py-1 font-normal border-default group-hover:border-foreground-muted"
      >
        <span className="transition truncate text-sm w-full text-foreground-light group-hover:text-foreground">
          <div className="flex w-full items-center justify-between gap-1">
            <div
              title="Publications"
              className="flex items-center gap-2 truncate w-full "
            >
              <span className="truncate">{children}</span>
            </div>
          </div>
        </span>
      </li>
    </Link>
  );
};
