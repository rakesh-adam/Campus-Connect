import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/signin");
  };

  return (
    <StyledWrapper>
      <div className="home-container">
        <div className="background-image" />

        <div className="overlay" />

        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>

        <div className="home-box">
          <h2 className="welcome-title">Welcome</h2>
          <h4 className="user-email">{user?.email}</h4>
        </div>

        <div className="button-grid">
          <button onClick={() => navigate("/time")}>Time Table</button>
          <button onClick={() => navigate("/not")}>Notifications</button>
          <button onClick={() => navigate("/staff")}>Staff Info</button>
          <button onClick={() => navigate("/attend")}>Attendance</button>
          <button className="wide-btn" onClick={() => navigate("/raise")}>
            Raise Complaint
          </button>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .home-container {
    position: relative;
    height: 100vh;
    width: 100%;
    overflow: hidden;
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
    background: rgba(230, 242, 248, 0.7);
  }

  .home-box {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 3;
    display: flex;
    flex-direction: column;
    max-width: 90%;
  }

  .welcome-title {
    font-size: clamp(20px, 5vw, 28px);
    color: #001F3F;
    margin-bottom: 5px;
    font-weight: 600;
  }

  .user-email {
    color: #0C3B66;
    font-size: clamp(12px, 3vw, 14px);
    word-break: break-word;
  }

  .signout-btn {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 3;
    width: clamp(120px, 25vw, 150px);
    height: clamp(40px, 8vw, 45px);
    font-size: clamp(12px, 2.5vw, 16px);
    font-weight: 600;
    border-radius: 25px;
    border: none;
    cursor: pointer;
    color: #FFFFFF;
    background: #0066CC;
    box-shadow: 0 4px 10px rgba(0, 102, 204, 0.3);
    transition: all 0.3s ease;
    padding: 10px;
    white-space: nowrap;
  }

  .signout-btn:hover {
    color: #fff;
    background: #ff4d4d;
    box-shadow: 0 0 10px rgba(255, 77, 77, 0.6);
  }

  .signout-btn:active {
    box-shadow: inset 2px 2px 5px #b03030,
                inset -2px -2px 5px #ff8080;
  }

  .button-grid {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: clamp(15px, 4vw, 25px);
    z-index: 3;
    justify-content: center;
    padding: 0 20px;
    width: 90%;
    max-width: 700px;
  }

  .button-grid button {
    height: clamp(90px, 15vw, 100px);
    border-radius: 30px;
    border: none;
    cursor: pointer;
    font-size: clamp(14px, 3vw, 18px);
    font-weight: 600;
    color: #FFFFFF;
    background: #0066CC;
    box-shadow: 0 4px 10px rgba(0, 102, 204, 0.3);
    transition: all 0.3s ease;
    padding: clamp(12px, 2vw, 16px);
    white-space: normal;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button-grid button:hover {
    background: #0052A3;
    box-shadow: 0 6px 15px rgba(0, 102, 204, 0.5);
  }

  .wide-btn {
    grid-column: span 2;
    width: 100%;
    height: clamp(100px, 15vw, 140px);
  }

  .wide-btn:hover {
    color: #fff;
    background: #ff4d4d;
    box-shadow: 0 0 10px rgba(255, 77, 77, 0.6);
  }

  .wide-btn:active {
    box-shadow: inset 2px 2px 5px #b03030,
                inset -2px -2px 5px #ff8080;
  }

  @media (max-width: 768px) {
    .button-grid {
      grid-template-columns: 1fr;
      gap: 15px;
    }

    .wide-btn {
      grid-column: span 1;
    }
  }

  @media (max-width: 480px) {
    .home-box {
      top: 15px;
      left: 15px;
    }

    .signout-btn {
      top: 15px;
      right: 15px;
    }

    .button-grid {
      top: 55%;
      gap: 12px;
    }
  }
`;

export default Home;