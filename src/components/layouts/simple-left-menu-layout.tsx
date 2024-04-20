import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function SimpleLeftMenuLayout(props: {
  children?: React.ReactNode;
  sideNav?: React.ReactNode;
}) {
  return (
    <ResizablePanelGroup direction="horizontal" className="w-full flex h-full">
      <ResizablePanel minSize={20} maxSize={30} className="min-w-64">
        <div className="hide-scrollbar flex flex-col w-full h-full bg-studio border-default">
          <SimpleLeftMenuLayout.Header>
            <h4 className="text-lg">Database</h4>
          </SimpleLeftMenuLayout.Header>
          <ScrollArea>
            <div className="flex-grow overflow-y-auto">
              <div className="flex flex-col space-y-8 overflow-y-auto">
                <nav
                  role="menu"
                  aria-label="Sidebar"
                  aira-orientation="vertical"
                  aria-labelledby="options-menu
                "
                >
                  <ul>
                    <SimpleVerticalNavSection title="Database Management" />
                    <Separator />
                    <SimpleVerticalNavSection title="Database Management" />
                    <Separator />
                    <SimpleVerticalNavSection title="Database Management" />
                    <Separator />
                    <SimpleVerticalNavSection title="Database Management" />
                    <Separator />
                    <SimpleVerticalNavSection title="Database Management" />
                  </ul>
                </nav>
              </div>
            </div>
          </ScrollArea>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="" defaultSize={80}>
        <SimpleLeftMenuLayout.Header></SimpleLeftMenuLayout.Header>
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
          <div>
            <a
              className="block"
              target="_self"
              href="/dashboard/project/igonjjtlmgaappcalbps/database/tables"
            >
              <li
                role="menuitem"
                className="cursor-pointer flex space-x-3 items-center outline-none focus-visible:ring-1 ring-foreground-muted focus-visible:z-10 group px-3 py-1 font-semibold bg-surface-200 text-foreground-lighter z-10 rounded-md"
                aria-current="page"
              >
                <span className="transition truncate text-sm w-full text-foreground font-semibold">
                  <div className="flex w-full items-center justify-between gap-1">
                    <div
                      title="Tables"
                      className="flex items-center gap-2 truncate w-full "
                    >
                      <span className="truncate">Tables </span>
                    </div>
                  </div>
                </span>
              </li>
            </a>
            <a
              className="block"
              target="_self"
              href="/dashboard/project/igonjjtlmgaappcalbps/database/functions"
            >
              <li
                role="menuitem"
                className="cursor-pointer flex space-x-3 items-center outline-none focus-visible:ring-1 ring-foreground-muted focus-visible:z-10 group px-3 py-1 font-normal border-default group-hover:border-foreground-muted"
              >
                <span className="transition truncate text-sm w-full text-foreground-light group-hover:text-foreground">
                  <div className="flex w-full items-center justify-between gap-1">
                    <div
                      title="Functions"
                      className="flex items-center gap-2 truncate w-full "
                    >
                      <span className="truncate">Functions </span>
                    </div>
                  </div>
                </span>
              </li>
            </a>
            <a
              className="block"
              target="_self"
              href="/dashboard/project/igonjjtlmgaappcalbps/database/triggers"
            >
              <li
                role="menuitem"
                className="cursor-pointer flex space-x-3 items-center outline-none focus-visible:ring-1 ring-foreground-muted focus-visible:z-10 group px-3 py-1 font-normal border-default group-hover:border-foreground-muted"
              >
                <span className="transition truncate text-sm w-full text-foreground-light group-hover:text-foreground">
                  <div className="flex w-full items-center justify-between gap-1">
                    <div
                      title="Triggers"
                      className="flex items-center gap-2 truncate w-full "
                    >
                      <span className="truncate">Triggers </span>
                    </div>
                  </div>
                </span>
              </li>
            </a>
            <a
              className="block"
              target="_self"
              href="/dashboard/project/igonjjtlmgaappcalbps/database/types"
            >
              <li
                role="menuitem"
                className="cursor-pointer flex space-x-3 items-center outline-none focus-visible:ring-1 ring-foreground-muted focus-visible:z-10 group px-3 py-1 font-normal border-default group-hover:border-foreground-muted"
              >
                <span className="transition truncate text-sm w-full text-foreground-light group-hover:text-foreground">
                  <div className="flex w-full items-center justify-between gap-1">
                    <div
                      title="Enumerated Types"
                      className="flex items-center gap-2 truncate w-full "
                    >
                      <span className="truncate">Enumerated Types </span>
                    </div>
                  </div>
                </span>
              </li>
            </a>
            <a
              className="block"
              target="_self"
              href="/dashboard/project/igonjjtlmgaappcalbps/database/extensions"
            >
              <li
                role="menuitem"
                className="cursor-pointer flex space-x-3 items-center outline-none focus-visible:ring-1 ring-foreground-muted focus-visible:z-10 group px-3 py-1 font-normal border-default group-hover:border-foreground-muted"
              >
                <span className="transition truncate text-sm w-full text-foreground-light group-hover:text-foreground">
                  <div className="flex w-full items-center justify-between gap-1">
                    <div
                      title="Extensions"
                      className="flex items-center gap-2 truncate w-full "
                    >
                      <span className="truncate">Extensions </span>
                    </div>
                  </div>
                </span>
              </li>
            </a>
            <a
              className="block"
              target="_self"
              href="/dashboard/project/igonjjtlmgaappcalbps/database/indexes"
            >
              <li
                role="menuitem"
                className="cursor-pointer flex space-x-3 items-center outline-none focus-visible:ring-1 ring-foreground-muted focus-visible:z-10 group px-3 py-1 font-normal border-default group-hover:border-foreground-muted"
              >
                <span className="transition truncate text-sm w-full text-foreground-light group-hover:text-foreground">
                  <div className="flex w-full items-center justify-between gap-1">
                    <div
                      title="Indexes"
                      className="flex items-center gap-2 truncate w-full "
                    >
                      <span className="truncate">Indexes </span>
                    </div>
                  </div>
                </span>
              </li>
            </a>
            <a
              className="block"
              target="_self"
              href="/dashboard/project/igonjjtlmgaappcalbps/database/publications"
            >
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
                      <span className="truncate">Publications </span>
                    </div>
                  </div>
                </span>
              </li>
            </a>
          </div>
        </div>
      </div>
      <div className="h-px w-full bg-border-overlay"></div>
    </div>
  );
}
