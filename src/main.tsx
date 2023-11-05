import React from "react";
import ReactDOM from "react-dom/client";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import CreateRoute from "./pages/CreateRoute";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Modal from "react-modal";

import "./index.css";
import CreateDriver from "./pages/CreateDriver";
import DriverDocuments from "./pages/DriverDocuments";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (localStorage.getItem("user")) {
    return children;
  }

  return <Navigate to="/login" />;
};

const Redirect: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (localStorage.getItem("user")) {
    return <Navigate to="/" />;
  }

  return children;
};

Modal.setAppElement("#root");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="max-w-7xl mx-auto px-10">
      <Toaster />
      <div className="w-full py-20 relative">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-route"
              element={
                <ProtectedRoute>
                  <CreateRoute />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver-documents"
              element={
                <ProtectedRoute>
                  <DriverDocuments />
                </ProtectedRoute>
              }
            />
            <Route
              path="login"
              element={
                <Redirect>
                  <Login />
                </Redirect>
              }
            />
            <Route
              path="register"
              element={
                <Redirect>
                  <Register />
                </Redirect>
              }
            />
            <Route
              path="create-driver"
              element={
                <Redirect>
                  <CreateDriver />
                </Redirect>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  </React.StrictMode>
);
