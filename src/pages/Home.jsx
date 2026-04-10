import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styled from "styled-components";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("student");
  
  // Student form state
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentError, setStudentError] = useState("");
  
  // Admin form state
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  useEffect(() => {
    // Check if current user is admin
    const currentAdmin = localStorage.getItem("currentAdmin");
    if (currentAdmin) {
      setIsAdmin(true);
    }
  }, []);

  const handleSignOut = () => {
    // Check if user is admin
    const currentAdmin = localStorage.getItem("currentAdmin");
    if (currentAdmin) {
      localStorage.removeItem("currentAdmin");
      navigate("/signin");
      return;
    }

    // Check if user is direct login student
    const currentStudent = localStorage.getItem("currentStudent");
    if (currentStudent) {
      localStorage.removeItem("currentStudent");
      navigate("/signin");
    } else {
      // Firebase logout - don't await, let it happen in background
      signOut(auth).catch(err => console.error("Sign out error:", err));
      navigate("/signin");
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    setStudentError("");

    if (!studentEmail || !studentPassword) {
      setStudentError("Please fill all fields");
      return;
    }

    try {
      let studentList = [];
      const existingStudents = localStorage.getItem("students");
      
      if (existingStudents) {
        try {
          studentList = JSON.parse(existingStudents);
        } catch (err) {
          console.error("Error parsing students:", err);
          studentList = [];
        }
      }

      if (studentList.some(s => s.email === studentEmail)) {
        setStudentError("Student with this email already exists");
        return;
      }

      const newStudent = {
        id: `STU-${Date.now()}`,
        name: studentEmail.split("@")[0],
        email: studentEmail,
        password: studentPassword,
        createdDate: new Date().toISOString().split("T")[0],
        directLogin: true
      };

      studentList.push(newStudent);
      localStorage.setItem("students", JSON.stringify(studentList));
      alert("Student account created! Email: " + studentEmail);

      setStudentEmail("");
      setStudentPassword("");
      
    } catch (error) {
      console.error("Error adding student:", error);
      setStudentError("An error occurred. Please try again.");
    }
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    setAdminError("");

    if (!adminEmail || !adminPassword) {
      setAdminError("Please fill all fields");
      return;
    }

    try {
      let adminList = [];
      const existingAdmins = localStorage.getItem("adminCredentials");
      
      if (existingAdmins) {
        try {
          adminList = JSON.parse(existingAdmins);
        } catch (err) {
          console.error("Error parsing admins:", err);
          adminList = [{ email: "vamsi@gmail.com", password: "admin@1234" }];
        }
      } else {
        adminList = [{ email: "vamsi@gmail.com", password: "admin@1234" }];
      }

      if (adminList.some(a => a.email === adminEmail)) {
        setAdminError("Admin with this email already exists");
        return;
      }

      adminList.push({ email: adminEmail, password: adminPassword });
      localStorage.setItem("adminCredentials", JSON.stringify(adminList));
      alert("Admin account created! Email: " + adminEmail);

      setAdminEmail("");
      setAdminPassword("");
      
    } catch (error) {
      console.error("Error adding admin:", error);
      setAdminError("An error occurred. Please try again.");
    }
  };

  return (
    <StyledWrapper>
      <nav className="navbar">
        <div className="nav-brand">
          <span className="brand-name">CampusConnect</span>
        </div>
        
        <button 
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><a onClick={() => handleNavClick("/time")}>Time Table</a></li>
          <li><a onClick={() => handleNavClick("/not")}>Notifications</a></li>
          <li><a onClick={() => handleNavClick("/staff")}>Staff Info</a></li>
          <li><a onClick={() => handleNavClick("/attend")}>Attendance</a></li>
          <li><a onClick={() => handleNavClick("/raise")}>Complaints</a></li>
          {isAdmin && <li><a onClick={() => { setShowAddCandidateModal(true); setMenuOpen(false); }}>Add Candidate</a></li>}
          <li className="signout-link"><a onClick={() => { handleSignOut(); setMenuOpen(false); }}>Sign Out</a></li>
        </ul>
        
        <div className="navbar-signout-section">
          <div className="navbar-email">{user?.email}</div>
          <button className="signout-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </nav>

      <div className="home-container">
        <div className="background-image" />

        <div className="overlay" />

        <div className="home-box">
          <h2 className="welcome-text">Welcome</h2>
          <h3 className="welcome-subtitle">to</h3>
          <h1 className="h1">CampusConnect</h1>
        </div>
      </div>

      {showAddCandidateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal-btn" onClick={() => setShowAddCandidateModal(false)}>✕</button>
            
            <h2 className="modal-title">Add Candidate</h2>
            
            <div className="modal-tabs">
              <button
                className={`tab-btn ${activeTab === "student" ? "active" : ""}`}
                onClick={() => { setActiveTab("student"); setStudentError(""); setAdminError(""); }}
              >
                Add Student
              </button>
              <button
                className={`tab-btn ${activeTab === "admin" ? "active" : ""}`}
                onClick={() => { setActiveTab("admin"); setStudentError(""); setAdminError(""); }}
              >
                Add Admin
              </button>
            </div>

            {activeTab === "student" ? (
              <form onSubmit={handleAddStudent} className="candidate-form">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="Enter student email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </div>

                {studentError && <div className="error-message">{studentError}</div>}

                <div className="role-description">
                  <p>✓ Student can login directly without registration and access all student features</p>
                </div>

                <button type="submit" className="submit-btn">
                  Create Student Account
                </button>
              </form>
            ) : (
              <form onSubmit={handleAddAdmin} className="candidate-form">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="Enter admin email"
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

                {adminError && <div className="error-message">{adminError}</div>}

                <div className="role-description">
                  <p>✓ Admin can login directly and manage students & attendance</p>
                </div>

                <button type="submit" className="submit-btn">
                  Create Admin Account
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 70px;
    background: #1a1a2e;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    box-shadow: 0 4px 15px rgba(0, 212, 255, 0.2);
    z-index: 100;
    border-bottom: 2px solid #00d4ff;
  }
    .h1{
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size:100px;
    background-clip: text;
    color: transparent;
    background-image: url("https://tse3.mm.bing.net/th/id/OIP.6LiqLctzk9Lf9VmBR00fngHaEz?pid=Api&P=0&h=180");
    animation: animate 20s linear infinite;
    }
    @keyframes animate {
     to{
        background-position-x: 500px;}
    }

  .nav-brand {
    display: flex;
    align-items: center;
    min-width: 200px;
    gap: 15px;
  }

  .brand-name {
    color: #00d4ff;
    font-size: clamp(18px, 3vw, 24px);
    margin: 0;
    font-weight: 700;
    letter-spacing: 1px;
    text-shadow: 0 0 10px rgba(0, 212, 255, 0.4);
  }

  .navbar-username {
    color: #e0e0e0;
    font-size: clamp(12px, 2vw, 14px);
    font-weight: 500;
    text-transform: capitalize;
  }

  .navbar-signout-section {
    display: flex;
    align-items: center;
    gap: 15px;
    min-width: auto;
  }

  .navbar-email {
    color: #e0e0e0;
    font-size: clamp(11px, 1.8vw, 13px);
    font-weight: 500;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .nav-links {
    display: flex;
    list-style: none;
    gap: clamp(20px, 4vw, 40px);
    margin: 0;
    padding: 0;
    flex: 1;
    justify-content: center;
  }

  .nav-links li a {
    color: #e0e0e0;
    text-decoration: none;
    font-size: clamp(13px, 2.5vw, 16px);
    font-weight: 600;
    padding: 8px 16px;
    transition: all 0.3s ease;
    cursor: pointer;
    display: block;
  }

  .nav-links li a:hover {
    color: #00d4ff;
    transform: translateY(-2px);
  }

  .nav-links li a:active {
    transform: translateY(0);
  }

  .signout-link {
    display: none;
  }

  .home-container {
    position: relative;
    height: calc(100vh - 70px);
    width: 100%;
    overflow: hidden;
    margin-top: 70px;
    background: #1a1a2e;
  }

  .video-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(26, 26, 46, 0.4);
  }

  .home-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    display: flex;
    flex-direction: column;
    text-align: center;
    max-width: 90%;
    border: 3px solid #00d4ff;
    border-radius: 20px;
    padding: 50px 60px;
    background: rgba(26, 26, 46, 0.3);
    box-shadow: 0 0 40px rgba(0, 212, 255, 0.4), 
                inset 0 0 30px rgba(0, 212, 255, 0.1),
                0 10px 30px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
  }

  

  .welcome-text {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: clamp(50px, 10vw, 80px);
    font-weight: 700;
    background-clip: text;
    color: transparent;
    background-image: url("https://tse3.mm.bing.net/th/id/OIP.6LiqLctzk9Lf9VmBR00fngHaEz?pid=Api&P=0&h=180");
    animation: animate 20s linear infinite;
    margin: 20px 0 0 0;
  }

  .welcome-subtitle {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: clamp(36px, 7vw, 56px);
    font-weight: 700;
    background-clip: text;
    color: transparent;
    background-image: url("https://tse3.mm.bing.net/th/id/OIP.6LiqLctzk9Lf9VmBR00fngHaEz?pid=Api&P=0&h=180");
    animation: animate 20s linear infinite;
    margin: 10px 0 0 0;
  }

  .user-email {
    display: none;
  }

  .signout-btn {
    width: clamp(120px, 20vw, 140px);
    height: clamp(40px, 6vw, 45px);
    font-size: clamp(12px, 2.5vw, 14px);
    font-weight: 600;
    border-radius: 5px;
    border: 2px solid #f44336;
    cursor: pointer;
    color: #f44336;
    background: transparent;
    transition: all 0.3s ease;
    padding: 0 16px;
    white-space: nowrap;
  }

  .hamburger {
    display: none;
    flex-direction: column;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    gap: 6px;
  }

  .hamburger span {
    width: 25px;
    height: 3px;
    background: #00d4ff;
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  .hamburger.active span:nth-child(1) {
    transform: rotate(45deg) translate(10px, 10px);
  }

  .hamburger.active span:nth-child(2) {
    opacity: 0;
  }

  .hamburger.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
  }

  .signout-btn:hover {
    background: rgba(244, 67, 54, 0.1);
    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
    transform: translateY(-2px);
  }

  .signout-btn:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    .navbar {
      padding: 0 20px;
      height: 60px;
    }

    .hamburger {
      display: flex;
      order: 2;
    }

    .nav-links {
      position: absolute;
      top: 60px;
      left: 0;
      right: 0;
      background: #1a1a2e;
      flex-direction: column;
      gap: 0;
      width: 100%;
      padding: 0;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 212, 255, 0.2);
      border-bottom: 1px solid #00d4ff;
    }

    .nav-links.active {
      max-height: 500px;
      padding: 15px 0;
    }

    .nav-links li {
      width: 100%;
      text-align: center;
    }

    .nav-links li a {
      display: block;
      padding: 15px 20px;
      border-bottom: 1px solid rgba(0, 212, 255, 0.1);
      gap: 0;
      background: none;
      border-radius: 0;
      color: #e0e0e0;
    }

    .nav-links li a:hover {
      color: #00d4ff;
    }

    .signout-link {
      display: list-item;
    }

    .signout-link a {
      background: transparent !important;
      color: #f44336 !important;
      border: 2px solid #f44336 !important;
      margin: 10px 20px;
      border-radius: 5px;
      border-bottom: none !important;
      padding: 12px 20px !important;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .signout-link a:hover {
      background: rgba(244, 67, 54, 0.1) !important;
      box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3) !important;
    }

    .nav-brand {
      min-width: auto;
      order: 1;
      flex: 1;
      gap: 10px;
    }

    .brand-name {
      font-size: 16px;
    }

    .navbar-username {
      display: none;
    }

    .navbar-signout-section {
      display: none;
    }

    .signout-btn {
      display: none;
    }
  }

  /* Modal Styles */
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
    max-width: 450px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
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

  .close-modal-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: transparent;
    border: none;
    color: #00d4ff;
    font-size: 24px;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 5px 10px;
  }

  .close-modal-btn:hover {
    transform: scale(1.2);
  }

  .modal-title {
    color: #00d4ff;
    text-align: center;
    margin-bottom: 25px;
    font-size: 22px;
    text-shadow: 0 0 10px rgba(0, 212, 255, 0.4);
  }

  .modal-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 25px;
    border-bottom: 2px solid rgba(0, 212, 255, 0.2);
  }

  .tab-btn {
    flex: 1;
    padding: 12px 20px;
    background: transparent;
    border: none;
    color: #b0b0b0;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border-bottom: 3px solid transparent;
    margin-bottom: -2px;
    font-size: 14px;
  }

  .tab-btn:hover {
    color: #00d4ff;
  }

  .tab-btn.active {
    color: #00d4ff;
    border-bottom-color: #00d4ff;
  }

  .candidate-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-group label {
    color: #00d4ff;
    font-weight: 600;
    font-size: 14px;
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
    text-align: center;
    font-size: 13px;
  }

  .role-description {
    background: rgba(0, 212, 255, 0.1);
    border: 1px solid rgba(0, 212, 255, 0.3);
    padding: 12px;
    border-radius: 5px;
    color: #b0b0b0;
    font-size: 13px;
    text-align: center;
  }

  .submit-btn {
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

  @media (max-width: 480px) {
    .modal-content {
      max-width: 95%;
      padding: 20px;
    }

    .modal-title {
      font-size: 18px;
      margin-bottom: 20px;
    }

    .tab-btn {
      font-size: 12px;
      padding: 10px 15px;
    }
  }

  @media (max-width: 768px) {
    .navbar {
      height: 60px;
      padding: 0 15px;
    }

    .nav-links {
      top: 60px;
    }

    .nav-links.active {
      max-height: 450px;
    }

    .nav-links li a {
      font-size: 14px;
      padding: 12px 15px;
    }

    .signout-link {
      display: list-item;
    }

    .signout-link a {
      font-size: 14px !important;
      padding: 12px 15px !important;
    }

    .brand-name {
      font-size: 16px;
    }

    .signout-btn {
      display: none;
    }

    .home-container {
      margin-top: 60px;
      height: calc(100vh - 60px);
    }

    .home-box {
      top: 45%;
    }

    .h1 {
      font-size: 40px;
    }

    .user-email {
      font-size: 14px;
    }
  }
`;

export default Home;