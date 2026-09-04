import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {

  return (

    <aside className="sidebar">

      <div className="logo-area">

        <div className="logo-icon">
          👁
        </div>

        <div>
          <h2>RetinaExplain</h2>
          <span>AI SCREENING</span>
        </div>

      </div>


      <nav className="navigation">

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>▦</span>
          Dashboard
        </NavLink>


        <NavLink
          to="/screening"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>＋</span>
          New Screening
        </NavLink>


        <NavLink
          to="/patients"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>♙</span>
          Patient Records
        </NavLink>


        <NavLink
          to="/referrals"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>↗</span>
          Referrals
        </NavLink>


        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>⚙</span>
          Settings
        </NavLink>

      </nav>


      <div className="sidebar-bottom">

        <div className="doctor-mini">

          <div className="doctor-avatar">
            DR
          </div>

          <div>
            <strong>Dr. Doctor</strong>
            <small>Ophthalmologist</small>
          </div>

        </div>

      </div>

    </aside>

  );
}

export default Sidebar;