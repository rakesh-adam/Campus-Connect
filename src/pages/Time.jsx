import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../time.css";

const Time = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState("Monday");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const subjects = ["DSA", "DBMS", "OS", "CN", "SE"];
  
  const classInfo = {
    "DSA": { room: "Lab A1", teacher: "Dr. Smith", duration: "90 min" },
    "DBMS": { room: "Lab B2", teacher: "Prof. Johnson", duration: "90 min" },
    "OS": { room: "Lab C3", teacher: "Dr. Wilson", duration: "90 min" },
    "CN": { room: "Lab D4", teacher: "Prof. Brown", duration: "90 min" },
    "SE": { room: "Lab E5", teacher: "Dr. Taylor", duration: "90 min" },
    "Python Lab": { room: "Lab F1", teacher: "Prof. Anderson", duration: "120 min" },
    "Soft Skills Lab": { room: "Seminar Hall", teacher: "Ms. Davis", duration: "60 min" },
    "Aptitude": { room: "Computer Lab", teacher: "Prof. Miller", duration: "90 min" }
  };

  let timetable = {};

  days.forEach((day) => {
    timetable[day] = new Array(5).fill("");
  });

  timetable["Monday"][0] = "Python Lab";
  timetable["Monday"][1] = "Python Lab";

  timetable["Saturday"][3] = "Soft Skills Lab";
  timetable["Saturday"][4] = "Soft Skills Lab";

  const aptitudeDays = ["Wednesday", "Friday"];

  aptitudeDays.forEach((day) => {
    timetable[day][3] = "Aptitude";
    timetable[day][4] = "Aptitude";
  });

  let subIndex = 0;

  days.forEach((day) => {
    for (let i = 0; i < 5; i++) {
      if (timetable[day][i] === "") {
        timetable[day][i] = subjects[subIndex % subjects.length];
        subIndex++;
      }
    }
  });

  const todayClasses = timetable[selectedDay].filter(s => s !== "").map((subject, idx) => ({
    subject,
    period: idx + 1,
    time: `${9 + idx}:00 - ${10 + idx}:00`,
    ...classInfo[subject]
  }));

  return (
    <div className="time-wrapper">
      <button className="back-btn" onClick={() => navigate('/home')}>
        ← Back to Home
      </button>

      <div className="split-container">
        {/* LEFT SIDE - TIMETABLE */}
        <div className="left-panel">
          <div className="timetable-container">
            <h2 className="title">📅 Weekly Timetable</h2>

            <div className="table-responsive">
              <table className="timetable">
                <thead>
                  <tr>
                    <th>Day / Period</th>
                    {[1, 2, 3, 4, 5].map((p) => (
                      <th key={p}>Period {p}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {days.map((day) => (
                    <tr key={day} 
                        className={selectedDay === day ? "active-day" : ""}
                        onClick={() => setSelectedDay(day)}>
                      <td className="day-cell">{day}</td>
                      {timetable[day].map((subject, index) => (
                        <td key={index}>{subject}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - CLASS DETAILS */}
        <div className="right-panel">
          <div className="details-container">
            <h2 className="details-title">📚 {selectedDay} Schedule</h2>
            
            <div className="classes-list">
              {todayClasses.length > 0 ? (
                todayClasses.map((classItem, idx) => (
                  <div key={idx} className="class-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="class-header">
                      <span className="period-badge">Period {classItem.period}</span>
                      <span className="class-name">{classItem.subject}</span>
                    </div>
                    <div className="class-time">🕐 {classItem.time}</div>
                    <div className="class-detail">
                      <span className="detail-label">📍 Room:</span>
                      <span className="detail-value">{classItem.room}</span>
                    </div>
                    <div className="class-detail">
                      <span className="detail-label">👨‍🏫 Teacher:</span>
                      <span className="detail-value">{classItem.teacher}</span>
                    </div>
                    <div className="class-detail">
                      <span className="detail-label">⏱️ Duration:</span>
                      <span className="detail-value">{classItem.duration}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-classes">
                  <p>No classes scheduled for {selectedDay}</p>
                </div>
              )}
            </div>

            {/* SUMMARY SECTION */}
            <div className="summary-box">
              <h3 className="summary-title">📊 Day Summary</h3>
              <div className="summary-stats">
                <div className="stat">
                  <span className="stat-label">Total Classes</span>
                  <span className="stat-value">{todayClasses.length}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Total Duration</span>
                  <span className="stat-value">{todayClasses.length * 90} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Time;