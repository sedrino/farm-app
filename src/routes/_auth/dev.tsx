import { DashboardLayout1 as Layout } from "@/components/layouts/dashboard-layout-1";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Table } from "lucide-react";

export const Route = createFileRoute("/_auth/dev")({
  component: DevLayout,
});

export function DevLayout() {
  return (
    <Layout
      sideNav={
        <Layout.LeftSideNav
          topNav={
            <>
              <Layout.NavLink icon={<Table />} linkProps={{ to: "/dev/pages" }}>
                Page List
              </Layout.NavLink>
            </>
          }
        />
      }
    >
      <Outlet />
    </Layout>
  );
}
