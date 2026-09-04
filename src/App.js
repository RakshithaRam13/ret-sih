import React from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import NewScreening from "./pages/NewScreening";
import PatientRecords from "./pages/PatientRecords";
import Referrals from "./pages/Referrals";
import Settings from "./pages/Settings";

import "./App.css";
function App() {
  return (
    <div className="app">

      <Sidebar />

      <div className="main-area">

        <Navbar />

        <main className="content">

          <Routes>

            <Route path="/" element={<Dashboard />} />

            <Route
              path="/screening"
              element={<NewScreening />}
            />

            <Route
              path="/patients"
              element={<PatientRecords />}
            />

            <Route
              path="/referrals"
              element={<Referrals />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

          </Routes>

        </main>

      </div>

    </div>
  );
}

export default App;
