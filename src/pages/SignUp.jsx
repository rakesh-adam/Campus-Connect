import { useState } from "react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/FirebaseConfig";
import "../signup.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await signOut(auth);
      alert("Account created! Please log in.");
      navigate("/signin");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="content">
        <div className="text">Register</div>

        <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
          <div className="field">
            <input
              required
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <span className="span">👤</span>
            <label className="label">Email or Phone</label>
          </div>

          <div className="field">
            <input
              required
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <span className="span">🔒</span>
            <label className="label">Password</label>
          </div>

          <button type="submit" className="button">Register</button>

          <div className="sign-up">
            Already a member?
            <a onClick={() => navigate("/signin")}>Login now</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;