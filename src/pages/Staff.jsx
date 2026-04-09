import React from "react";
import { useNavigate } from "react-router-dom";
import "../staff.css";

const Staff = () => {
  const navigate = useNavigate();

  const staffMembers = [
    {
      id: "12341",
      name: "Dr. Ramesh Kumar",
      subject: "Python",
      department: "CSE",
      email: "ramesh.kumar@college.edu",
      phone: "+91-9876543210",
      office: "Room 201",
      image: "https://tse2.mm.bing.net/th/id/OIP.tFdmYmoeN9Obyl3lBsLHDAHaHa?pid=Api&P=0&h=180",
    },
    {
      id: "12342",
      name: "Prof. Anitha Singh",
      subject: "DSA",
      department: "CSE",
      email: "anitha.singh@college.edu",
      phone: "+91-9876543211",
      office: "Room 202",
      image: "https://img.freepik.com/premium-psd/3d-female-teacher-cartoon-character_1056310-7827.jpg?w=2000",
    },
    {
      id: "12343",
      name: "Mrs. Priya Sharma",
      subject: "Aptitude",
      department: "CSE",
      email: "priya.sharma@college.edu",
      phone: "+91-9876543212",
      office: "Room 203",
      image: "https://tse1.mm.bing.net/th/id/OIP.8CAvWKlU0G3PyXvMD2BIyQHaHa?pid=Api&P=0&h=180",
    },
    {
      id: "12345",
      name: "Mr. Vikram Patel",
      subject: "Java",
      department: "CSE",
      email: "vikram.patel@college.edu",
      phone: "+91-9876543213",
      office: "Room 204",
      image: "https://as1.ftcdn.net/v2/jpg/06/15/44/70/1000_F_615447011_GOGWROsPNgamAzolXBW28iKX3AAXKqMP.jpg",
    },
    {
      id: "12346",
      name: "Dr. Neha Gupta",
      subject: "Cloud Computing",
      department: "CSE",
      email: "neha.gupta@college.edu",
      phone: "+91-9876543214",
      office: "Room 205",
      image: "https://img.freepik.com/premium-photo/3d-cartoon-female-teacher-white-background_979520-21155.jpg",
    },
  ];

  return (
    <div className="staff-wrapper">
      <button className="back-btn" onClick={() => navigate("/home")}>
        ← Back to Home
      </button>

      <div className="staff-container">
        <h1 className="page-title">Faculty Information</h1>
        <p className="subtitle">
          Computer Science & Engineering Department
        </p>

        <div className="staff-grid">
          {staffMembers.map((staff) => (
            <div key={staff.id} className="staff-card">
              <div className="staff-image">
                <img src={staff.image} alt={staff.name} />
              </div>

              <div className="staff-info">
                <h3 className="staff-name">{staff.name}</h3>

                <div className="staff-details">
                  <p><strong>ID:</strong> {staff.id}</p>
                  <p><strong>Subject:</strong> {staff.subject}</p>
                  <p><strong>Department:</strong> {staff.department}</p>
                  <p><strong>Office:</strong> {staff.office}</p>

                  <p>
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${staff.email}`}>{staff.email}</a>
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    <a href={`tel:${staff.phone}`}>{staff.phone}</a>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Staff;