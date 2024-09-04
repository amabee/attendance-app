import React from "react";

const ReportsModule = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Attendance Reports</h2>
      <ul className="list-disc pl-6">
        <li>Attendance by Student</li>
        <li>Attendance by Tribu</li>
        <li>Attendance by Year Level</li>
        <li>Combined Tribu/Year Level Reports</li>
      </ul>
    </div>
  );
};

export default ReportsModule;
