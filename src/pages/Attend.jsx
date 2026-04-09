import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../attend.css';

const Attend = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rollNumber, setRollNumber] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [isStaff, setIsStaff] = useState(false);
  const [currentStaffSubject, setCurrentStaffSubject] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [attendance, setAttendance] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const studentRolls = [
    '23221A0575','23221A0576','23221A0577',
    '23221A0578','23221A0579','23221A0580'
  ];

  const staffMembers = {
    '12341': 'Python',
    '12342': 'DSA',
    '12343': 'Aptitude',
    '12345': 'Java',
    '12346': 'Cloud Computing'
  };

  const subjects = ['Python','DSA','Aptitude','Java','Cloud Computing'];

  useEffect(() => {
    const saved = localStorage.getItem('subjectAttendance');
    if (saved) setAttendance(JSON.parse(saved));
    else {
      const init = {};
      studentRolls.forEach(r => {
        init[r] = {};
        subjects.forEach(s => init[r][s] = null);
      });
      setAttendance(init);
    }
  }, []);

  useEffect(() => {
    if (isStaff && currentStaffSubject) {
      setAttendance(prev => {
        const updated = { ...prev };
        studentRolls.forEach(r => {
          if (!updated[r]) updated[r] = {};
          if (!(currentStaffSubject in updated[r])) {
            updated[r][currentStaffSubject] = null;
          }
        });
        return updated;
      });
    }
  }, [isStaff, currentStaffSubject]);

  const handleRollNumberSubmit = () => {
    if (!rollNumber.trim()) return alert('Enter roll');

    if (staffMembers[rollNumber]) {
      setIsStaff(true);
      setCurrentStaffSubject(staffMembers[rollNumber]);
      setIsEditing(true);
      setShowModal(false);
    } else if (studentRolls.includes(rollNumber)) {
      setShowModal(false);
    } else {
      alert('Invalid');
      setRollNumber('');
    }
  };

  const handleAttendanceChange = (roll, subject, status) => {
    if (!isEditing) return;
    setAttendance(prev => ({
      ...prev,
      [roll]: {
        ...prev[roll],
        [subject]:
          prev[roll][subject] === status ? null : status
      }
    }));
  };

  const handleSubmit = () => {
    const allMarked = studentRolls.every(
      r => attendance[r][currentStaffSubject] !== null
    );
    if (!allMarked) return alert('Mark all');

    localStorage.setItem('subjectAttendance', JSON.stringify(attendance));
    setSubmitted(true);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSubmitted(false);
  };

  if (showModal) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-back-btn" onClick={()=>navigate('/home')}>← Back</button>
          <h2>Enter Roll Number</h2>
          <input
            value={rollNumber}
            onChange={e=>setRollNumber(e.target.value)}
          />
          <div className="modal-buttons">
            <button onClick={handleRollNumberSubmit}>Submit</button>
          </div>
        </div>
      </div>
    );
  }

  if (isStaff) {
    return (
      <>
        <button className="page-back-btn" onClick={()=>navigate('/home')}>← Back</button>

        <div className="attendance-container">
          <div className="header">
            <h2>{currentStaffSubject}</h2>
            <div className="button-group">
              {submitted && !isEditing && (
                <button className="edit-btn" onClick={handleEdit}>Edit</button>
              )}
              {isEditing && (
                <button className="submit-btn" onClick={handleSubmit}>Submit</button>
              )}
            </div>
          </div>

          <div className="attendance-grid">
            {studentRolls.map(r=>(
              <div key={r} className="attendance-card">
                <h4>{r}</h4>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input type="checkbox"
                      checked={attendance[r][currentStaffSubject]==='present'}
                      onChange={()=>handleAttendanceChange(r,currentStaffSubject,'present')}
                    />
                    Present
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox"
                      checked={attendance[r][currentStaffSubject]==='absent'}
                      onChange={()=>handleAttendanceChange(r,currentStaffSubject,'absent')}
                    />
                    Absent
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <button className="page-back-btn" onClick={()=>navigate('/home')}>← Back</button>

      <div className="attendance-container">
        <h2>Your Attendance</h2>
        <div className="student-attendance">
          <h3>{rollNumber}</h3>

          <div className="subjects-grid">
            {subjects.map(s=>(
              <div key={s} className="subject-card">
                <h4>{s}</h4>
                <div className="attendance-status">
                  {attendance[rollNumber][s]===null
                    ? <p className="status-pending">Pending</p>
                    : <p className={`status-${attendance[rollNumber][s]}`}>
                        {attendance[rollNumber][s]}
                      </p>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Attend;