import React, { useState, useEffect } from "react";
import axios from "axios";

const ReportsModule = () => {
  const url = "http://localhost/attendance-api/main.php";
  const [selectedReport, setSelectedReport] = useState("student");
  const [reportData, setReportData] = useState([]);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [tribus, setTribus] = useState([]);
  const [selectedTribu, setSelectedTribu] = useState("");
  const [selectedYearLevel, setSelectedYearLevel] = useState("");
  const [events, setEvents] = useState([]); // Added for event dropdown
  const [selectedEvent, setSelectedEvent] = useState(""); // Added for event selection

  useEffect(() => {
    fetchReportData();
  }, [
    selectedReport,
    sortColumn,
    sortDirection,
    selectedTribu,
    selectedYearLevel,
    selectedEvent,
  ]);

  useEffect(() => {
    if (selectedReport === "tribu") {
      getTribus();
    } else if (selectedReport === "yearLevel") {
      getEvents();
    }
  }, [selectedReport]);

  const getTribus = async () => {
    try {
      const res = await axios.get(url, {
        params: {
          operation: "getTribus",
          json: JSON.stringify({}),
        },
      });

      if (res.status !== 200) {
        console.error("Status Error: " + res.statusText);
        return;
      }

      if (res.data.success) {
        setTribus(res.data.success);
      } else {
        setTribus([]);
        console.error("No Tribu found");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getEvents = async () => {
    try {
      const res = await axios.get(url, {
        params: {
          operation: "getEvents",
          json: JSON.stringify({}),
        },
      });

      if (res.status !== 200) {
        console.error("Status Error: " + res.statusText);
        return;
      }

      if (res.data.success) {
        setEvents(res.data.success);
      } else {
        setEvents([]);
        console.error("No events found");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchReportData = async () => {
    try {
      const params = {
        operation:
          selectedReport === "tribu"
            ? "getAttendanceByTribu"
            : selectedReport === "yearLevel"
            ? "getAttendanceByYearLevelAndEvent"
            : "getStudents",
        json: JSON.stringify({
          ...(selectedReport === "tribu" && { tribu_id: selectedTribu }),
          ...(selectedReport === "yearLevel" && {
            year_level: selectedYearLevel,
            event_id: selectedEvent,
          }),
        }),
        sortColumn,
        sortDirection,
      };

      console.log("PARAMETERS: ", params);

      const response = await axios.get(url, { params });

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

      {selectedReport === "tribu" && (
        <select
          className="mb-4 ml-2 p-2 border rounded"
          value={selectedTribu}
          onChange={(e) => setSelectedTribu(e.target.value)}
        >
          <option value="">Select Tribu</option>
          {tribus.map((tribu) => (
            <option key={tribu.tribu_id} value={tribu.tribu_id}>
              {tribu.tribu_name}
            </option>
          ))}
        </select>
      )}

      {selectedReport === "yearLevel" && (
        <div className="mb-4 flex gap-2">
          <select
            className="p-2 border rounded"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            <option value="" disabled>
              Select Event
            </option>
            {events.map((event) => (
              <option key={event.event_id} value={event.event_id}>
                {event.event_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedReport === "student" && (
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
                Attendance Count
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr key={index}>
                <td className="border p-2">{row.name}</td>
                <td className="border p-2">{row.student_number}</td>
                <td className="border p-2">{row.year_level}</td>
                <td className="border p-2">{row.attendance_rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedReport === "tribu" && (
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort("tribu_name")}
              >
                Tribu Name
              </th>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort("total_count")}
              >
                Total Count
              </th>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort("present_count")}
              >
                Present Count
              </th>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort("absent_count")}
              >
                Absent Count
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr key={index}>
                <td className="border p-2">{row.tribu_name}</td>
                <td className="border p-2">{row.total_count}</td>
                <td className="border p-2">{row.present_count}</td>
                <td className="border p-2">{row.absent_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedReport === "yearLevel" && (
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort("year_level")}
              >
                Year Level
              </th>
              <th className="border p-2 cursor-pointer">Total Student Count</th>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort("attendance_rate")}
              >
                Attendance Count
              </th>
              <th
                className="border p-2 cursor-pointer"
              >
                Absent Count
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr key={index}>
                <td className="border p-2">{row.year_level}</td>
                <td className="border p-2">{row.total_students}</td>
                <td className="border p-2">{row.present_count}</td>
                <td className="border p-2">{row.total_students - row.present_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReportsModule;
