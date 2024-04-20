import { DashbordLayout1 as Layout } from "@/components/layouts/dashboard-layout-1";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Table } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <Layout
      sideNav={
        <Layout.LeftSideNav
          topNav={
            <>
              <Layout.NavLink icon={<Table />} linkProps={{ to: "/" }}>
                Link
              </Layout.NavLink>
              <Layout.NavLink icon={<Table />} linkProps={{ to: "/" }}>
                Link
              </Layout.NavLink>
              <Layout.NavLink icon={<Table />} linkProps={{ to: "/" }}>
                Link
              </Layout.NavLink>
              <Layout.NavLink icon={<Table />} linkProps={{ to: "/" }}>
                Link
              </Layout.NavLink>
            </>
          }
        />
      }
    >
      <Outlet />
    </Layout>
  ),
});
