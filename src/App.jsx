import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Time from "./pages/Time";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "./context/AuthContext";
import Not from "./pages/Not";
import Attend from "./pages/Attend";
import Staff from "./pages/Staff";
import Raise from "./pages/Raise";
import Card from "./pages/PageNotFound";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/home" element={user ? <Home /> : <Navigate to="/signin" />} />
      <Route path="/time" element={user ? <Time /> : <Navigate to="/signin" />} />
      <Route path="/not" element={user ? <Not /> : <Navigate to="/signin" />} />
      <Route path="/attend" element={user ? <Attend /> : <Navigate to="/signin" />} />
      <Route path="/staff" element={user ? <Staff /> : <Navigate to="/signin" />} />
      <Route path="/raise" element={user ? <Raise/> : <Navigate to="/signin" />} />
      <Route path="*" element={<Card/>} />
      <Route path="/" element={<Navigate to="/signup" />} />
    </Routes>
  );
}

export default App;
