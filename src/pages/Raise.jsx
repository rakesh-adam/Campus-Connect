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

  // Load complaints from localStorage
  useEffect(() => {
    const savedComplaints = localStorage.getItem('complaints');
    if (savedComplaints) {
      try {
        const comps = JSON.parse(savedComplaints);
        setComplaints(comps);
      } catch (error) {
        console.error('Error loading complaints:', error);
      }
    }
  }, []);

  const handleComplaintChange = (e) => {
    const { name, value } = e.target;
    setComplaintForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitComplaint = (e) => {
    e.preventDefault();

    if (!complaintForm.title.trim()) {
      alert('Please enter a complaint title');
      return;
    }

    if (!complaintForm.description.trim()) {
      alert('Please enter a complaint description');
      return;
    }

    const newComplaint = {
      id: Date.now(),
      title: complaintForm.title,
      description: complaintForm.description,
      branch: complaintForm.branch,
      status: 'Pending',
      submittedDate: new Date().toLocaleString()
    };

    const updatedComplaints = [newComplaint, ...complaints];
    setComplaints(updatedComplaints);
    localStorage.setItem('complaints', JSON.stringify(updatedComplaints));

    setComplaintForm({ title: '', description: '', branch: 'CSE' });
    setShowComplaintForm(false);
    
    setSuccessMessage('Complaint submitted successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleStaffLogin = (e) => {
    e.preventDefault();
    const { id, password } = staffLogin;

    if (!staffIds.includes(id)) {
      setLoginError('Invalid Staff ID');
      return;
    }

    if (password !== correctPassword) {
      setLoginError('Invalid Password');
      return;
    }

    setShowStaffLogin(false);
    setShowResolvePanel(true);
    setLoginError('');
  };

  const handleResolveComplaint = (complaintId) => {
    const updatedComplaints = complaints.map(c =>
      c.id === complaintId ? { ...c, status: 'Resolved' } : c
    );
    setComplaints(updatedComplaints);
    localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
  };

  const handleRejectComplaint = (complaintId) => {
    const updatedComplaints = complaints.map(c =>
      c.id === complaintId ? { ...c, status: 'Rejected' } : c
    );
    setComplaints(updatedComplaints);
    localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#FFC107';
      case 'Resolved':
        return '#4CAF50';
      case 'Rejected':
        return '#f44336';
      default:
        return '#999';
    }
  };

  return (
    <StyledWrapper>
      <button className="back-btn" onClick={() => navigate('/home')}>
        ← Back to Home
      </button>

      <button className="raise-btn" onClick={() => setShowComplaintForm(true)}>
        + Raise a Complaint
      </button>

      <button className="resolve-btn" onClick={() => setShowStaffLogin(true)}>
        🔧 Resolve It
      </button>

      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="raise-container">
        <h1>Complaints</h1>

        {complaints.length > 0 ? (
          <div className="complaints-list">
            {complaints.map(complaint => (
              <div key={complaint.id} className="complaint-card">
                <div className="complaint-header">
                  <h3>{complaint.title}</h3>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(complaint.status) }}
                  >
                    {complaint.status}
                  </span>
                </div>
                <p className="complaint-description">{complaint.description}</p>
                <div className="complaint-meta">
                  <span className="branch"><strong>Branch:</strong> {complaint.branch}</span>
                  <span className="date"><strong>Submitted:</strong> {complaint.submittedDate}</span>
                </div>

                {showResolvePanel && (
                  <div className="action-buttons">
                    <button
                      className="resolve-action-btn"
                      onClick={() => handleResolveComplaint(complaint.id)}
                    >
                      ✓ Resolve
                    </button>
                    <button
                      className="reject-action-btn"
                      onClick={() => handleRejectComplaint(complaint.id)}
                    >
                      ✗ Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-complaints">No complaints raised yet. Click "Raise a Complaint" to submit one.</p>
        )}
      </div>

      {/* Complaint Form Modal */}
      {showComplaintForm && (
        <div className="modal-overlay">
          <div className="modal-content complaint-modal">
            <button className="close-btn" onClick={() => setShowComplaintForm(false)}>×</button>
            <h2>Raise a Complaint</h2>
            <form onSubmit={handleSubmitComplaint}>
              <div className="form-group">
                <label>Complaint Title:</label>
                <input
                  type="text"
                  name="title"
                  value={complaintForm.title}
                  onChange={handleComplaintChange}
                  placeholder="Enter complaint title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={complaintForm.description}
                  onChange={handleComplaintChange}
                  placeholder="Describe your complaint in detail"
                  rows="5"
                  required
                />
              </div>

              <div className="form-group">
                <label>Branch:</label>
                <select
                  name="branch"
                  value={complaintForm.branch}
                  onChange={handleComplaintChange}
                >
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
                <button type="submit" className="submit-btn1">Submit Complaint</button>

              
            </form>
          </div>
        </div>
      )}

      {/* Staff Login Modal */}
      {showStaffLogin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowStaffLogin(false)}>×</button>
            <h2>Staff Login</h2>
            <form onSubmit={handleStaffLogin}>
              <div className="form-group">
                <label>Staff ID:</label>
                <input
                  type="text"
                  value={staffLogin.id}
                  onChange={(e) => setStaffLogin(prev => ({
                    ...prev,
                    id: e.target.value
                  }))}
                  placeholder="Enter your Staff ID"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={staffLogin.password}
                  onChange={(e) => setStaffLogin(prev => ({
                    ...prev,
                    password: e.target.value
                  }))}
                  placeholder="Enter password"
                  required
                />
              </div>

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
  background: linear-gradient(135deg, #E6F2F8 0%, #87CEEB 100%);
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
    background: #333;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: clamp(11px, 2vw, 14px);
    font-weight: 600;
    cursor: pointer;
    z-index: 100;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(51, 51, 51, 0.3);
    white-space: nowrap;

    &:hover {
      background: #f44336;
      box-shadow: 0 4px 12px rgba(244, 67, 54, 0.5);
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
    background: #FF9800;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: clamp(11px, 2vw, 14px);
    font-weight: 600;
    cursor: pointer;
    z-index: 100;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
    white-space: nowrap;

    &:hover {
      background: #F57C00;
      box-shadow: 0 6px 16px rgba(255, 152, 0, 0.5);
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
    background: #4CAF50;
    color: white;
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
    color: #333;
    font-size: clamp(24px, 7vw, 35px);
    margin-bottom: clamp(20px, 4vw, 40px);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }

  .no-complaints {
    text-align: center;
    color: #666;
    font-size: clamp(13px, 3vw, 16px);
    padding: clamp(20px, 3vw, 40px);
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  .complaints-list {
    display: flex;
    flex-direction: column;
    gap: clamp(12px, 3vw, 20px);
  }

  .complaint-card {
    background: white;
    border-radius: 10px;
    padding: clamp(15px, 3vw, 25px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border-left: 5px solid #2196F3;

    &:hover {
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
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
      color: #333;
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
    color: #555;
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
    border-top: 1px solid #eee;
    flex-wrap: wrap;

    span {
      color: #666;
      font-size: clamp(11px, 2vw, 13px);

      strong {
        color: #333;
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
    background: #4CAF50;
    color: white;

    &:hover {
      background: #45a049;
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
    background: white;
    border-radius: 10px;
    padding: clamp(20px, 4vw, 30px);
    max-width: 500px;
    width: 90%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    position: relative;
    animation: slideUp 0.3s ease;
    max-height: 90vh;
    overflow-y: auto;

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
      color: #333;
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
    color: #999;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: #333;
    }
  }

  .form-group {
    margin-bottom: clamp(12px, 3vw, 20px);

    label {
      display: block;
      color: #333;
      font-weight: 600;
      margin-bottom: clamp(5px, 1vw, 8px);
      font-size: clamp(12px, 2vw, 14px);
    }

    input,
    textarea,
    select {
      width: 100%;
      padding: clamp(10px, 2vw, 12px);
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: clamp(12px, 2vw, 14px);
      font-family: inherit;
      transition: border-color 0.3s ease;
      box-sizing: border-box;

      &:focus {
        outline: none;
        border-color: #2196F3;
        box-shadow: 0 0 5px rgba(33, 150, 243, 0.2);
      }
    }

    textarea {
      resize: vertical;
      min-height: clamp(80px, 20vw, 100px);
    }

    select {
      cursor: pointer;
      background: white;
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
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: clamp(13px, 2.5vw, 16px);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #1976D2;
      box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
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