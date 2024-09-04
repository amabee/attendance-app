import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ReportsModule = () => {
  const url = "http://localhost/attendance-api/main.php";
  const [selectedReport, setSelectedReport] = useState("student");
  const [reportData, setReportData] = useState([]);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    fetchReportData();
  }, [selectedReport, sortColumn, sortDirection]);

  const fetchReportData = async () => {
    try {
      let response;
      let params = {
        operation: "getStudents",
        json: JSON.stringify({}),
        sortColumn,
        sortDirection,
      };

      switch (selectedReport) {
        case "student":
          params.operation = "getStudents";
          break;
        case "tribu":
          params.operation = "getAttendanceByTribu";
          break;
        case "yearLevel":
          params.operation = "getAttendanceByYearLevel";
          break;
        default:
          throw new Error("Invalid report type");
      }

      response = await axios.get(url, { params });

      if (response.data.success) {
        setReportData(response.data.success);
        console.log(response.data);
      } else {
        console.error("Error fetching data:", response.data.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = [...reportData].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Attendance Reports</h2>

      <select
        className="mb-4 p-2 border rounded"
        value={selectedReport}
        onChange={(e) => setSelectedReport(e.target.value)}
      >
        <option value="student">By Student</option>
        <option value="tribu">By Tribu</option>
        <option value="yearLevel">By Year Level</option>
      </select>

      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Name
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("student_number")}
            >
              Student Number
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("year_level")}
            >
              Year Level
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("attendance_rate")}
            >
              Attendance Rate
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => (
            <tr key={index}>
              <td className="border p-2">
                {row.name || row.tribu_id || row.year_level}
              </td>
              <td className="border p-2">{row.student_number || "-"}</td>
              <td className="border p-2">{row.year_level || "-"}</td>
              <td className="border p-2">
                {row.attendance_rate || row.count || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsModule;
