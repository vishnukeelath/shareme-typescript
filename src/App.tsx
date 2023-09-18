import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "@/components/Login";
import Home from "@/container/Home";
import { fetchUser } from "@/utils/fetchUser";
import AdminPanel from "./components/AdminPanel";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = fetchUser();
    console.log("user", user);

    if (!user) navigate("/login");
  }, []);

  return (
    <Routes>
      <Route path="/*" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-panel/*" element={<AdminPanel />} />
    </Routes>
  );
}

export default App;
