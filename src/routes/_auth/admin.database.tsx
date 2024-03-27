import { createFileRoute, Link } from "@tanstack/react-router";
import * as db from "@/server/db/schema";
import {
  getTableConfig,
  SQLiteTableWithColumns,
} from "drizzle-orm/sqlite-core";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_auth/admin/database")({
  component: Tables,
});

const allTables = Object.values(db);

function newUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function Tables() {
  const [activeView, setActiveView] = useState<"table" | "schema">("table");

  const handleViewChange = (view: "table" | "schema") => {
    setActiveView(view);
  };

  return (
    <div>
      <div className="flex gap-2 p-2">
        <span
          className={
            activeView === "table"
              ? "font-bold cursor-pointer"
              : "cursor-pointer"
          }
          onClick={() => handleViewChange("table")}
        >
          Table View
        </span>{" "}
        <span
          className={
            activeView === "schema"
              ? "font-bold cursor-pointer"
              : "cursor-pointer"
          }
          onClick={() => handleViewChange("schema")}
        >
          Schema View
        </span>{" "}
      </div>
      <hr />
      <div className="m-2 space-y-4">
        <div className="flex flex-wrap flex-row-reverse">
          {allTables
            .reverse()
            .map((table: SQLiteTableWithColumns<any>, index) => {
              const { columns, name } = getTableConfig(table);

              const displayedColumns = columns.slice(0, 2);
              const hiddenColumns = columns.slice(2);
              return (
                <div key={index} className="p-2" style={{ flex: "1 0 50%" }}>
                  <Link
                    to={
                      activeView === "table"
                        ? "/admin/datatable/$table/view"
                        : "/admin/datatable/$table/edit"
                    }
                    params={{ table: name }}
                  >
                    <Card
                      className="cursor-pointer hover:bg-gray-600 transition-colors duration-200 ease-in-out"
                      style={{ marginBottom: "1rem" }}
                    >
                      <CardHeader>
                        <CardTitle>{name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          <div className="flex-row">
                            {displayedColumns.map((column, index) => (
                              <React.Fragment key={index}>
                                <span>{column.name}</span>
                                {index < displayedColumns.length - 1 && (
                                  <span>, </span>
                                )}
                              </React.Fragment>
                            ))}
                            {hiddenColumns.length > 0 && <span> ...</span>}
                          </div>
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              );
            })}
        </div>

        <div className="flex flex-row">
          <Link
            to="/admin/datatable/$table/add"
            disabled
            params={{ table: newUUID() }}
          >
            <Button disabled>Add Table</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
