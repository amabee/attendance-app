import {
  Users,
  UserPlus,
  Calendar,
  FileText,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

const Table = ({
  headers,
  data,
  onEdit,
  onDelete,
  renderYearLevel,
  editable,
  deletable,
}) => (
  <div style={{ maxHeight: "400px", overflowY: "auto" }}>
    <table className="min-w-full bg-white table-auto">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
            >
              {header}
            </th>
          ))}
          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {Object.entries(row).map(([key, value], cellIndex) => (
              <td
                key={cellIndex}
                className="px-6 py-4 whitespace-no-wrap border-b border-gray-200"
              >
                {key === "year_level" ? renderYearLevel(value) : value}
              </td>
            ))}
            <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200">
              {editable ? (
                <button
                  onClick={() => onEdit(row)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  <Pencil size={16} />
                </button>
              ) : null}

              {deletable ? (
                <button
                  onClick={() => onDelete(row)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 size={16} />
                </button>
              ) : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Table;
