import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./Components/Login.jsx";
import Signup from "./Components/Signup.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login></Login>} />
        <Route path="/signup" element={<Signup></Signup>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
