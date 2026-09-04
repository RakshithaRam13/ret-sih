import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import UserList from "../components/Userlist";

function Dashboard() {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    normal: 0,
    moderate: 0,
    severe: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/records")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch records");
        }

        return response.json();
      })
      .then((data) => {
        setRecords(data);

        const normal = data.filter(
          (item) => item.result === "No DR"
        ).length;

        const moderate = data.filter(
          (item) => item.result === "Moderate NPDR"
        ).length;

        const severe = data.filter(
          (item) =>
            item.result === "Severe NPDR" ||
            item.result === "Proliferative DR"
        ).length;

        setStats({
          total: data.length,
          normal: normal,
          moderate: moderate,
          severe: severe
        });

        setLoading(false);
      })
      .catch((error) => {
        console.error("Dashboard error:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page">

      <div className="page-heading">

        <div>
          <h2>Dashboard</h2>

          <p>
            Overview of your retinal screening activity
          </p>

          <UserList />
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("/screening")}
        >
          ＋ Start Screening
        </button>

      </div>

      <div className="stats-grid">

        <StatCard
          title="Total Screenings"
          value={loading ? "..." : stats.total}
          icon="◎"
          change="All screenings"
          type="blue"
        />

        <StatCard
          title="Normal"
          value={loading ? "..." : stats.normal}
          icon="✓"
          change="Low risk"
          type="green"
        />

        <StatCard
          title="Moderate NPDR"
          value={loading ? "..." : stats.moderate}
          icon="!"
          change="Needs monitoring"
          type="yellow"
        />

        <StatCard
          title="Severe Cases"
          value={loading ? "..." : stats.severe}
          icon="⚠"
          change="Priority referral"
          type="red"
        />

      </div>

      <div className="dashboard-grid">

        <div className="panel">

          <div className="panel-header">

            <div>
              <h3>Recent Screenings</h3>

              <p>
                Latest patient analysis
              </p>
            </div>

            <button
              className="text-button"
              onClick={() => navigate("/patients")}
            >
              View all →
            </button>

          </div>

          {loading ? (

            <div className="empty-state">
              <h3>Loading screenings...</h3>
            </div>

          ) : records.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                👁
              </div>

              <h3>No screenings yet</h3>

              <p>
                Start your first retinal screening
                to see results here.
              </p>

              <button
                className="primary-button"
                onClick={() => navigate("/screening")}
              >
                Start Screening
              </button>

            </div>

          ) : (

            <div className="table-container">

              <table>

                <thead>

                  <tr>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Result</th>
                    <th>Confidence</th>
                  </tr>

                </thead>

                <tbody>

                  {records.slice(0, 5).map((patient) => (

                    <tr key={patient.id}>

                      <td>

                        <strong>
                          {patient.patient_name}
                        </strong>

                        <small>
                          {patient.patient_id}
                        </small>

                      </td>

                      <td>
                        {patient.created_at
                          ? new Date(
                              patient.created_at
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      <td>

                        <span
                          className={`status ${
                            patient.result
                              ?.toLowerCase()
                              .includes("moderate")
                              ? "warning"
                              : patient.result
                                  ?.toLowerCase()
                                  .includes("severe")
                              ? "danger"
                              : "success"
                          }`}
                        >
                          {patient.result || "—"}
                        </span>

                      </td>

                      <td>
                        {patient.confidence !== null &&
                        patient.confidence !== undefined
                          ? `${patient.confidence}%`
                          : "—"}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

        <div className="panel quick-panel">

          <h3>Quick Actions</h3>

          <div
            className="quick-action"
            onClick={() => navigate("/screening")}
          >

            <span className="quick-icon">
              📷
            </span>

            <div>
              <strong>New Screening</strong>

              <p>
                Upload a fundus image
              </p>
            </div>

            <span>→</span>

          </div>

          <div
            className="quick-action"
            onClick={() => navigate("/patients")}
          >

            <span className="quick-icon">
              👥
            </span>

            <div>
              <strong>Patient Records</strong>

              <p>
                View screening history
              </p>
            </div>

            <span>→</span>

          </div>

          <div
            className="quick-action"
            onClick={() => navigate("/referrals")}
          >

            <span className="quick-icon">
              🩺
            </span>

            <div>
              <strong>Referrals</strong>

              <p>
                Review specialist cases
              </p>
            </div>

            <span>→</span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;