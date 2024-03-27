import { createFileRoute, Link } from "@tanstack/react-router";
import * as db from "@/server/db/schema";
import {
  getTableConfig,
  SQLiteTableWithColumns,
} from "drizzle-orm/sqlite-core";
import {
  Column,
  Table,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  RowData,
} from "@tanstack/react-table";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { client } from "@/query/client";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_auth/admin/datatable/$table/view")({
  component: DatabaseTable,
});

const allTables = Object.values(db);

const defaultColumn: Partial<ColumnDef<any>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      //@ts-ignore
      table.options.meta?.updateData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <input
        className="bg-transparent text-white w-full border border-white rounded-sm p-1"
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        disabled
        onBlur={onBlur}
      />
    );
  },
};

function DatabaseTable() {
  const params = Route.useParams();

  const [data2, setData] = useState(() => {
    return allTables
      .map(getTableConfig)
      .find((config) => config.name === params.table)?.columns;
  });

  const tableConfig = allTables
    .map(getTableConfig)
    .find((config) => config.name === params.table);

  console.log("tableConfig", tableConfig?.name);

  const { data } = useQuery({
    queryKey: ["table-view", params.table],
    queryFn: async () => {
      const tableName = tableConfig?.name;
      if (!tableName) return Promise.resolve([]);
      const res = await client.devtools["get-table-data"].$get({
        query: { name: tableName },
      });
      return await res.json();
    },
  });

  const columns = useMemo<ColumnDef<any>[]>(
    () =>
      tableConfig?.columns
        ? tableConfig.columns.map((column) => {
            return {
              id: column.name,
              header: column.name,
              cell: defaultColumn.cell,
              accessorFn: (row: any) => row[column.name],
            };
          })
        : [],

    []
  );

  const table = useReactTable({
    data: data || [],
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex: string | number, columnId: any, value: any) => {
        setData((old: any) =>
          old.map((row: any, index: any) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
    debugTable: true,
  });

  const addRow = () => {
    setData((old: any) => [
      ...old,
      {
        name: "",
        columnType: "",
        notNull: false,
      },
    ]);
  };
  const removeRow = (index: number) => {
    setData((old: any) => old.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="flex flex-col p-2">
      <h2>update the schema for {params.table}</h2>
      <div className="h-2" />

      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-4 py-2" // Add padding to table headers
                  >
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id} className="px-4 py-2">
                      {" "}
                      {/* Add padding to table cells */}
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
                {/*
                                <td className="px-4 py-2">
                                    <Button onClick={() => removeRow(row.index)}>Remove</Button>
                                </td>
                            */}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/**
                             <div className="flex-row space-x-2 mt-4 self-start mx-4">
                <Button onClick={addRow}>
                    Add Row
                </Button>
                <Button onClick={() => {
                    console.log(table.getRowModel().rows.map((row) => row.original));
                }}>
                    update schema
                </Button>
            </div>
                 */}
    </div>
  );
}
