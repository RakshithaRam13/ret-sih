import React, { useEffect, useState } from "react";

function Referrals() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/referrals")
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
  }, []);

  return (
    <div className="page">

      <div className="page-heading">

        <div>
          <h2>Specialist Referrals</h2>

          <p>
            Patients requiring specialist review
          </p>
        </div>

      </div>

      <div className="referral-banner">

        <div className="referral-banner-icon">
          🩺
        </div>

        <div>
          <h3>
            {loading ? "..." : referrals.length} cases require attention
          </h3>

          <p>
            Review AI flagged cases and send
            them to a retinal specialist.
          </p>
        </div>

      </div>

      <div className="referral-grid">

        {loading ? (

          <div className="panel empty-state">
            <h3>Loading referrals...</h3>
          </div>

        ) : referrals.length === 0 ? (

          <div className="panel empty-state">

            <div className="empty-icon">
              ✓
            </div>

            <h3>
              No referrals
            </h3>

            <p>
              There are currently no cases
              requiring specialist review.
            </p>

          </div>

        ) : (

          referrals.map((patient) => (

            <div
              className="referral-card"
              key={patient.id}
            >

              <div className="referral-top">

                <div className="patient-avatar">
                  {patient.patient_name
                    ? patient.patient_name
                        .charAt(0)
                        .toUpperCase()
                    : "P"}
                </div>

                <div>

                  <h3>
                    {patient.patient_name}
                  </h3>

                  <p>
                    {patient.patient_id}
                  </p>

                </div>

              </div>

              <div className="referral-result">

                <span>
                  AI Result
                </span>

                <strong>
                  {patient.result}
                </strong>

              </div>

              <div className="referral-details">

                <span>
                  Confidence
                </span>

                <strong>
                  {patient.confidence}%
                </strong>

              </div>

              <div className="referral-details">

                <span>
                  Age
                </span>

                <strong>
                  {patient.age}
                </strong>

              </div>

              <div className="referral-details">

                <span>
                  Eye
                </span>

                <strong>
                  {patient.eye}
                </strong>

              </div>

              <div className="referral-details">

                <span>
                  Status
                </span>

                <strong>
                  {patient.referral_status}
                </strong>

              </div>

              <button
                className="specialist-button full"
                onClick={() => {
                  alert(
                    `Referral for ${patient.patient_name} is already sent to specialist.`
                  );
                }}
              >
                ✓ Referred to Specialist
              </button>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default Referrals;