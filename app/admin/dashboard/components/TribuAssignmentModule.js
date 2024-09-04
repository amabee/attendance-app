import axios from "axios";
import React, { useEffect, useState } from "react";

const TribuAssignmentModule = () => {
  const url = "http://localhost/attendance-api/main.php";
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [studentsWithOutTribu, setStudentsWithOutTribu] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTribu, setSelectedTribu] = useState("");
  const [tribus, setTribus] = useState([]);

  const yearLevelMapping = (year) => {
    switch (year) {
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
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAssignTribu = () => {
    setIsModalOpen(true);
  };

  const handleConfirmAssignment = async () => {
    const formData = new FormData();
    formData.append("operation", "assignStudentToTribu");
    formData.append(
      "json",
      JSON.stringify({
        tribu_id: selectedTribu,
        student_ids: selectedStudents,
      })
    );
  
    formData.forEach((value, key) => {
      console.log(`Key: ${key}, Value: ${value}`);
    });
  
    try {
      const res = await axios({
        url: url,
        method: "POST",
        data: formData,
      });
  
      if (res.status !== 200) {
        alert("Status error: " + res.statusText);
        return;
      }
  
      if (res.data.success) {
        alert("Students assigned to Tribu successfully");
        getStudentsWithOutTribu();
        setIsModalOpen(false);
        console.log(res.data);
      } else {
        alert("Failed to assign students to Tribu");
        console.log(res.data);
      }
    } catch (e) {
      alert(e);
    }
  };
  
  const getStudentsWithOutTribu = async () => {
    try {
      const res = await axios.get(url, {
        params: {
          operation: "getStudentsWithoutTribu",
          json: "",
        },
      });

      if (res.status !== 200) {
        alert("Status error: " + res.statusText);
        return;
      }

      if (res.data.success) {
        setStudentsWithOutTribu(res.data.success);
      } else {
        setStudentsWithOutTribu([]);
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
        setTribus(res.data.success);
      } else {
        setTribus([]);
        alert("No Tribu found");
      }
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    getStudentsWithOutTribu();
    getTribus();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tribu Assignment Module</h2>
      <p className="mb-4">Assign students to their respective Tribus here</p>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Select
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Student ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Year Level
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {studentsWithOutTribu.length > 0 ? (
            studentsWithOutTribu.map((student) => (
              <tr key={student.student_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    checked={selectedStudents.includes(student.student_id)}
                    onChange={() => handleSelectStudent(student.student_id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.student_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {yearLevelMapping(student.year_level)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="px-6 py-4 whitespace-nowrap text-center"
              >
                All of the students are in a tribu
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedStudents.length > 0 && (
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={handleAssignTribu}
        >
          Assign Tribu to Selected Students
        </button>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Assign Tribu
              </h3>
              <div className="mt-2 px-7 py-3">
                <label
                  htmlFor="tribu-select"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Select Tribu
                </label>
                <select
                  id="tribu-select"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={selectedTribu}
                  onChange={(e) => setSelectedTribu(e.target.value)}
                >
                  <option value="">Choose a Tribu</option>
                  {Array.isArray(tribus) &&
                    tribus.map((tribu) => (
                      <option key={tribu.tribu_id} value={tribu.tribu_id}>
                        {tribu.tribu_name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="ok-btn"
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onClick={handleConfirmAssignment}
                >
                  Confirm Assignment
                </button>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="cancel-btn"
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TribuAssignmentModule;
