import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../raise.css';

const Raise = () => {
  const navigate = useNavigate();
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [showStaffLogin, setShowStaffLogin] = useState(false);
  const [showResolvePanel, setShowResolvePanel] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [complaintForm, setComplaintForm] = useState({
    title: '',
    description: '',
    branch: 'CSE'
  });
  const [staffLogin, setStaffLogin] = useState({ id: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const branches = ['CSE','ECE','MECH','CIVIL','CAD','AIML'];
  const staffIds = ['12341','12342','12343','12345','12346'];
  const correctPassword = 'BVC@123';

  useEffect(() => {
    const saved = localStorage.getItem('complaints');
    if (saved) setComplaints(JSON.parse(saved));
  }, []);

  const handleSubmitComplaint = e => {
    e.preventDefault();
    const newComplaint = {
      id: Date.now(),
      ...complaintForm,
      status: 'Pending',
      submittedDate: new Date().toLocaleString()
    };
    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    localStorage.setItem('complaints', JSON.stringify(updated));
    setShowComplaintForm(false);
    setComplaintForm({ title:'', description:'', branch:'CSE' });
    setSuccessMessage('Submitted!');
    setTimeout(()=>setSuccessMessage(''),3000);
  };

  const handleStaffLogin = e => {
    e.preventDefault();
    if (!staffIds.includes(staffLogin.id)) return setLoginError('Invalid ID');
    if (staffLogin.password !== correctPassword) return setLoginError('Wrong password');
    setShowStaffLogin(false);
    setShowResolvePanel(true);
    setLoginError('');
  };

  const updateStatus = (id, status) => {
    const updated = complaints.map(c =>
      c.id === id ? { ...c, status } : c
    );
    setComplaints(updated);
    localStorage.setItem('complaints', JSON.stringify(updated));
  };

  const getColor = s =>
    s==='Pending' ? '#FFC107' :
    s==='Resolved' ? '#4CAF50' :
    '#f44336';

  return (
    <div className="raise-page">

      <button className="back-btn" onClick={()=>navigate('/home')}>← Back</button>
      <button className="raise-btn" onClick={()=>setShowComplaintForm(true)}>+ Raise</button>
      <button className="resolve-btn" onClick={()=>setShowStaffLogin(true)}>Resolve</button>

      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="raise-container">
        <h1>Complaints</h1>

        {complaints.length ? (
          <div className="complaints-list">
            {complaints.map(c=>(
              <div key={c.id} className="complaint-card">
                <div className="complaint-header">
                  <h3>{c.title}</h3>
                  <span className="status-badge" style={{background:getColor(c.status)}}>
                    {c.status}
                  </span>
                </div>

                <p className="complaint-description">{c.description}</p>

                <div className="complaint-meta">
                  <span>{c.branch}</span>
                  <span>{c.submittedDate}</span>
                </div>

                {showResolvePanel && (
                  <div className="action-buttons">
                    <button className="resolve-action-btn" onClick={()=>updateStatus(c.id,'Resolved')}>Resolve</button>
                    <button className="reject-action-btn" onClick={()=>updateStatus(c.id,'Rejected')}>Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : <p className="no-complaints">No complaints</p>}
      </div>

      {showComplaintForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={()=>setShowComplaintForm(false)}>×</button>
            <form onSubmit={handleSubmitComplaint}>
              <input name="title" value={complaintForm.title}
                onChange={e=>setComplaintForm({...complaintForm,title:e.target.value})}
                placeholder="Title" required />
              <textarea name="description"
                value={complaintForm.description}
                onChange={e=>setComplaintForm({...complaintForm,description:e.target.value})}
                placeholder="Description" required />
              <select value={complaintForm.branch}
                onChange={e=>setComplaintForm({...complaintForm,branch:e.target.value})}>
                {branches.map(b=><option key={b}>{b}</option>)}
              </select>
              <button className="submit-btn">Submit</button>
            </form>
          </div>
        </div>
      )}

      {showStaffLogin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={()=>setShowStaffLogin(false)}>×</button>
            <form onSubmit={handleStaffLogin}>
              <input placeholder="ID"
                onChange={e=>setStaffLogin({...staffLogin,id:e.target.value})} />
              <input type="password" placeholder="Password"
                onChange={e=>setStaffLogin({...staffLogin,password:e.target.value})} />
              {loginError && <p className="error-message">{loginError}</p>}
              <button className="login-btn">Login</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Raise;