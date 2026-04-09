import React from "react";
import { useNavigate } from "react-router-dom";
import "../time.css";

const Time = () => {
  const navigate = useNavigate();

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const subjects = ["DSA", "DBMS", "OS", "CN", "SE"];

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

  return (
    <div className="time-wrapper">
      <button className="back-btn" onClick={() => navigate('/home')}>
        ← Back to Home
      </button>

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
                <tr key={day}>
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
  );
};

export default Time;