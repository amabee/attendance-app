import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Calendar,
  FileText,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import axios from "axios";
import Table from "./dasboardTable";

const MasterFileModule = () => {
  const url = "http://localhost/attendance-api/main.php";
  const [activeTab, setActiveTab] = useState("students");
  const [studentData, setStudentData] = useState([]);
  const [tribuData, setTribuData] = useState([]);
  const [yearLevelData, setYearLevelData] = useState([
    { level: 1 },
    { level: 2 },
    { level: 3 },
    { level: 4 },
  ]);

  // New state for modals and form data
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isAddTribuModalOpen, setIsAddTribuModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    student_number: "",
    contact_information: "",
    year_level: "",
  });
  const [newTribu, setNewTribu] = useState({ name: "" });

  function renderYearLevel(yearLevel) {
    switch (parseInt(yearLevel)) {
      case 1:
        return "1st Year";
      case 2:
        return "2nd Year";
      case 3:
        return "3rd Year";
      case 4:
        return "4th Year";
      default:
        return "Unknown";
    }
  }

  const getStudentData = async () => {
    try {
      const res = await axios.get(url, {
        params: {
          operation: "getStudents",
          json: "",
        },
      });

      if (res.status !== 200) {
        alert("Status Error: " + res.statusText);
        return;
      }

      if (res.data.success) {
        setStudentData(res.data.success);
      } else {
        setStudentData([]);
        alert("No students found");
      }
    } catch (e) {
      alert(e);
    }
  };

  const getTribus = async () => {
    try {
      const res = await axios.get(url, {
        params: {
          operation: "getTribus",
          json: "",
        },
      });

      if (res.status !== 200) {
        alert("Status Error: " + res.statusText);
        return;
      }

      if (res.data.success) {
        setTribuData(res.data.success);
      } else {
        setTribuData([]);
        alert("No Tribu found");
      }
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    getStudentData();
    getTribus();
  }, []);

  const handleEdit = (row) => {
    console.log("Edit", row);
  };

  const handleDelete = (row) => {
    console.log("Delete", row);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(url, null, {
        params: {
          operation: "createStudent",
          json: JSON.stringify(newStudent),
        },
      });

      if (res.data.success) {
        alert("Student added successfully");
        setIsAddStudentModalOpen(false);
        getStudentData();
      } else {
        alert("Failed to add student");
      }
    } catch (e) {
      alert("Error adding student: " + e.message);
    }
  };

  const handleAddTribu = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(url, null, {
        params: {
          operation: "createTribu",
          json: JSON.stringify(newTribu),
        },
      });

      if (res.data.success) {
        alert("Tribu added successfully");
        setIsAddTribuModalOpen(false);
        getTribus();
      } else {
        alert("Failed to add tribu");
        console.log(res.data);
      }
    } catch (e) {
      alert("Error adding tribu: " + e.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Master File Module</h2>
      <div className="mb-4">
        <button
          onClick={() => setActiveTab("students")}
          className={`mr-2 px-4 py-2 rounded ${
            activeTab === "students" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Students
        </button>
        <button
          onClick={() => setActiveTab("tribus")}
          className={`mr-2 px-4 py-2 rounded ${
            activeTab === "tribus" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Tribus
        </button>
        <button
          onClick={() => setActiveTab("yearLevels")}
          className={`px-4 py-2 rounded ${
            activeTab === "yearLevels"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Year Levels
        </button>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h3>
          <button
            onClick={() =>
              activeTab === "students"
                ? setIsAddStudentModalOpen(true)
                : setIsAddTribuModalOpen(true)
            }
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
          >
            <Plus size={16} className="mr-2" /> Add New
          </button>
        </div>
        {activeTab === "students" && (
          <Table
            headers={[
              "Key",
              "Name",
              "Student ID",
              "Email",
              "Year Level",
              "Date Registered",
            ]}
            data={studentData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderYearLevel={renderYearLevel}
            editable={false}
            deletable={true}
          />
        )}
        {activeTab === "tribus" && (
          <Table
            headers={["Key", "Name", "Date Created"]}
            data={tribuData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            editable={true}
            deletable={true}
          />
        )}
        {activeTab === "yearLevels" && (
          <Table
            headers={["Level"]}
            data={yearLevelData.map((yl) => ({
              level: renderYearLevel(yl.level),
            }))}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderYearLevel={renderYearLevel}
          />
        )}
      </div>

      {/* Add Student Modal */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Add New Student</h2>
            <form onSubmit={handleAddStudent}>
              <input
                type="text"
                placeholder="Name"
                value={newStudent.name}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, name: e.target.value })
                }
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                placeholder="Student ID"
                value={newStudent.student_number}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, student_number: e.target.value })
                }
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={newStudent.contact_information}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, contact_information: e.target.value })
                }
                className="w-full p-2 mb-2 border rounded"
              />
              <select
                value={newStudent.year_level}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, year_level: e.target.value })
                }
                className="w-full p-2 mb-4 border rounded"
              >
                <option value="">Select Year Level</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddStudentModalOpen(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Tribu Modal */}
      {isAddTribuModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Add New Tribu</h2>
            <form onSubmit={handleAddTribu}>
              <input
                type="text"
                placeholder="Tribu Name"
                value={newTribu.name}
                onChange={(e) =>
                  setNewTribu({ ...newTribu, name: e.target.value })
                }
                className="w-full p-2 mb-4 border rounded"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddTribuModalOpen(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Add Tribu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterFileModule;
