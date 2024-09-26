import React from "react";
import Header from "./Navigations/Header";
import Footer from "./Navigations/Footer";
import { Outlet } from "react-router-dom";
import "./App.css";
import AuthProvider from "../hooks/AuthProvider";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Header />
        <Outlet />
        <Footer />
      </AuthProvider>
    </div>
  );
}

export default App;
