import React from "react";
import { RxUpdate } from "react-icons/rx";
import { MdDeleteOutline } from "react-icons/md";

interface TableProps {
  data: any[];
  onUpdate: (item: any) => void;
  onDelete: (id: string) => void;
}

const Table: React.FC<TableProps> = ({ data, onUpdate, onDelete }) => {
  return (
    <table className="table table-zebra mt-6 w-full">
      <thead>
        <tr>
          <th>Name</th>
          <th>URL</th>
          <th>Update</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((item, idx) => (
            <tr key={idx} className="cursor-pointer">
              <td>{item.name}</td>
              <td>{item.url}</td>
              <td
                className="view-data"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate(item);
                }}
              >
                <RxUpdate />
              </td>
              <td
                className="view-data"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item._id);
                }}
              >
                <MdDeleteOutline />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="text-center">
              No record found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
