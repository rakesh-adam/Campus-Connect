import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase/FirebaseConfig";
import styled from "styled-components";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isToggled, setIsToggled] = useState(location.pathname === "/signup");
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsToggled(location.pathname === "/signup");
    
    // Initialize credentials in localStorage on app start
    const adminCredentials = localStorage.getItem("adminCredentials");
    const students = localStorage.getItem("students");
    
    // Initialize admin credentials if not exists
    if (!adminCredentials) {
      const defaultAdmins = [{ email: "vamsi@gmail.com", password: "admin@1234" }];
      localStorage.setItem("adminCredentials", JSON.stringify(defaultAdmins));
    }
    
    // Initialize students if not exists
    if (!students) {
      const demoStudent = {
        id: "STU-001",
        name: "Demo Student",
        email: "student@demo.com",
        password: "demo123",
        createdDate: new Date().toISOString().split("T")[0],
        directLogin: true
      };
      localStorage.setItem("students", JSON.stringify([demoStudent]));
    }
  }, [location.pathname]);

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Check for admin credentials first
      const adminCredentials = localStorage.getItem("adminCredentials");
      if (adminCredentials) {
        const adminList = JSON.parse(adminCredentials);
        const adminUser = adminList.find(
          admin => admin.email === signinEmail && admin.password === signinPassword
        );
        
        if (adminUser) {
          // Store admin info in session
          localStorage.setItem("currentAdmin", JSON.stringify(adminUser));
          navigate("/home");
          setLoading(false);
          return;
        }
      }

      // Check for direct login (students added via Admin panel)
      const students = localStorage.getItem("students");
      if (students) {
        const studentList = JSON.parse(students);
        const directStudent = studentList.find(
          student => student.email === signinEmail && 
                     student.password === signinPassword &&
                     student.directLogin === true
        );
        
        if (directStudent) {
          // Store student info in session
          localStorage.setItem("currentStudent", JSON.stringify(directStudent));
          navigate("/home");
          setLoading(false);
          return;
        }
      }

      // If not admin or direct login student, try Firebase
      await signInWithEmailAndPassword(auth, signinEmail, signinPassword);
      navigate("/home");
    } catch (error) {
      setError(error.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      alert("Account created successfully! Please sign in.");
      setIsToggled(false);
      setSignupUsername("");
      setSignupEmail("");
      setSignupPassword("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsToggled(!isToggled);
    setError("");
  };

  return (
    <StyledWrapper>
      <div className={`auth-wrapper ${isToggled ? "toggled" : ""}`}>
        <div className="background-shape"></div>
        <div className="secondary-shape"></div>

        {/* Sign In Panel */}
        <div className="credentials-panel signin">
          <h2 className="slide-element">Login</h2>
          <form onSubmit={handleSignin}>
            <div className="field-wrapper slide-element">
              <input
                type="text"
                required
                value={signinEmail}
                onChange={(e) => setSigninEmail(e.target.value)}
                disabled={loading}
              />
              <label>Email</label>
              <i className="fa-solid fa-user"></i>
            </div>

            <div className="field-wrapper slide-element">
              <input
                type="password"
                required
                value={signinPassword}
                onChange={(e) => setSigninPassword(e.target.value)}
                disabled={loading}
              />
              <label>Password</label>
              <i className="fa-solid fa-lock"></i>
            </div>

            {error && <div className="error-message slide-element">{error}</div>}

            <div className="field-wrapper slide-element">
              <button
                className="submit-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            <div className="switch-link slide-element">
              <p>
                Don't have an account? <br/>{" "}
                <a onClick={toggleForm} className="register-trigger">
                  Sign Up
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Welcome Section for Sign In */}
        <div className="welcome-section signin">
          <h2 className="slide-element">WELCOME BACK!</h2>
        </div>

        {/* Sign Up Panel */}
        <div className="credentials-panel signup">
          <h2 className="slide-element">Register</h2>
          <form onSubmit={handleSignup}>
            <div className="field-wrapper slide-element">
              <input
                type="text"
                required
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                disabled={loading}
              />
              <label>Username</label>
              <i className="fa-solid fa-user"></i>
            </div>

            <div className="field-wrapper slide-element">
              <input
                type="email"
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                disabled={loading}
              />
              <label>Email</label>
              <i className="fa-solid fa-envelope"></i>
            </div>

            <div className="field-wrapper slide-element">
              <input
                type="password"
                required
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                disabled={loading}
              />
              <label>Password</label>
              <i className="fa-solid fa-lock"></i>
            </div>

            {error && <div className="error-message slide-element">{error}</div>}

            <div className="field-wrapper slide-element">
              <button
                className="submit-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>

            <div className="switch-link slide-element">
              <p>
                Already have an account? <br/>{" "}
                <a onClick={toggleForm} className="login-trigger">
                  Sign In
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Welcome Section for Sign Up */}
        <div className="welcome-section signup">
          <h2 className="slide-element">WELCOME!</h2>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
    color: #fff;
  }

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #1a1a2e;
  padding: 20px;

  

    a {
      color: #0066CC;
      text-decoration: none;
      font-weight: 600;
      transition: 0.3s;

      &:hover {
        text-decoration: underline;
        color: #0052A3;
      }
    }
  }

  .auth-wrapper {
    position: relative;
    width: 100%;
    max-width: 800px;
    height: 500px;
    border: 2px solid #0066CC;
    box-shadow: 0 0 25px #0066CC;
    overflow: hidden;
  }

  .credentials-panel {
    position: absolute;
    top: 0;
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;

    h2 {
      font-size: 32px;
      text-align: center;
    }

    .field-wrapper {
      position: relative;
      width: 100%;
      height: 50px;
      margin-top: 25px;

      input {
        width: 100%;
        height: 100%;
        background: transparent;
        border: none;
        outline: none;
        font-size: 16px;
        color: #fff;
        font-weight: 600;
        border-bottom: 2px solid #fff;
        padding-right: 23px;
        transition: 0.5s;

        &:focus,
        &:valid {
          border-bottom: 2px solid #0066CC;
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }

      label {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        font-size: 16px;
        color: #fff;
        transition: 0.5s;
      }

      input:focus ~ label,
      input:valid ~ label {
        top: -5px;
        color: #0066CC;
      }

      i {
        position: absolute;
        top: 50%;
        right: 0;
        font-size: 18px;
        transform: translateY(-50%);
        color: #fff;
        transition: 0.3s;
      }

      input:focus ~ i,
      input:valid ~ i {
        color: #0066CC;
      }
    }

    .error-message {
      color: #ff6b6b;
      font-size: 14px;
      text-align: center;
      margin-top: 15px;
      padding: 10px;
      background: rgba(255, 107, 107, 0.1);
      border-radius: 5px;
      border-left: 3px solid #ff6b6b;
    }
  }

  .credentials-panel.signin {
    left: 0;
    padding: 0 40px;

    .slide-element {
      transform: translateX(0%);
      transition: 0.7s;
      opacity: 1;

      &:nth-child(1) {
        transition-delay: 2.1s;
      }
      &:nth-child(2) {
        transition-delay: 2.2s;
      }
      &:nth-child(3) {
        transition-delay: 2.3s;
      }
      &:nth-child(4) {
        transition-delay: 2.4s;
      }
      &:nth-child(5) {
        transition-delay: 2.5s;
      }
    }
  }

  .auth-wrapper.toggled .credentials-panel.signin .slide-element {
    transform: translateX(-120%);
    opacity: 0;

    &:nth-child(1) {
      transition-delay: 0s;
    }
    &:nth-child(2) {
      transition-delay: 0.1s;
    }
    &:nth-child(3) {
      transition-delay: 0.2s;
    }
    &:nth-child(4) {
      transition-delay: 0.3s;
    }
    &:nth-child(5) {
      transition-delay: 0.4s;
    }
  }

  .credentials-panel.signup {
    right: 0;
    padding: 0 60px;

    .slide-element {
      transform: translateX(120%);
      transition: 0.7s ease;
      opacity: 0;
      filter: blur(10px);

      &:nth-child(1) {
        transition-delay: 0s;
      }
      &:nth-child(2) {
        transition-delay: 0.1s;
      }
      &:nth-child(3) {
        transition-delay: 0.2s;
      }
      &:nth-child(4) {
        transition-delay: 0.3s;
      }
      &:nth-child(5) {
        transition-delay: 0.4s;
      }
      &:nth-child(6) {
        transition-delay: 0.5s;
      }
    }
  }

  .auth-wrapper.toggled .credentials-panel.signup .slide-element {
    transform: translateX(0%);
    opacity: 1;
    filter: blur(0px);

    &:nth-child(1) {
      transition-delay: 1.7s;
    }
    &:nth-child(2) {
      transition-delay: 1.8s;
    }
    &:nth-child(3) {
      transition-delay: 1.9s;
    }
    &:nth-child(4) {
      transition-delay: 1.9s;
    }
    &:nth-child(5) {
      transition-delay: 2.0s;
    }
    &:nth-child(6) {
      transition-delay: 2.1s;
    }
  }

  .submit-button {
    position: relative;
    width: 100%;
    height: 45px;
    background: transparent;
    border-radius: 40px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    border: 2px solid #0066CC;
    overflow: hidden;
    z-index: 1;
    transition: 0.3s;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &::before {
      content: "";
      position: absolute;
      height: 300%;
      width: 100%;
      background: linear-gradient(#1a1a2e, #0066CC, #1a1a2e, #0066CC);
      top: -100%;
      left: 0;
      z-index: -1;
      transition: 0.5s;
    }

    &:hover:not(:disabled)::before {
      top: 0;
    }
  }

  .switch-link {
    font-size: 14px;
    text-align: center;
    margin: 20px 0 10px;

    a {
      text-decoration: none;
      color: #0066CC;
      font-weight: 600;
      cursor: pointer;
      transition: 0.3s;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .welcome-section {
    position: absolute;
    top: 0;
    height: 100%;
    width: 50%;
    display: flex;
    justify-content: center;
    flex-direction: column;

    h2 {
      text-transform: uppercase;
      font-size: 36px;
      line-height: 1.3;
    }
  }

  .welcome-section.signin {
    right: 0;
    text-align: right;
    padding: 0 40px 60px 150px;

    .slide-element {
      transform: translateX(0);
      transition: 0.7s ease;
      opacity: 1;
      filter: blur(0px);

      &:nth-child(1) {
        transition-delay: 2.0s;
      }
      &:nth-child(2) {
        transition-delay: 2.1s;
      }
    }
  }

  .auth-wrapper.toggled .welcome-section.signin .slide-element {
    transform: translateX(120%);
    opacity: 0;
    filter: blur(10px);

    &:nth-child(1) {
      transition-delay: 0s;
    }
    &:nth-child(2) {
      transition-delay: 0.1s;
    }
  }

  .welcome-section.signup {
    left: 0;
    text-align: left;
    padding: 0 150px 60px 38px;
    pointer-events: none;

    .slide-element {
      transform: translateX(-120%);
      transition: 0.7s ease;
      opacity: 0;
      filter: blur(10px);

      &:nth-child(1) {
        transition-delay: 0s;
      }
      &:nth-child(2) {
        transition-delay: 0.1s;
      }
    }
  }

  .auth-wrapper.toggled .welcome-section.signup .slide-element {
    transform: translateX(0%);
    opacity: 1;
    filter: blur(0);

    &:nth-child(1) {
      transition-delay: 1.7s;
    }
    &:nth-child(2) {
      transition-delay: 1.8s;
    }
  }

  .background-shape {
    position: absolute;
    right: 0;
    top: -5px;
    height: 600px;
    width: 850px;
    background: linear-gradient(45deg, #1a1a2e, #00d4ff);
    transform: rotate(10deg) skewY(40deg);
    transform-origin: bottom right;
    transition: 1.5s ease;
    transition-delay: 1.6s;
  }

  .auth-wrapper.toggled .background-shape {
    transform: rotate(0deg) skewY(0deg);
    transition-delay: 0.5s;
  }

  .secondary-shape {
    position: absolute;
    left: 250px;
    top: 100%;
    height: 700px;
    width: 850px;
    background: #1a1a2e;
    border-top: 3px solid #00d4ff;
    transform: rotate(0deg) skewY(0deg);
    transform-origin: bottom left;
    transition: 1.5s ease;
    transition-delay: 0.5s;
  }

  .auth-wrapper.toggled .secondary-shape {
    transform: rotate(-11deg) skewY(-41deg);
    transition-delay: 1.2s;
  }

  @media (max-width: 768px) {
    .auth-wrapper {
      height: auto;
      min-height: 500px;
    }

    .credentials-panel,
    .welcome-section {
      width: 100%;
      position: relative;
    }

    .credentials-panel.signin,
    .credentials-panel.signup {
      padding: 40px 30px;
      left: 0;
      right: 0;
    }

    .credentials-panel.signin {
      display: flex;
    }

    .credentials-panel.signup {
      display: none;
    }

    .auth-wrapper.toggled .credentials-panel.signin {
      display: none;
    }

    .auth-wrapper.toggled .credentials-panel.signup {
      display: flex;
    }

    .welcome-section {
      display: none;
    }

    .background-shape,
    .secondary-shape {
      display: none;
    }

    .credentials-panel h2 {
      font-size: 28px;
      margin-bottom: 10px;
    }

    .field-wrapper {
      margin-top: 20px;
    }
  }

  @media (max-width: 480px) {
    .credentials-panel.signin,
    .credentials-panel.signup {
      padding: 30px 20px;
    }

    .credentials-panel h2 {
      font-size: 24px;
    }

    .field-wrapper input,
    .field-wrapper label {
      font-size: 14px;
    }

    .submit-button {
      font-size: 14px;
      height: 40px;
    }

    .switch-link {
      font-size: 13px;
    }
  }
`;

export default Auth;
