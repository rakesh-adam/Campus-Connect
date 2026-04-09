import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Time from "./pages/Time";
import Admin from "./pages/Admin";
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
      <Route path="/signup" element={!user ? <Auth /> : <Navigate to="/home" />} />
      <Route path="/signin" element={!user ? <Auth /> : <Navigate to="/home" />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/home" element={user ? <Home /> : <Navigate to="/signin" />} />
      <Route path="/time" element={user ? <Time /> : <Navigate to="/signin" />} />
      <Route path="/not" element={user ? <Not /> : <Navigate to="/signin" />} />
      <Route path="/attend" element={user ? <Attend /> : <Navigate to="/signin" />} />
      <Route path="/staff" element={user ? <Staff /> : <Navigate to="/signin" />} />
      <Route path="/raise" element={user ? <Raise /> : <Navigate to="/signin" />} />
      <Route path="*" element={<Card />} />
      <Route path="/" element={<Navigate to={user ? "/home" : "/signin"} />} />
    </Routes>
  );
}

export default App;
