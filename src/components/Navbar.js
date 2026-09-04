import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  return (

    <header className="navbar">

      <div>

        <h1>RetinaExplain AI</h1>

        <p>
          Explainable Diabetic Retinopathy Screening
        </p>

      </div>


      <div className="navbar-actions">

        <button
          className="new-button"
          onClick={() => navigate("/screening")}
        >
          ＋ New Screening
        </button>

        <button
          className="export-button"
          onClick={() => window.print()}
        >
          ⇩ Export Report
        </button>

      </div>

    </header>

  );
}

export default Navbar;