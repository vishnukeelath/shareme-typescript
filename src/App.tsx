import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "@/components/Login";
import Home from "@/container/Home";
import { fetchUser } from "@/utils/fetchUser";
import AdminPanel from "./components/AdminPanel";
import { User } from "./shared/types";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const adminsList = import.meta.env.VITE_REACT_APP_ADMIN_EMAILS;

  useEffect(() => {
    const userData = fetchUser();
    console.log("user", userData);
    if (userData) setUser(userData);

    if (!userData) navigate("/login");
  }, []);

  return (
    <Routes>
      <Route path="/*" element={<Home />} />
      <Route path="/login" element={<Login />} />
      {adminsList?.includes(user?.email) && (
        <Route path="/admin-panel/*" element={<AdminPanel />} />
      )}
    </Routes>
  );
}

export default App;
