import { createFileRoute, Outlet } from "@tanstack/react-router";

import {
  SimpleLeftMenuLayout,
  SimpleNavLink,
  SimpleVerticalNavSection,
} from "@/components/layouts/simple-left-menu-layout";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/layouts/app/basic")({
  component: () => (
    <SimpleLeftMenuLayout
      sideNav={
        <>
          <SimpleLeftMenuLayout.Header>
            <h4 className="text-lg">Page Layouts</h4>
          </SimpleLeftMenuLayout.Header>
          <SimpleLeftMenuLayout.ScrollArea>
            <SimpleVerticalNavSection title="Layouts">
              <SimpleNavLink to="/layouts/app/basic">Basic</SimpleNavLink>
              <SimpleNavLink to="/layouts/app/basic/tabs">Tabs</SimpleNavLink>
            </SimpleVerticalNavSection>
            <Separator />
            <SimpleVerticalNavSection title="Database Management" />
            <Separator />
            <SimpleVerticalNavSection title="Database Management" />
            <Separator />
            <SimpleVerticalNavSection title="Database Management" />
            <Separator />
            <SimpleVerticalNavSection title="Database Management" />
          </SimpleLeftMenuLayout.ScrollArea>
        </>
      }
      content={
        <>
          <Outlet />
        </>
      }
    />
  ),
});
