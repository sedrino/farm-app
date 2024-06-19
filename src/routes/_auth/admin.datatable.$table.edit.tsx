import { createFileRoute } from "@tanstack/react-router";
import * as db from "@/server/db/schema";
import { getTableConfig } from "drizzle-orm/sqlite-core";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useEffect, useState, useMemo } from "react";
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

export const Route = createFileRoute("/_auth/admin/datatable/$table/edit")({
  component: DatabaseTable,
});

const allTables = Object.values(db);

function ColTypeSelect({
  value,
  handleSelectChange,
}: {
  value: string;
  handleSelectChange: any;
}) {
  const options = [
    "integer",
    "bigint",
    "decimal",
    "numeric",
    "real",
    "doublePrecision",
    "char",
    "varchar",
    "text",
    "date",
    "time",
    "timestamp",
    "interval",
    "boolean",
    "json",
    "jsonb",
    "uuid",
  ];

  // temp for now just display for read only- can make this better later

  options.push(value);

  return (
    <Select
      value={value}
      disabled
      onValueChange={(value) => {
        handleSelectChange(value);
      }}
    >
      <SelectTrigger className="border-white">
        <SelectValue placeholder="Select a data type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Data Types</SelectLabel>
          {options.map((option, index) => (
            <SelectItem key={index} value={option}>
              {option}
            </SelectItem>
          ))}
          {/* Add more data types as needed */}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

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
    //select has no onBlur event
    const handleSelectChange = (newValue: string) => {
      //@ts-ignore
      table.options.meta?.updateData(index, id, newValue);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return id === "columnType" ? (
      <ColTypeSelect
        value={value as string}
        handleSelectChange={handleSelectChange}
      />
    ) : id === "notNull" ? (
      <Checkbox
        checked={value as boolean}
        onBlur={onBlur}
        disabled
        onCheckedChange={(checked) => setValue(checked)}
      />
    ) : (
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

  const [data, setData] = useState(() => {
    return allTables
      .map(getTableConfig)
      .find((config) => config.name === params.table)?.columns;
  });

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: "Column Name",
        accessorFn: (row) => row.name,
        id: "name",
      },
      {
        header: "Column Type",
        accessorFn: (row) => row.columnType,
        id: "columnType",
      },
      {
        header: "Not Null",
        accessorFn: (row) => row.notNull,
        id: "notNull",
      },
    ],

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
