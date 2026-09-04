import React, { useEffect, useState } from "react";

function PatientRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/records")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch patient records");
        }
        return response.json();
      })
      .then((data) => {
        setRecords(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load patient records");
        setLoading(false);
      });
  }, []);

  return (
    <div className="page">

      <div className="page-heading">
        <div>
          <h2>Patient Records</h2>
          <p>View all previous retinal screenings</p>
        </div>
      </div>

      <div className="panel">

        {loading && (
          <div className="empty-state">
            <h3>Loading patient records...</h3>
          </div>
        )}

        {!loading && error && (
          <div className="empty-state">
            <h3>{error}</h3>
            <p>Make sure your Flask backend is running.</p>
          </div>
        )}

        {!loading && !error && records.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">👥</div>

            <h3>No patient records</h3>

            <p>
              Patient records will appear after completing a screening.
            </p>
          </div>
        )}

        {!loading && !error && records.length > 0 && (
          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Patient ID</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Eye</th>
                  <th>Result</th>
                  <th>Confidence</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>

                {records.map((patient) => (

                  <tr key={patient.id}>

                    <td>
                      <strong>
                        {patient.patient_name || "Unknown"}
                      </strong>
                    </td>

                    <td>
                      {patient.patient_id || "—"}
                    </td>

                    <td>
                      {patient.age || "—"}
                    </td>

                    <td>
                      {patient.gender || "—"}
                    </td>

                    <td>
                      {patient.eye || "—"}
                    </td>

                    <td>
                      <strong>
                        {patient.result || "—"}
                      </strong>
                    </td>

                    <td>
                      {patient.confidence !== null &&
                      patient.confidence !== undefined
                        ? `${patient.confidence}%`
                        : "—"}
                    </td>

                    <td>
                      <span
                        className={`status ${
                          patient.status === "Verified"
                            ? "success"
                            : "warning"
                        }`}
                      >
                        {patient.status || "Pending"}
                      </span>
                    </td>

                    <td>
                      {patient.created_at
                        ? new Date(
                            patient.created_at
                          ).toLocaleDateString()
                        : "—"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default PatientRecords;