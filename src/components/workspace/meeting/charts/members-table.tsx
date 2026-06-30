"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { IMemberDTO } from "@/types";
import Loader from "@/components/Loader";

type Props = {
  members: IMemberDTO[]
};

const MembersTable = ({ members }: Props) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const data: IMemberDTO[] = useMemo(() => {
    return members.map((member) => ({
      ...member,
      })
    )
  }, [members]);

  const columns = useMemo<ColumnDef<IMemberDTO>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: (info) => info.getValue<string>(),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => info.getValue<string>(),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: (info) => info.getValue<string>(),
      },
      {
        accessorKey: "joinedAt",
        header: "Joined At",
        cell: (info) => new Date(info.getValue<string>()).toLocaleString(),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: (info) => new Date(info.getValue<string>()).toLocaleString(),
      }
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: false,
  });

  return (
    <div className="p-2">
        <>
          <table className="w-full table-auto border border-accent-foreground text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="text-left py-2"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-4 text-center">
                    No members found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-t">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex items-center gap-3 mt-3">
            <button
              className="border rounded px-2 py-1"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </button>
            <button
              className="border rounded px-2 py-1"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </button>
            <button
              className="border rounded px-2 py-1"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </button>
            <button
              className="border rounded px-2 py-1"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </button>

            <span className="ml-4">
              Page{" "}
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>

            <span className="ml-4">
              | Go to page:{" "}
              <input
                type="number"
                min={1}
                max={table.getPageCount()}
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="border p-1 rounded w-20 ml-2"
              />
            </span>

            <select
              className="ml-4 border rounded p-1"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[5, 10, 20, 30].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>

            <div className="ml-auto text-sm">
              Showing {table.getRowModel().rows.length} of {data.length} members
            </div>
          </div>
        </>
    </div>
  );
};

export default MembersTable;
