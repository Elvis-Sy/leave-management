import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React from "react";

export const TableWrapper = ({RenderCell, columns, users}) => {

  return (
    <div className=" w-full flex flex-col gap-4">
      <Table aria-label="Table dynamique" classNames={{wrapper: 'h-[460px]'}}>
        <TableHeader columns={columns} className="w-full lg:hidden" >
          {(column) => (
            <TableColumn
              key={column.uid}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
              className={column.className}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={users}>
          {(item) => (
            <TableRow className="hover:bg-default-100">
              {(columnKey) => (
                <TableCell>
                  {RenderCell({ user: item, columnKey: columnKey })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
