import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/FirebaseConfig";
import "../signin.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="content">
        <div className="text">Login</div>

        <form onSubmit={(e) => { e.preventDefault(); handleSignin(); }}>
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

          <button type="submit" className="button">Sign in</button>

          <div className="sign-in">
            Not a member?
            <a onClick={() => navigate("/signup")}>Signup now</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;