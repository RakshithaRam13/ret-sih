import React, { useEffect, useState } from "react";

// TEMP: pointing to local Flask backend for testing.
// Switch back to your deployed Vercel URL once this is confirmed working:
// const API_BASE = "https://ret-sih-v4vr.vercel.app/api/referrals";
const API_BASE = "http://127.0.0.1:5000/api/referrals";

function Referrals() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // tracks which card is mid-update

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = () => {
    setLoading(true);
    fetch(API_BASE)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch referrals");
        }
        return response.json();
      })
      .then((data) => {
        setReferrals(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Referral error:", error);
        setLoading(false);
      });
  };

  // Updates a referral's status on the backend, then refreshes local state
  const updateStatus = async (patientId, newStatus) => {
    setUpdatingId(patientId);
    try {
      const response = await fetch(`${API_BASE}/${patientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referral_status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update referral status");
      }

      // Update local state instead of refetching everything
      setReferrals((prev) =>
        prev.map((p) =>
          p.id === patientId ? { ...p, referral_status: newStatus } : p
        )
      );
    } catch (error) {
      console.error("Status update error:", error);
      alert("Could not update referral status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  // NOTE: these must match your DB's exact capitalization: "Pending", "Verified", "Referred"
  const handleVerify = (patient) => {
    updateStatus(patient.id, "Verified");
  };

  const handleSendToSpecialist = (patient) => {
    updateStatus(patient.id, "Referred");
  };

  const renderActionButton = (patient) => {
    const isUpdating = updatingId === patient.id;
    const status = patient.referral_status;

    if (status === "Referred") {
      return (
        <button className="specialist-button full" disabled>
          ✓ Referred to Specialist
        </button>
      );
    }

    if (status === "Verified") {
      return (
        <button
          className="specialist-button full"
          disabled={isUpdating}
          onClick={() => handleSendToSpecialist(patient)}
        >
          {isUpdating ? "Sending..." : "Send to Specialist"}
        </button>
      );
    }

    // default / "Pending" state — doctor must verify first
    return (
      <button
        className="verify-button full"
        disabled={isUpdating}
        onClick={() => handleVerify(patient)}
      >
        {isUpdating ? "Verifying..." : "Verify Diagnosis"}
      </button>
    );
  };

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Specialist Referrals</h2>
          <p>Patients requiring specialist review</p>
        </div>
      </div>

      <div className="referral-banner">
        <div className="referral-banner-icon">🩺</div>
        <div>
          <h3>{loading ? "..." : referrals.length} cases require attention</h3>
          <p>Review AI flagged cases and send them to a retinal specialist.</p>
        </div>
      </div>

      <div className="referral-grid">
        {loading ? (
          <div className="panel empty-state">
            <h3>Loading referrals...</h3>
          </div>
        ) : referrals.length === 0 ? (
          <div className="panel empty-state">
            <div className="empty-icon">✓</div>
            <h3>No referrals</h3>
            <p>There are currently no cases requiring specialist review.</p>
          </div>
        ) : (
          referrals.map((patient) => (
            <div className="referral-card" key={patient.id}>
              <div className="referral-top">
                <div className="patient-avatar">
                  {patient.patient_name
                    ? patient.patient_name.charAt(0).toUpperCase()
                    : "P"}
                </div>
                <div>
                  <h3>{patient.patient_name}</h3>
                  <p>{patient.patient_id}</p>
                </div>
              </div>

              <div className="referral-result">
                <span>AI Result</span>
                <strong>{patient.result}</strong>
              </div>

              <div className="referral-details">
                <span>Confidence</span>
                <strong>{patient.confidence}%</strong>
              </div>

              <div className="referral-details">
                <span>Age</span>
                <strong>{patient.age}</strong>
              </div>

              <div className="referral-details">
                <span>Eye</span>
                <strong>{patient.eye}</strong>
              </div>

              <div className="referral-details">
                <span>Status</span>
                <strong>{patient.referral_status || "Pending"}</strong>
              </div>

              {renderActionButton(patient)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Referrals;