import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Admin = () => {
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState("add-student");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentId, setStudentId] = useState("");

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [adminCredentials, setAdminCredentials] = useState([
    { email: "vamsipf@gmail.com", password: "admin@1234" }
  ]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const ADMIN_CREDENTIALS = {
    email: "vamsipf@gmail.com",
    password: "admin@1234",
   

  };

  useEffect(() => {
    const storedStudents = localStorage.getItem("students");
    const storedAttendance = localStorage.getItem("attendance");
    const storedAdmins = localStorage.getItem("adminCredentials");

    if (storedStudents) setStudents(JSON.parse(storedStudents));
    if (storedAttendance) setAttendance(JSON.parse(storedAttendance));
    if (storedAdmins) {
      setAdminCredentials(JSON.parse(storedAdmins));
    }

    if (!storedStudents) {
      const demoStudent = {
        id: "STU-001",
        name: "Demo Student",
        email: "student@demo.com",
        password: "demo123",
        createdDate: new Date().toISOString().split("T")[0],
        directLogin: true
      };
      localStorage.setItem("students", JSON.stringify([demoStudent]));
      setStudents([demoStudent]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("attendance", JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem("adminCredentials", JSON.stringify(adminCredentials));
  }, [adminCredentials]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    const isValidAdmin = adminCredentials.some(
      admin => admin.email === adminEmail && admin.password === adminPassword
    );

    if (isValidAdmin) {
      setIsAdminLoggedIn(true);
      setAdminEmail("");
      setAdminPassword("");
    } else {
      setLoginError("Invalid email or password");
    }
  };

  const handleAddStudent = (e) => {
    e.preventDefault();

    if (!studentName || !studentEmail || !studentId) {
      alert("Please fill all fields");
      return;
    }

    const newStudent = {
      id: studentId,
      name: studentName,
      email: studentEmail,
      createdDate: new Date().toISOString().split("T")[0]
    };

    if (students.some(s => s.id === studentId)) {
      alert("Student ID already exists");
      return;
    }

    setStudents([...students, newStudent]);
    setStudentName("");
    setStudentEmail("");
    setStudentId("");
    alert("Student added successfully!");
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents(students.filter(s => s.id !== id));
      alert("Student deleted successfully!");
    }
  };

  const handleOpenRoleModal = () => {
    if (!newUserEmail || !newUserPassword) {
      alert("Please enter email and password first");
      return;
    }
    setShowRoleModal(true);
  };

  const handleAddCredentials = (role) => {
    if (role === "admin") {
      const adminExists = adminCredentials.some(
        admin => admin.email === newUserEmail
      );
      if (adminExists) {
        alert("Admin with this email already exists");
        setShowRoleModal(false);
        return;
      }
      setAdminCredentials([...adminCredentials, { email: newUserEmail, password: newUserPassword }]);
      alert("Admin credentials added successfully!");
    } else if (role === "student") {
      const studentExists = students.some(s => s.email === newUserEmail);
      if (studentExists) {
        alert("Student with this email already exists");
        setShowRoleModal(false);
        return;
      }
      const newStudent = {
        id: `STU-${Date.now()}`,
        name: newUserEmail.split("@")[0],
        email: newUserEmail,
        password: newUserPassword,
        createdDate: new Date().toISOString().split("T")[0],
        directLogin: true
      };
      setStudents([...students, newStudent]);
      alert("Student credentials added successfully!");
    }
    
    setNewUserEmail("");
    setNewUserPassword("");
    setShowRoleModal(false);
  };

  const handleMarkAttendance = (studentId, status) => {
    const attendanceKey = `${selectedDate}`;

    setAttendance(prev => ({
      ...prev,
      [attendanceKey]: {
        ...prev[attendanceKey],
        [studentId]: status
      }
    }));
  };

  const getAttendanceStatus = (studentId) => {
    const attendanceKey = `${selectedDate}`;
    return attendance[attendanceKey]?.[studentId] || "not-marked";
  };

  const getAttendancePercentage = (studentId) => {
    let presentDays = 0;
    let totalDays = 0;

    Object.keys(attendance).forEach(date => {
      if (attendance[date][studentId] !== undefined) {
        totalDays++;
        if (attendance[date][studentId] === "present") {
          presentDays++;
        }
      }
    });

    if (totalDays === 0) return 0;
    return ((presentDays / totalDays) * 100).toFixed(2);
  };

  if (!isAdminLoggedIn) {
    return (
      <StyledWrapper>
        <div className="admin-login-container">
          <div className="login-box">
            <h1 className="login-title">Admin Portal</h1>
            <form onSubmit={handleAdminLogin}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@campusconnect.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>

              {loginError && <div className="error-message">{loginError}</div>}

              <button type="submit" className="login-btn">Login</button>
            </form>

            <div className="add-candidate-section">
              <h3>Add New Admin/Student</h3>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>

              <button 
                type="button" 
                className="add-candidate-btn"
                onClick={handleOpenRoleModal}
              >
                Add Candidate
              </button>
            </div>

            {showRoleModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h2>Select Role</h2>
                  <p>Choose whether to add as Admin or Student</p>
                  <div className="role-buttons">
                    <button
                      className="role-btn admin-role"
                      onClick={() => handleAddCredentials("admin")}
                    >
                      Admin
                    </button>
                    <button
                      className="role-btn student-role"
                      onClick={() => handleAddCredentials("student")}
                    >
                      Student
                    </button>
                  </div>
                  <button
                    className="close-modal-btn"
                    onClick={() => setShowRoleModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="demo-credentials">
              <p><strong>🔐 Admin Portal Login:</strong></p>
              <p>Email: vamsipf@gmail.com</p>
              <p>Password: admin@1234</p>
              
              <p style={{marginTop: "15px"}}><strong>👤 Student Direct Login (Home Page):</strong></p>
              <p>Email: student@demo.com</p>
              <p>Password: demo123</p>
            </div>
          </div>
        </div>
      </StyledWrapper>
    );
  }

  return (
    <StyledWrapper>
      <div className="admin-container">
        <nav className="admin-navbar">
          <div className="nav-content">
            <h1 className="admin-title">CampusConnect Admin</h1>
            <button
              className="logout-btn"
              onClick={() => setIsAdminLoggedIn(false)}
            >
              Logout
            </button>
          </div>
        </nav>

        <div className="admin-content">
          <div className="tabs-container">
            <button
              className={`tab-btn ${activeTab === "add-student" ? "active" : ""}`}
              onClick={() => setActiveTab("add-student")}
            >
              Add Student
            </button>
            <button
              className={`tab-btn ${activeTab === "manage-students" ? "active" : ""}`}
              onClick={() => setActiveTab("manage-students")}
            >
              Manage Students
            </button>
            <button
              className={`tab-btn ${activeTab === "attendance" ? "active" : ""}`}
              onClick={() => setActiveTab("attendance")}
            >
              Attendance
            </button>
          </div>

          {/* Add Student Tab */}
          {activeTab === "add-student" && (
            <div className="tab-content">
              <h2>Add New Student</h2>
              <form onSubmit={handleAddStudent} className="student-form">
                <div className="form-group">
                  <label>Student Name</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter student name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Student ID</label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter student ID"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="Enter student email"
                    required
                  />
                </div>

                <button type="submit" className="submit-btn">Add Student</button>
              </form>
            </div>
          )}

          {/* Manage Students Tab */}
          {activeTab === "manage-students" && (
            <div className="tab-content">
              <h2>Manage Students</h2>
              {students.length === 0 ? (
                <p className="empty-message">No students added yet</p>
              ) : (
                <div className="students-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Created Date</th>
                        <th>Attendance %</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(student => (
                        <tr key={student.id}>
                          <td>{student.id}</td>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>{student.createdDate}</td>
                          <td className="attendance-percentage">{getAttendancePercentage(student.id)}%</td>
                          <td>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteStudent(student.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === "attendance" && (
            <div className="tab-content">
              <h2>Mark Attendance</h2>
              <div className="attendance-controls">
                <div className="date-picker">
                  <label>Select Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>

              {students.length === 0 ? (
                <p className="empty-message">No students to mark attendance</p>
              ) : (
                <div className="attendance-grid">
                  {students.map(student => (
                    <div key={student.id} className="attendance-card">
                      <div className="student-info">
                        <h3>{student.name}</h3>
                        <p>ID: {student.id}</p>
                      </div>

                      <div className="attendance-buttons">
                        <button
                          className={`present-btn ${getAttendanceStatus(student.id) === "present" ? "active" : ""}`}
                          onClick={() => handleMarkAttendance(student.id, "present")}
                        >
                          Present
                        </button>
                        <button
                          className={`absent-btn ${getAttendanceStatus(student.id) === "absent" ? "active" : ""}`}
                          onClick={() => handleMarkAttendance(student.id, "absent")}
                        >
                          Absent
                        </button>
                        <button
                          className={`leave-btn ${getAttendanceStatus(student.id) === "leave" ? "active" : ""}`}
                          onClick={() => handleMarkAttendance(student.id, "leave")}
                        >
                          Leave
                        </button>
                      </div>

                      <div className="status-display">
                        Status: <span className={`status ${getAttendanceStatus(student.id)}`}>
                          {getAttendanceStatus(student.id).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  ${props => props.theme?.fonts || ""}
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  background: #1a1a2e;
  min-height: 100vh;
  color: #e0e0e0;
  font-family: 'Poppins', sans-serif;

  .admin-login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #1a1a2e;
  }

  .login-box {
    background: rgba(0, 212, 255, 0.05);
    border: 2px solid #00d4ff;
    border-radius: 10px;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 0 30px rgba(0, 212, 255, 0.2);
  }

  .login-title {
    color: #00d4ff;
    text-align: center;
    margin-bottom: 30px;
    font-size: 28px;
    text-shadow: 0 0 10px rgba(0, 212, 255, 0.4);
  }

  .form-group {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
  }

  .form-group label {
    color: #00d4ff;
    margin-bottom: 8px;
    font-weight: 600;
  }

  .form-group input {
    background: rgba(26, 26, 46, 0.6);
    border: 2px solid #00d4ff;
    color: #e0e0e0;
    padding: 12px;
    border-radius: 5px;
    font-size: 14px;
    transition: all 0.3s ease;
  }

  .form-group input:focus {
    outline: none;
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
    background: rgba(26, 26, 46, 0.8);
  }

  .error-message {
    background: rgba(244, 67, 54, 0.1);
    border: 1px solid #f44336;
    color: #ff6b6b;
    padding: 12px;
    border-radius: 5px;
    margin-bottom: 15px;
    text-align: center;
  }

  .login-btn {
    width: 100%;
    padding: 12px;
    background: transparent;
    border: 2px solid #0066CC;
    color: #0066CC;
    font-weight: 600;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
  }

  .login-btn:hover {
    background: rgba(0, 102, 204, 0.1);
    box-shadow: 0 0 15px rgba(0, 102, 204, 0.3);
  }

  .demo-credentials {
    background: rgba(0, 212, 255, 0.1);
    border: 1px solid #00d4ff;
    padding: 15px;
    border-radius: 5px;
    margin-top: 20px;
    font-size: 12px;
  }

  .demo-credentials p {
    margin: 5px 0;
    color: #b0b0b0;
  }

  .demo-credentials strong {
    color: #00d4ff;
  }

  .add-candidate-section {
    background: rgba(0, 212, 255, 0.08);
    border: 1px solid #00d4ff;
    padding: 20px;
    border-radius: 8px;
    margin-top: 25px;
  }

  .add-candidate-section h3 {
    color: #00d4ff;
    font-size: 16px;
    margin-bottom: 15px;
    text-align: center;
  }

  .add-candidate-btn {
    width: 100%;
    padding: 12px;
    background: transparent;
    border: 2px solid #00d4ff;
    color: #00d4ff;
    font-weight: 600;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
  }

  .add-candidate-btn:hover {
    background: rgba(0, 212, 255, 0.1);
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
  }

  .modal-content {
    background: rgba(26, 26, 46, 0.95);
    border: 2px solid #00d4ff;
    border-radius: 10px;
    padding: 30px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 0 40px rgba(0, 212, 255, 0.3);
    animation: modalSlideIn 0.3s ease;
  }

  @keyframes modalSlideIn {
    from {
      transform: translateY(-50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .modal-content h2 {
    color: #00d4ff;
    text-align: center;
    margin-bottom: 10px;
    font-size: 20px;
  }

  .modal-content p {
    color: #b0b0b0;
    text-align: center;
    margin-bottom: 25px;
    font-size: 13px;
  }

  .role-buttons {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
  }

  .role-btn {
    flex: 1;
    padding: 12px;
    border: 2px solid;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.3s ease;
    background: transparent;
  }

  .admin-role {
    border-color: #0066CC;
    color: #0066CC;
  }

  .admin-role:hover {
    background: rgba(0, 102, 204, 0.1);
    box-shadow: 0 0 15px rgba(0, 102, 204, 0.3);
  }

  .student-role {
    border-color: #4caf50;
    color: #4caf50;
  }

  .student-role:hover {
    background: rgba(76, 175, 80, 0.1);
    box-shadow: 0 0 15px rgba(76, 175, 80, 0.3);
  }

  .close-modal-btn {
    width: 100%;
    padding: 10px;
    background: transparent;
    border: 1px solid #b0b0b0;
    color: #b0b0b0;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
    transition: all 0.3s ease;
  }

  .close-modal-btn:hover {
    border-color: #00d4ff;
    color: #00d4ff;
  }

  /* Admin Container */
  .admin-container {
    min-height: 100vh;
    padding: 20px;
  }

  .admin-navbar {
    background: #1a1a2e;
    border-bottom: 2px solid #00d4ff;
    padding: 20px 40px;
    margin-bottom: 30px;
    box-shadow: 0 4px 15px rgba(0, 212, 255, 0.2);
  }

  .nav-content {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .admin-title {
    color: #00d4ff;
    font-size: 24px;
    text-shadow: 0 0 10px rgba(0, 212, 255, 0.4);
  }

  .logout-btn {
    background: transparent;
    border: 2px solid #f44336;
    color: #f44336;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .logout-btn:hover {
    background: rgba(244, 67, 54, 0.1);
    box-shadow: 0 0 15px rgba(244, 67, 54, 0.3);
  }

  .admin-content {
    max-width: 1400px;
    margin: 0 auto;
    background: rgba(0, 212, 255, 0.03);
    border: 1px solid rgba(0, 212, 255, 0.1);
    border-radius: 10px;
    padding: 30px;
  }

  .tabs-container {
    display: flex;
    gap: 15px;
    margin-bottom: 30px;
    border-bottom: 2px solid rgba(0, 212, 255, 0.2);
    flex-wrap: wrap;
  }

  .tab-btn {
    background: transparent;
    border: none;
    color: #b0b0b0;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border-bottom: 3px solid transparent;
    margin-bottom: -2px;
  }

  .tab-btn:hover {
    color: #00d4ff;
  }

  .tab-btn.active {
    color: #00d4ff;
    border-bottom-color: #00d4ff;
  }

  .tab-content {
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .tab-content h2 {
    color: #00d4ff;
    margin-bottom: 25px;
    font-size: 20px;
  }

  .student-form {
    max-width: 500px;
  }

  .submit-btn {
    width: 100%;
    padding: 12px;
    background: transparent;
    border: 2px solid #0066CC;
    color: #0066CC;
    font-weight: 600;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
  }

  .submit-btn:hover {
    background: rgba(0, 102, 204, 0.1);
    box-shadow: 0 0 15px rgba(0, 102, 204, 0.3);
  }

  .empty-message {
    text-align: center;
    color: #b0b0b0;
    padding: 40px 20px;
    font-style: italic;
  }

  .students-table {
    overflow-x: auto;
    margin-top: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  table thead {
    background: rgba(0, 212, 255, 0.1);
  }

  table th {
    color: #00d4ff;
    padding: 15px;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid #00d4ff;
  }

  table td {
    padding: 12px 15px;
    border-bottom: 1px solid rgba(0, 212, 255, 0.1);
    color: #e0e0e0;
  }

  table tbody tr:hover {
    background: rgba(0, 212, 255, 0.05);
  }

  .attendance-percentage {
    color: #00d4ff;
    font-weight: 600;
  }

  .delete-btn {
    background: transparent;
    border: 1px solid #f44336;
    color: #f44336;
    padding: 6px 12px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .delete-btn:hover {
    background: rgba(244, 67, 54, 0.1);
    box-shadow: 0 0 10px rgba(244, 67, 54, 0.2);
  }

  .attendance-controls {
    margin-bottom: 30px;
  }

  .date-picker {
    display: flex;
    gap: 15px;
    align-items: center;
  }

  .date-picker label {
    color: #00d4ff;
    font-weight: 600;
  }

  .date-picker input {
    background: rgba(26, 26, 46, 0.6);
    border: 2px solid #00d4ff;
    color: #e0e0e0;
    padding: 10px;
    border-radius: 5px;
    font-size: 14px;
  }

  .date-picker input:focus {
    outline: none;
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
  }

  .attendance-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }

  .attendance-card {
    background: rgba(0, 212, 255, 0.05);
    border: 2px solid #00d4ff;
    border-radius: 8px;
    padding: 20px;
    transition: all 0.3s ease;
  }

  .attendance-card:hover {
    box-shadow: 0 8px 20px rgba(0, 212, 255, 0.2);
    transform: translateY(-3px);
  }

  .student-info h3 {
    color: #00d4ff;
    margin-bottom: 5px;
  }

  .student-info p {
    color: #b0b0b0;
    font-size: 12px;
  }

  .attendance-buttons {
    display: flex;
    gap: 10px;
    margin: 15px 0;
    flex-wrap: wrap;
  }

  .present-btn,
  .absent-btn,
  .leave-btn {
    flex: 1;
    min-width: 60px;
    padding: 10px;
    border: 2px solid;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    font-size: 12px;
    transition: all 0.3s ease;
    background: transparent;
  }

  .present-btn {
    border-color: #4caf50;
    color: #4caf50;
  }

  .present-btn:hover {
    background: rgba(76, 175, 80, 0.1);
  }

  .present-btn.active {
    background: rgba(76, 175, 80, 0.2);
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.3);
  }

  .absent-btn {
    border-color: #f44336;
    color: #f44336;
  }

  .absent-btn:hover {
    background: rgba(244, 67, 54, 0.1);
  }

  .absent-btn.active {
    background: rgba(244, 67, 54, 0.2);
    box-shadow: 0 0 10px rgba(244, 67, 54, 0.3);
  }

  .leave-btn {
    border-color: #ff9800;
    color: #ff9800;
  }

  .leave-btn:hover {
    background: rgba(255, 152, 0, 0.1);
  }

  .leave-btn.active {
    background: rgba(255, 152, 0, 0.2);
    box-shadow: 0 0 10px rgba(255, 152, 0, 0.3);
  }

  .status-display {
    text-align: center;
    color: #b0b0b0;
    font-size: 12px;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(0, 212, 255, 0.1);
  }

  .status {
    color: #00d4ff;
    font-weight: 600;
  }

  .status.present {
    color: #4caf50;
  }

  .status.absent {
    color: #f44336;
  }

  .status.leave {
    color: #ff9800;
  }

  .status.not-marked {
    color: #b0b0b0;
  }

  @media (max-width: 768px) {
    .admin-navbar {
      padding: 15px 20px;
    }

    .nav-content {
      flex-direction: column;
      gap: 15px;
      align-items: flex-start;
    }

    .admin-content {
      padding: 20px;
    }

    .tabs-container {
      gap: 10px;
    }

    .tab-btn {
      padding: 10px 15px;
      font-size: 12px;
    }

    .attendance-grid {
      grid-template-columns: 1fr;
    }

    .login-box {
      padding: 25px;
      margin: 20px;
    }
  }
`;

export default Admin;
