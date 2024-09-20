import React from "react";
import Header from "./Navigations/Header";
import Footer from "./Navigations/Footer";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
