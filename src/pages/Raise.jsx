import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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

  const branches = ['CSE', 'ECE', 'MECH', 'CIVIL', 'CAD', 'AIML'];
  const staffIds = ['12341', '12342', '12343', '12345', '12346'];
  const correctPassword = 'BVC@123';

  useEffect(() => {
    const savedComplaints = localStorage.getItem('complaints');
    if (savedComplaints) {
      try {
        setComplaints(JSON.parse(savedComplaints));
      } catch (error) {
        console.error('Error loading complaints:', error);
      }
    }
  }, []);

  const handleComplaintChange = (e) => {
    const { name, value } = e.target;
    setComplaintForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitComplaint = (e) => {
    e.preventDefault();

    if (!complaintForm.title.trim() || !complaintForm.description.trim()) {
      alert('Fill all fields');
      return;
    }

    const newComplaint = {
      id: Date.now(),
      ...complaintForm,
      status: 'Pending',
      submittedDate: new Date().toLocaleString()
    };

    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    localStorage.setItem('complaints', JSON.stringify(updated));

    setComplaintForm({ title: '', description: '', branch: 'CSE' });
    setShowComplaintForm(false);

    setSuccessMessage('Complaint submitted successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleStaffLogin = (e) => {
    e.preventDefault();

    if (!staffIds.includes(staffLogin.id)) {
      setLoginError('Invalid Staff ID');
      return;
    }

    if (staffLogin.password !== correctPassword) {
      setLoginError('Invalid Password');
      return;
    }

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

  const getStatusColor = (status) => {
    if (status === 'Pending') return '#00d4ff';
    if (status === 'Resolved') return '#0066CC';
    if (status === 'Rejected') return '#f44336';
    return '#808080';
  };

  return (
    <StyledWrapper>
      <button className="back-btn" onClick={() => navigate('/home')}>
        ← Back
      </button>

      <button className="raise-btn" onClick={() => setShowComplaintForm(true)}>
        + Raise
      </button>

      <button className="resolve-btn" onClick={() => setShowStaffLogin(true)}>
        🔧 Resolve
      </button>

      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="raise-container">
        <h1>Complaints</h1>

        {complaints.length > 0 ? (
          <div className="complaints-list">
            {complaints.map(c => (
              <div key={c.id} className="complaint-card">
                <div className="complaint-header">
                  <h3>{c.title}</h3>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(c.status) }}
                  >
                    {c.status}
                  </span>
                </div>

                <p className="complaint-description">{c.description}</p>

                <div className="complaint-meta">
                  <span><strong>Branch:</strong> {c.branch}</span>
                  <span><strong>Submitted:</strong> {c.submittedDate}</span>
                </div>

                {showResolvePanel && (
                  <div className="action-buttons">
                    <button onClick={() => updateStatus(c.id, 'Resolved')}>
                      ✓ Resolve
                    </button>
                    <button onClick={() => updateStatus(c.id, 'Rejected')}>
                      ✗ Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-complaints">
            No complaints yet. Click "Raise".
          </p>
        )}
      </div>

      {/* Complaint Modal */}
      {showComplaintForm && (
        <div className="modal-overlay">
          <div className="modal-content complaint-modal">
            <button className="close-btn" onClick={() => setShowComplaintForm(false)}>×</button>
            <h2>Raise Complaint</h2>

            <form onSubmit={handleSubmitComplaint}>
              <div className="form-group">
                <label>Complaint Title</label>
                <input
                  name="title"
                  value={complaintForm.title}
                  onChange={handleComplaintChange}
                  placeholder="Title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={complaintForm.description}
                  onChange={handleComplaintChange}
                  placeholder="Description"
                  required
                />
              </div>
              <div className="form-group">
                <label>Branch</label>
                <select
                  name="branch"
                  value={complaintForm.branch}
                  onChange={handleComplaintChange}
                >
                  {branches.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>

              <button type="submit" className="submit-btn1">Submit</button>
            </form>
          </div>
        </div>
      )}

      {/* Staff Login */}
      {showStaffLogin && (
        <div className="modal-overlay">
          <div className="modal-content complaint-modal">
            <button className="close-btn" onClick={() => setShowStaffLogin(false)}>×</button>
            <h2>Staff Login</h2>

            <form onSubmit={handleStaffLogin}>
              <input
                placeholder="ID"
                onChange={(e) =>
                  setStaffLogin(prev => ({ ...prev, id: e.target.value }))
                }
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  setStaffLogin(prev => ({ ...prev, password: e.target.value }))
                }
              />

              {loginError && <p className="error-message">{loginError}</p>}

              <button type="submit" className="login-btn">Login</button>
            </form>
          </div>
        </div>
      )}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  background: #1a1a2e;
  min-height: 100vh;
  padding: 40px 20px;

  .back-btn {
    position: fixed;
    top: 20px;
    left: 20px;
    padding: clamp(8px, 2vw, 10px) clamp(15px, 3vw, 20px);
    background: #0066CC;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: clamp(11px, 2vw, 14px);
    font-weight: 600;
    cursor: pointer;
    z-index: 100;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 102, 204, 0.3);
    white-space: nowrap;

    &:hover {
      background: #0052A3;
      box-shadow: 0 4px 12px rgba(0, 102, 204, 0.5);
      transform: translateX(-3px);
    }
  }

  .raise-btn {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: clamp(10px, 2vw, 12px) clamp(15px, 3vw, 25px);
    background: #00d4ff;
    color: #1a1a2e;
    border: none;
    border-radius: 5px;
    font-size: clamp(11px, 2vw, 14px);
    font-weight: 600;
    cursor: pointer;
    z-index: 100;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 212, 255, 0.3);
    white-space: nowrap;

    &:hover {
      background: #00b8d4;
      box-shadow: 0 4px 12px rgba(0, 212, 255, 0.5);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .resolve-btn {
    position: fixed;
    bottom: clamp(20px, 3vw, 30px);
    right: clamp(20px, 3vw, 30px);
    padding: clamp(12px, 2vw, 15px) clamp(20px, 3vw, 30px);
    background: #0066CC;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: clamp(11px, 2vw, 14px);
    font-weight: 600;
    cursor: pointer;
    z-index: 100;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
    white-space: nowrap;

    &:hover {
      background: #0052A3;
      box-shadow: 0 6px 16px rgba(0, 102, 204, 0.5);
      transform: translateY(-3px);
    }

    &:active {
      transform: translateY(-1px);
    }
  }

  .success-message {
    position: fixed;
    top: 80px;
    right: 30px;
    background: #00d4ff;
    color: #1a1a2e;
    padding: 15px 25px;
    border-radius: 5px;
    font-weight: 600;
    z-index: 110;
    animation: slideIn 0.3s ease;

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  }

  .raise-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: clamp(20px, 4vw, 40px);
  }

  h1 {
    text-align: center;
    color: #00d4ff;
    font-size: clamp(24px, 7vw, 35px);
    margin-bottom: clamp(20px, 4vw, 40px);
    text-shadow: 2px 2px 4px rgba(0, 212, 255, 0.2);
  }

  .no-complaints {
    text-align: center;
    color: #00d4ff;
    font-size: clamp(13px, 3vw, 16px);
    padding: clamp(20px, 3vw, 40px);
    background: rgba(0, 212, 255, 0.1);
    border: 2px solid #00d4ff;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }

  .complaints-list {
    display: flex;
    flex-direction: column;
    gap: clamp(12px, 3vw, 20px);
  }

  .complaint-card {
    background: rgba(0, 212, 255, 0.05);
    border-radius: 10px;
    padding: clamp(15px, 3vw, 25px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    border-left: 5px solid #00d4ff;

    &:hover {
      box-shadow: 0 6px 20px rgba(0, 212, 255, 0.4);
      transform: translateY(-2px);
    }
  }

  .complaint-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: clamp(10px, 2vw, 15px);
    flex-wrap: wrap;
    gap: 10px;

    h3 {
      color: #00d4ff;
      font-size: clamp(16px, 4vw, 22px);
      margin: 0;
      flex: 1;
      min-width: 150px;
    }
  }

  .status-badge {
    display: inline-block;
    padding: clamp(5px, 1vw, 6px) clamp(10px, 2vw, 15px);
    border-radius: 20px;
    color: white;
    font-size: clamp(10px, 2vw, 12px);
    font-weight: 600;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .complaint-description {
    color: #e0e0e0;
    font-size: clamp(13px, 2.5vw, 15px);
    line-height: 1.6;
    margin: clamp(10px, 2vw, 15px) 0;
    word-break: break-word;
  }

  .complaint-meta {
    display: flex;
    gap: clamp(15px, 3vw, 30px);
    margin-top: clamp(10px, 2vw, 15px);
    padding-top: clamp(10px, 2vw, 15px);
    border-top: 1px solid rgba(0, 212, 255, 0.2);
    flex-wrap: wrap;

    span {
      color: #b0b0b0;
      font-size: clamp(11px, 2vw, 13px);

      strong {
        color: #00d4ff;
        margin-right: 5px;
      }
    }
  }

  .action-buttons {
    display: flex;
    gap: clamp(8px, 2vw, 10px);
    margin-top: clamp(10px, 2vw, 15px);
    flex-wrap: wrap;
  }

  .resolve-action-btn,
  .reject-action-btn {
    padding: clamp(8px, 2vw, 10px) clamp(15px, 3vw, 20px);
    border: none;
    border-radius: 5px;
    font-size: clamp(11px, 2vw, 13px);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;
    min-width: 100px;
  }

  .resolve-action-btn {
    background: #0066CC;
    color: white;

    &:hover {
      background: #0052A3;
      transform: translateY(-1px);
    }
  }

  .reject-action-btn {
    background: #f44336;
    color: white;

    &:hover {
      background: #da190b;
      transform: translateY(-1px);
    }
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 200;
  }

  .modal-content {
    background: #1a1a2e;
    border-radius: 10px;
    padding: clamp(20px, 4vw, 30px);
    max-width: 500px;
    width: 90%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    position: relative;
    animation: slideUp 0.3s ease;
    display: flex;
    flex-direction: column;
    min-height: 500px;
    max-height: 90vh;
    overflow-y: auto;
    border: 2px solid #00d4ff;

    @keyframes slideUp {
      from {
        transform: translateY(50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    &.complaint-modal {
      max-width: clamp(300px, 90vw, 600px);
    }

    h2 {
      color: #00d4ff;
      font-size: clamp(18px, 5vw, 24px);
      margin: 0 0 clamp(15px, 3vw, 25px) 0;
      font-weight: 700;
    }
  }

  .close-btn {
    position: absolute;
    top: clamp(10px, 2vw, 15px);
    right: clamp(10px, 2vw, 15px);
    background: none;
    border: none;
    font-size: clamp(20px, 5vw, 28px);
    color: #00d4ff;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: #00b8d4;
    }
  }

  .form-group {
    margin-bottom: clamp(12px, 3vw, 20px);

    label {
      display: block;
      color: #00d4ff;
      font-weight: 600;
      margin-bottom: clamp(5px, 1vw, 8px);
      font-size: clamp(12px, 2vw, 14px);
    }

    input,
    textarea,
    select {
      width: 100%;
      padding: clamp(10px, 2vw, 12px);
      border: 2px solid #00d4ff;
      background: rgba(0, 212, 255, 0.05);
      color: #e0e0e0;
      border-radius: 5px;
      font-size: clamp(12px, 2vw, 14px);
      font-family: inherit;
      transition: border-color 0.3s ease;
      box-sizing: border-box;

      &:focus {
        outline: none;
        border-color: #00d4ff;
        box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
      }

      &::placeholder {
        color: #808080;
      }
    }

    textarea {
      resize: vertical;
      min-height: clamp(80px, 20vw, 100px);
    }

    select {
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background-image: linear-gradient(45deg, transparent 50%, #00d4ff 50%), linear-gradient(135deg, #00d4ff 50%, transparent 50%), linear-gradient(to right, rgba(0, 212, 255, 0.05), rgba(0, 212, 255, 0.05));
      background-position: calc(100% - 18px) calc(1em + 2px), calc(100% - 13px) calc(1em + 2px), 0 0;
      background-size: 5px 5px, 5px 5px, 100% 100%;
      background-repeat: no-repeat;
      padding-right: clamp(34px, 5vw, 40px);
    }

    select option {
      background: #1a1a2e;
      color: #e0e0e0;
      font-size: clamp(12px, 1.5vw, 14px);
    }
  }

  .error-message {
    color: #f44336;
    font-size: clamp(11px, 2vw, 13px);
    margin-top: clamp(8px, 2vw, 10px);
    text-align: center;
  }

  .submit-btn1,
  .login-btn {
    width: 100%;
    padding: clamp(10px, 2vw, 12px);
    background: #0066CC;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: clamp(13px, 2.5vw, 16px);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #0052A3;
      box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
    }

    &:active {
      transform: scale(0.98);
    }
  }

  @media (max-width: 768px) {
    .raise-btn {
      top: clamp(15px, 3vw, 20px);
      right: clamp(15px, 3vw, 20px);
      padding: clamp(8px, 2vw, 10px) clamp(12px, 2vw, 15px);
      font-size: clamp(10px, 1.8vw, 12px);
    }

    .resolve-btn {
      bottom: clamp(15px, 2vw, 20px);
      right: clamp(15px, 2vw, 20px);
      padding: clamp(10px, 2vw, 12px) clamp(15px, 2vw, 20px);
      font-size: clamp(10px, 1.8vw, 12px);
    }

    .complaint-card {
      padding: clamp(12px, 2.5vw, 15px);
    }

    .complaint-header {
      flex-direction: column;
      align-items: flex-start;

      h3 {
        margin-bottom: 10px;
      }
    }

    .action-buttons {
      flex-direction: column;
    }

    .complaint-meta {
      flex-direction: column;
      gap: clamp(8px, 2vw, 10px);
    }

    .modal-content {
      width: 95%;
      max-width: 95%;
      padding: clamp(15px, 3vw, 20px);
    }

    h1 {
      font-size: clamp(22px, 5vw, 28px);
      margin-bottom: clamp(15px, 3vw, 25px);
    }

    .raise-container {
      padding: clamp(10px, 2vw, 20px);
    }
  }

  @media (max-width: 480px) {
    .raise-btn,
    .resolve-btn,
    .back-btn {
      position: fixed;
      z-index: 100;
    }

    .raise-btn {
      top: 20px;
      right: 15px;
      padding: 8px 12px;
      font-size: 10px;
    }

    .resolve-btn {
      bottom: 15px;
      right: 15px;
      padding: 10px 15px;
      font-size: 10px;
    }

    .back-btn {
      top: 20px;
      left: 15px;
      padding: 8px 12px;
      font-size: 10px;
    }

    .complaint-card {
      padding: 12px;
      margin: 0 -20px;
    }

    .action-buttons {
      gap: 8px;
    }

    .resolve-action-btn,
    .reject-action-btn {
      padding: 8px 12px;
      font-size: 11px;
      min-width: auto;
    }

    .complaint-header h3 {
      font-size: clamp(14px, 4vw, 18px);
    }

    .modal-content {
      width: 95%;
      max-width: 95%;
      max-height: 85vh;
      padding: 15px;
    }

    .form-group {
      margin-bottom: 12px;
    }

    input,
    textarea,
    select {
      font-size: 16px;
    }

    .raise-container {
      padding: 10px;
      margin-top: 60px;
    }

    h1 {
      font-size: 20px;
      margin-bottom: 15px;
    }
  }
`;

export default Raise;