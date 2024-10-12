import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  addReport,
  deleteReport,
  generateMaintenanceReport,
  generateReport,
} from "@/server/db/queries/report/write";

// Define the input schema
const CreateReportInput = z.object({
  report: z.object({
    reportName: z.string().min(1, "Report name is required"),
    reportType: z.string().min(1, "Report type is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    notes: z.string().optional(),
    isScheduled: z.boolean().default(false),
    scheduleFrequency: z.string().optional(),
  }),
  dataPoints: z.array(z.string()).default([]).optional(),
  groupingOptions: z.array(z.string()).default([]).optional(),
  summaryOptions: z.array(z.string()).default([]).optional(),
});

export const $createReport = createServerFn(
  "POST",
  async (input: z.input<typeof CreateReportInput>) => {
    try {
      const result = CreateReportInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const report = await addReport(result.data);

      return {
        report,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: error.message,
        };
      } else {
        return {
          error: "Unknown error",
        };
      }
    }
  }
);

// Define the input schema
const DeleteReportInput = z.object({
  reportId: z.string().min(1, "Report ID is required"),
});

export const $deleteReport = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteReportInput>) => {
    try {
      const result = DeleteReportInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteReport(result.data.reportId);

      return {
        success: true,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: error.message,
        };
      } else {
        return {
          error: "Unknown error",
        };
      }
    }
  }
);

// Define the input schema
const GenerateMaintenanceReportInput = z.object({
  report: z.object({
    dateRange: z.string().min(1, "Date range is required"),
    reportType: z.string().min(1, "Report type is required"),
    stallId: z.string().optional(),
  }),
});

export const $generateMaintenanceReport = createServerFn(
  "POST",
  async (input: z.input<typeof GenerateMaintenanceReportInput>) => {
    try {
      const result = GenerateMaintenanceReportInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const report = await generateMaintenanceReport(result.data.report);

      return {
        report,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: error.message,
        };
      } else {
        return {
          error: "Unknown error",
        };
      }
    }
  }
);

// Define the input schema
const GenerateReportInput = z.object({
  report: z.object({
    reportType: z.enum([
      "facility_usage",
      "event_participation",
      "visitor_frequency",
    ]),
    dateRange: z.string().min(1, "Date range is required"),
    filters: z.object({
      facilityId: z.string().optional(),
      eventTypeId: z.string().optional(),
      visitorId: z.string().optional(),
    }),
    grouping: z.enum(["week", "month", "facility_type"]).optional(),
  }),
});

export const $generateReport = createServerFn(
  "POST",
  async (input: z.input<typeof GenerateReportInput>) => {
    try {
      const result = GenerateReportInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const report = await generateReport(result.data.report);

      return {
        report,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: error.message,
        };
      } else {
        return {
          error: "Unknown error",
        };
      }
    }
  }
);
