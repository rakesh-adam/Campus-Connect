import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Not = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [loginData, setLoginData] = useState({ id: '', password: '' });
  const [uploadedNotifications, setUploadedNotifications] = useState([]);
  const [uploadForm, setUploadForm] = useState({ title: '', description: '', file: null });
  const [loginError, setLoginError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFileOptions, setShowFileOptions] = useState(false);

  const staffIds = ['12341', '12342', '12343', '12345', '12346'];
  const correctPassword = 'BVC@123';

  // Load notifications from localStorage on component mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('uploadedNotifications');
    if (savedNotifications) {
      try {
        const notifs = JSON.parse(savedNotifications);
        setUploadedNotifications(notifs);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (uploadedNotifications.length === 0) return;

    const timers = uploadedNotifications.map(notif => {
      const timer = setTimeout(() => {
        setUploadedNotifications(prev => {
          const updated = prev.filter(n => n.id !== notif.id);
          localStorage.setItem('uploadedNotifications', JSON.stringify(updated));
          return updated;
        });
      }, 30000); 
      return { id: notif.id, timer };
    });

    return () => {
      timers.forEach(({ timer }) => clearTimeout(timer));
    };
  }, [uploadedNotifications]);


  const handleUploadClick = () => {
    setShowLoginModal(true);
    setLoginError('');
    setLoginData({ id: '', password: '' });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const{ id, password } = loginData;

    if (!staffIds.includes(id)) {
      setLoginError('Invalid Staff ID');
      return;
    }

    if (password !== correctPassword) {
      setLoginError('Invalid Password');
      return;
    }

    setShowLoginModal(false);
    setShowUploadForm(true);
    setLoginError('');
  };

  const handleUploadChange = (e) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadForm(prev => ({
      ...prev,
      file: file
    }));
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    
    if (!uploadForm.title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (uploadForm.file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newNotification = {
          id: Date.now(),
          title: uploadForm.title,
          description: uploadForm.description,
          fileName: uploadForm.file.name,
          fileData: event.target.result,
          fileType: uploadForm.file.type,
          staffId: loginData.id,
          timestamp: new Date().toLocaleString()
        };

        const updatedNotifications = [newNotification, ...uploadedNotifications];
        setUploadedNotifications(updatedNotifications);
        
        localStorage.setItem('uploadedNotifications', JSON.stringify(updatedNotifications));
        
        setUploadForm({ title: '', description: '', file: null });
        setShowUploadForm(false);
        setUploadSuccess(true);
        
        setTimeout(() => setUploadSuccess(false), 3000);
      };
      reader.readAsDataURL(uploadForm.file);
    } else {
      const newNotification = {
        id: Date.now(),
        title: uploadForm.title,
        description: uploadForm.description,
        fileName: 'No file',
        fileData: null,
        fileType: null,
        staffId: loginData.id,
        timestamp: new Date().toLocaleString()
      };

      const updatedNotifications = [newNotification, ...uploadedNotifications];
      setUploadedNotifications(updatedNotifications);
      
      localStorage.setItem('uploadedNotifications', JSON.stringify(updatedNotifications));
      
      setUploadForm({ title: '', description: '', file: null });
      setShowUploadForm(false);
      setUploadSuccess(true);
      
      setTimeout(() => setUploadSuccess(false), 3000);
    }
  };

  const handleFileClick = (notif) => {
    if (notif.fileName !== 'No file' && notif.fileData) {
      setSelectedFile(notif);
      setShowFileOptions(true);
    }
  };

  const handleViewFile = () => {
    if (selectedFile && selectedFile.fileData) {
      window.open(selectedFile.fileData, '_blank');
      setShowFileOptions(false);
    }
  };

  const handleDownloadFile = () => {
    if (selectedFile && selectedFile.fileData) {
      const link = document.createElement('a');
      link.href = selectedFile.fileData;
      link.download = selectedFile.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowFileOptions(false);
    }
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    setLoginError('');
    setLoginData({ id: '', password: '' });
  };

  return (
    <StyledWrapper>
      <div className="staff-container">
        <button className="back-btn" onClick={() => navigate('/home')}>
          ← Back to Home
        </button>
        
        <button className="upload-btn" onClick={handleUploadClick}>
          + Upload
        </button>

        {uploadSuccess && <div className="success-message">Notification uploaded successfully!</div>}

        <h1 className="page-title">Notifications</h1>

        {uploadedNotifications.length > 0 && (
          <div className="notifications-section">
            <h2>Recent Uploads</h2>
            <div className="notifications-list">
              {uploadedNotifications.map(notif => (
                <div key={notif.id} className="notification-item">
                  <div className="notif-header">
                    <h3>{notif.title}</h3>
                    <span className="notif-time">{notif.timestamp}</span>
                  </div>
                  <p className="notif-description">{notif.description}</p>
                  
                  <p className="notif-staff">
                    <strong>Staff ID:</strong> {notif.staffId}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadedNotifications.length === 0 && (
          <p className="no-notifications">No notifications uploaded yet. Click the Upload button to add one.</p>
        )}

        {/* File Options Modal */}
        {showFileOptions && selectedFile && (
          <div className="modal-overlay">
            <div className="modal-content file-options-modal">
              <button className="close-btn" onClick={() => setShowFileOptions(false)}>×</button>
              <h2>File Options</h2>
              <p className="file-name-display">{selectedFile.fileName}</p>
              <div className="file-options">
                <button className="option-btn view-btn" onClick={handleViewFile}>
                  👁️ View File
                </button>
                <button className="option-btn download-btn" onClick={handleDownloadFile}>
                  ⬇️ Download File
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Login Modal */}
        {showLoginModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={closeLoginModal}>×</button>
              <h2>Staff Login</h2>
              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label>Staff ID:</label>
                  <input
                    type="text"
                    name="id"
                    value={loginData.id}
                    onChange={(e) => setLoginData(prev => ({
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
                    name="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({
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

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="modal-overlay">
            <div className="modal-content upload-modal">
              <button className="close-btn" onClick={() => setShowUploadForm(false)}>×</button>
              <h2>Upload Notification</h2>
              <form onSubmit={handleUploadSubmit}>
                <div className="form-group">
                  <label>Notification Title:</label>
                  <input
                    type="text"
                    name="title"
                    value={uploadForm.title}
                    onChange={handleUploadChange}
                    placeholder="Enter notification title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description/Information:</label>
                  <textarea
                    name="description"
                    value={uploadForm.description}
                    onChange={handleUploadChange}
                    placeholder="Enter detailed information"
                    rows="5"
                  />
                </div>
                <div className="form-group">
                  <label>Upload File/Image:</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  {uploadForm.file && <p className="file-name">Selected: {uploadForm.file.name}</p>}
                </div>
                <button type="submit" className="submit-btn">Submit</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .staff-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 40px 20px;
    background: linear-gradient(135deg, #E6F2F8 0%, #87CEEB 100%);
    min-height: 100vh;
  }

  .back-btn {
    position: fixed;
    top: 20px;
    left: 20px;
    padding: 10px 20px;
    background: #0066CC;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    z-index: 100;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);

    &:hover {
      background: #0052A3;
      box-shadow: 0 4px 12px rgba(0, 102, 204, 0.5);
      transform: translateX(-3px);
    }

    &:active {
      transform: translateX(-1px);
    }
  }

  .upload-btn {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: clamp(10px, 2vw, 12px) clamp(15px, 3vw, 25px);
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: clamp(11px, 2vw, 14px);
    font-weight: 600;
    cursor: pointer;
    z-index: 100;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
    white-space: nowrap;

    &:hover {
      background: #45a049;
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.5);
      transform: translateX(3px);
    }

    &:active {
      transform: translateX(1px);
    }
  }

  .success-message {
    position: fixed;
    top: clamp(60px, 10vw, 70px);
    right: clamp(15px, 3vw, 20px);
    background: #4CAF50;
    color: white;
    padding: clamp(12px, 2vw, 15px) clamp(15px, 3vw, 25px);
    border-radius: 5px;
    font-weight: 600;
    font-size: clamp(11px, 2vw, 14px);
    z-index: 110;
    animation: slideIn 0.3s ease;
    max-width: 90vw;

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

  .page-title {
    text-align: center;
    color: #333;
    margin-bottom: clamp(20px, 4vw, 30px);
    font-size: clamp(24px, 7vw, 40px);
    font-weight: 700;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }

  .no-notifications {
    text-align: center;
    color: #666;
    font-size: clamp(13px, 3vw, 16px);
    padding: clamp(20px, 3vw, 40px);
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  .notifications-section {
    margin-bottom: clamp(20px, 4vw, 30px);

    h2 {
      color: #333;
      font-size: clamp(20px, 5vw, 28px);
      margin-bottom: clamp(12px, 2vw, 20px);
      border-bottom: 3px solid #4CAF50;
      padding-bottom: clamp(8px, 2vw, 10px);
    }
  }

  .notifications-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .notification-item {
    background: white;
    border-left: 5px solid #4CAF50;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
      transform: translateX(5px);
    }
  }

  .notif-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    h3 {
      color: #333;
      font-size: 20px;
      margin: 0;
      font-weight: 700;
    }
  }

  .notif-time {
    color: #999;
    font-size: 12px;
  }

  .notif-description {
    color: #555;
    font-size: 14px;
    margin: 10px 0;
    line-height: 1.5;
  }

  .notif-file,
  .notif-staff {
    color: #666;
    font-size: 13px;
    margin: 5px 0;

    a {
      color: #2196F3;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .file-link {
    color: #2196F3;
    text-decoration: underline;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      color: #1976D2;
      font-weight: 700;
    }

    &:active {
      color: #0d47a1;
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
    padding: 30px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    position: relative;
    animation: slideUp 0.3s ease;
    display: flex;
    flex-direction: column;
    min-height: 500px;

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

    &.upload-modal {
      max-width: 600px;
    }

    &.file-options-modal {
      max-width: 400px;
    }

    h2 {
      color: #333;
      font-size: 24px;
      margin: 0 0 25px 0;
      font-weight: 700;
      flex-shrink: 0;
    }
  }

  .file-name-display {
    color: #555;
    font-size: 14px;
    background: #f5f5f5;
    padding: 10px;
    border-radius: 5px;
    margin: 0 0 20px 0;
    word-break: break-word;
    border-left: 4px solid #4CAF50;
  }

  .file-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .option-btn {
    padding: 12px;
    border: none;
    border-radius: 5px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &.view-btn {
      background: #2196F3;
      color: white;

      &:hover {
        background: #1976D2;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
      }
    }

    &.download-btn {
      background: #4CAF50;
      color: white;

      &:hover {
        background: #45a049;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
      }
    }
  }

  .close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 28px;
    color: #999;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: #333;
    }
  }

  .form-group {
    margin-bottom: 20px;
    flex-shrink: 0;

    label {
      display: block;
      color: #333;
      font-weight: 600;
      margin-bottom: 8px;
      font-size: 14px;
    }

    input[type="text"],
    input[type="password"],
    input[type="file"],
    textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
      font-family: inherit;
      transition: border-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: #4CAF50;
        box-shadow: 0 0 5px rgba(76, 175, 80, 0.2);
      }
    }

    textarea {
      resize: vertical;
      min-height: 100px;
    }

    input[type="file"] {
      padding: 8px;
    }
  }

  .modal-content form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex: 1;
  }

  .file-name {
    color: #4CAF50;
    font-size: 13px;
    margin-top: 8px;
    font-weight: 500;
  }

  .error-message {
    color: #f44336;
    font-size: 13px;
    margin-top: 10px;
    text-align: center;
  }

  .login-btn,
  .submit-btn {
    width: 100%;
    padding: clamp(10px, 2vw, 12px);
    background: #17a40a;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: clamp(13px, 2.5vw, 16px);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: auto;

    &:hover {
      background: #45a049;
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
      transform: translateY(-2px);
    }

    &:active {
      transform: scale(0.98);
    }
  }

  .staff-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
    padding: 20px;
  }

  .staff-card {
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    transition: all 0.3s ease;
    border: 2px solid transparent;

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
      border-color: #4CAF50;
    }
  }

  .staff-image {
    width: 100%;
    height: 150px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .staff-info {
    padding: 18px;
  }

  .staff-name {
    font-size: 22px;
    color: #333;
    margin: 0 0 12px 0;
    font-weight: 700;
    border-bottom: 3px solid #4CAF50;
    padding-bottom: 8px;
  }

  .staff-details {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .staff-details p {
    margin: 0;
    font-size: 14px;
    color: #555;
    display: flex;
    justify-content: space-between;
    padding: 3px 0;
    line-height: 1.2;

    strong {
      color: #333;
      font-weight: 600;
      min-width: 120px;
    }
  }

  .staff-details a {
    color: #4CAF50;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #45a049;
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    .upload-btn {
      top: clamp(15px, 3vw, 20px);
      right: clamp(15px, 3vw, 20px);
      padding: clamp(8px, 2vw, 10px) clamp(12px, 2vw, 15px);
      font-size: clamp(10px, 1.8vw, 12px);
    }

    .back-btn {
      padding: clamp(8px, 2vw, 10px) clamp(12px, 2vw, 15px);
      font-size: clamp(10px, 1.8vw, 12px);
    }

    .staff-grid {
      grid-template-columns: 1fr;
      gap: clamp(15px, 3vw, 20px);
    }

    .page-title {
      font-size: clamp(22px, 5vw, 28px);
      margin-bottom: clamp(15px, 3vw, 25px);
    }

    .modal-content {
      width: 95%;
      padding: clamp(15px, 3vw, 20px);
      max-height: 85vh;
      overflow-y: auto;
    }

    .staff-card {
      &:hover {
        transform: translateY(-3px);
      }
    }

    .notification-item {
      padding: clamp(12px, 2vw, 20px);
      border-left-width: 4px;
    }

    .notif-header {
      flex-direction: column;
      gap: 8px;

      h3 {
        font-size: clamp(16px, 4vw, 20px);
      }
    }

    .notif-time {
      font-size: clamp(10px, 1.8vw, 12px);
    }

    .notif-description {
      font-size: clamp(12px, 2vw, 14px);
      margin: clamp(8px, 2vw, 10px) 0;
    }

    .notif-file,
    .notif-staff {
      font-size: clamp(11px, 2vw, 13px);
    }
  }

  @media (max-width: 480px) {
    .upload-btn {
      top: 20px;
      right: 15px;
      padding: 8px 12px;
      font-size: 10px;
    }

    .back-btn {
      top: 20px;
      left: 15px;
      padding: 8px 12px;
      font-size: 10px;
    }

    .page-title {
      font-size: 20px;
      margin-bottom: 15px;
    }

    .staff-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      padding: 10px;
    }

    .modal-content {
      width: 95%;
      padding: 15px;
      max-height: 90vh;
    }

    .form-group {
      margin-bottom: 12px;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      font-size: 16px;
      padding: 10px;
    }

    .modal-content h2 {
      font-size: 18px;
      margin-bottom: 15px;
    }

    .close-btn {
      font-size: 24px;
      top: 10px;
      right: 10px;
    }

    .notification-item {
      padding: 10px;
      margin: 0 -20px;
    }

    .notif-header {
      flex-direction: column;
    }

    .notif-header h3 {
      font-size: 14px;
    }

    .action-buttons {
      gap: 8px;
    }

    .option-btn {
      padding: clamp(8px, 2vw, 10px);
      font-size: clamp(11px, 2vw, 13px);
    }
  }
`;

export default Not;
