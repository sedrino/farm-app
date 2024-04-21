import {
  SimpleLeftMenuLayout,
  SimpleNavLink,
  SimpleVerticalNavSection,
} from "@/components/layouts/simple-left-menu-layout";
import { Separator } from "@/components/ui/separator";
import { Outlet, createFileRoute } from "@tanstack/react-router";

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
              <SimpleNavLink linkProps={{ to: "/layouts/app/basic" }}>
                Basic
              </SimpleNavLink>
              <SimpleNavLink linkProps={{ to: "/layouts/app/basic/tabs" }}>
                Tabs
              </SimpleNavLink>
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
