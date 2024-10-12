import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { financialReportOptions } from "@/query/options/financial-reports";
import { reportExportOptions } from "@/query/options/report-exports";

export const Route = createFileRoute("/finance/reports/$reportId/")({
  component: FinancialReportComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      financialReportOptions({
        reportId: opts.params.reportId,
      })
    );
  },
});

function FinancialReportComponent() {
  const { reportId } = Route.useParams();
  const { data: report } = useSuspenseQuery(
    financialReportOptions({
      reportId,
    })
  );

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Financial Report</h1>
        <div>
          <h2 className="text-xl font-semibold">{report.name}</h2>
          <p>{report.description}</p>
          <p>
            Date Range: {new Date(report.dateRangeStart).toLocaleDateString()} -{" "}
            {new Date(report.dateRangeEnd).toLocaleDateString()}
          </p>
        </div>
        <div className="mt-4">
          {/* Placeholder for charts and graphs */}
          <h3 className="text-lg font-semibold">Charts and Graphs</h3>
          <p>(Interactive charts will be displayed here)</p>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button variant="default">Regenerate Report</Button>
          <Button variant="outline">Export as PDF</Button>
          <Button variant="outline">Export as Excel</Button>
          <Button variant="outline">Export as CSV</Button>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Line Items</h3>
          <p>(Detailed line items will be displayed here)</p>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Sharing Options</h3>
          <p>(Options to share the report will be displayed here)</p>
        </div>
      </Panel>
    </div>
  );
}
