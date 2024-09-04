"use client";
import React, { useEffect, useState } from "react";
import { Users, UserPlus, Calendar, FileText } from "lucide-react";
import "../../global.css";
import MasterFileModule from "./components/MasterFileModule";
import TribuAssignmentModule from "./components/TribuAssignmentModule";
import AttendanceModule from "./components/AttendanceModule";
import ReportsModule from "./components/ReportsModule";
import EventsModule from "./components/events";

const Sidebar = ({ setActiveModule }) => (
  <div className="w-64 bg-gray-800 h-screen p-4">
    <h1 className="text-white text-xl font-bold mb-6">Admin Dashboard</h1>
    <nav>
      <button
        onClick={() => setActiveModule("masterFile")}
        className="w-full text-left text-white py-2 px-4 hover:bg-gray-700 rounded mb-2 flex items-center"
      >
        <Users className="mr-2" /> Master File
      </button>
      <button
        onClick={() => setActiveModule("tribuAssignment")}
        className="w-full text-left text-white py-2 px-4 hover:bg-gray-700 rounded mb-2 flex items-center"
      >
        <UserPlus className="mr-2" /> Tribu Assignment
      </button>
      <button
        onClick={() => setActiveModule("attendance")}
        className="w-full text-left text-white py-2 px-4 hover:bg-gray-700 rounded mb-2 flex items-center"
      >
        <Calendar className="mr-2" /> Attendance
      </button>
      <button
        onClick={() => setActiveModule("events")}
        className="w-full text-left text-white py-2 px-4 hover:bg-gray-700 rounded mb-2 flex items-center"
      >
        <Calendar className="mr-2" /> Events
      </button>
      <button
        onClick={() => setActiveModule("reports")}
        className="w-full text-left text-white py-2 px-4 hover:bg-gray-700 rounded mb-2 flex items-center"
      >
        <FileText className="mr-2" /> Reports
      </button>
    </nav>
  </div>
);

const AdminDashboard = () => {
  const [activeModule, setActiveModule] = useState("masterFile");
  const [data, setData] = useState(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("admin");
    if (!storedData) {
      window.location.href = "/admin";
    } else {
      setData(storedData);
    }
  }, []);

  return (
    <>
      {data ? (
        <div className="flex">
          <Sidebar setActiveModule={setActiveModule} />
          <div className="flex-1 bg-gray-100 min-h-screen">
            {activeModule === "masterFile" && <MasterFileModule />}
            {activeModule === "events" && <EventsModule />}
            {activeModule === "tribuAssignment" && <TribuAssignmentModule />}
            {activeModule === "attendance" && <AttendanceModule />}
            {activeModule === "reports" && <ReportsModule />}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AdminDashboard;
