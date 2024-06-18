import { createFileRoute } from "@tanstack/react-router";
import { pageDescriptions } from "@/utils/page-list";
import { Link } from "@tanstack/react-router";
import { Panel } from "@/components/ui/panel";
import { prose } from "@/components/ui/typography";
export const Route = createFileRoute("/_auth/dev/pages")({
  component: PageListComponent,
});
export function PageListComponent() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <p>This page lists all the initial pages that were generated for you.</p>
      <div className="flex flex-col gap-4">
        {pageDescriptions.map((page) => (
          <Panel key={page.path} className="flex flex-col gap-2 p-4">
            <p className={prose()}>
              {page.path.includes("$") ? (
                page.path
              ) : (
                <Link to={page.path}>{page.path}</Link>
              )}
            </p>
            <p className={prose()}>{page.description}</p>
          </Panel>
        ))}
      </div>
    </div>
  );
}
