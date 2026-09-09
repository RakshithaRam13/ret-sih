import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// TEMP: pointing to local Flask backend for testing.
// Switch back to your deployed Vercel URL once this is confirmed working:
// const API_BASE = "https://ret-sih-v4vr.vercel.app";
const API_BASE = "http://127.0.0.1:5000";

function NewScreening() {

  const navigate = useNavigate();

  const [patient, setPatient] = useState({
    name: "",
    age: "",
    gender: "",
    eye: "Right",
    patientId: ""
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  // NEW: tracks the saved record's id and whether it's been verified yet
  const [savedRecordId, setSavedRecordId] = useState(null);
  const [savedPatientId, setSavedPatientId] = useState(null);
  const [isVerified, setIsVerified] = useState(false);


  const handleChange = (e) => {

    setPatient({
      ...patient,
      [e.target.name]: e.target.value
    });

  };


  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );

  };


  const analyzeImage = () => {

    if (!patient.name || !patient.age || !image) {

      alert(
        "Please enter patient information and upload an image."
      );

      return;
    }

    setLoading(true);

    setTimeout(() => {

      const aiResult = {

        level: "Level 2 / 4",

        result: "Moderate NPDR",

        confidence: 87,

        evidence: [
          "Microaneurysms",
          "Hemorrhages",
          "Hard Exudates"
        ]

      };

      setResult(aiResult);

      setLoading(false);

    }, 1800);

  };


  // --------------------------------
  // STEP 1: DOCTOR VERIFICATION
  // Saves the record to MySQL exactly once, marks it verified locally.
  // --------------------------------

  const savePatient = async () => {

    if (!result) {
      alert("Please analyze the image first.");
      return;
    }

    // Already saved and verified — don't save again
    if (isVerified) {
      return;
    }

    setSaving(true);

    const generatedPatientId =
      patient.patientId ||
      `RT-${Math.floor(1000 + Math.random() * 9000)}`;

    const patientData = {
      name: patient.name,
      patientId: generatedPatientId,
      age: Number(patient.age),
      gender: patient.gender,
      eye: patient.eye,
      result: result.result,
      confidence: result.confidence
    };

    try {

      const response = await fetch(
        `${API_BASE}/api/records`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(patientData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save patient");
      }

      // Remember the saved record's id/patientId so sendToSpecialist
      // can reuse it instead of creating a duplicate record.
      setSavedRecordId(data.id);
      setSavedPatientId(data.patientId);
      setIsVerified(true);

      alert("Screening verified and saved successfully!");

    } catch (error) {

      console.error("SAVE SCREENING ERROR:", error);

      alert(
        `Unable to save screening: ${error.message}`
      );

    } finally {

      setSaving(false);

    }

  };


  // --------------------------------
  // STEP 2: SEND TO SPECIALIST
  // Only allowed after verification. Reuses the already-saved record
  // instead of inserting a second copy into `records`.
  // --------------------------------

  const sendToSpecialist = async () => {

    if (!isVerified || !savedRecordId) {
      alert("Please complete Doctor Verification first.");
      return;
    }

    setSending(true);

    try {

      const referralResponse = await fetch(
        `${API_BASE}/api/referrals`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            recordId: savedRecordId,
            patientName: patient.name,
            patientId: savedPatientId,
            age: Number(patient.age),
            gender: patient.gender,
            eye: patient.eye,
            result: result.result,
            confidence: result.confidence
          })
        }
      );

      const referralData = await referralResponse.json();

      if (!referralResponse.ok) {
        throw new Error(
          referralData.error || "Failed to create referral"
        );
      }

      alert("Patient successfully sent to specialist!");

      navigate("/referrals");

    } catch (error) {

      console.error("SEND TO SPECIALIST ERROR:", error);

      alert(error.message);

    } finally {

      setSending(false);

    }
  };


  return (

    <div className="page">

      <div className="page-heading">

        <div>

          <h2>New Screening</h2>

          <p>
            Upload a retinal image for AI-assisted analysis
          </p>

        </div>

      </div>


      {!result ? (

        <div className="screening-layout">

          <div className="panel">

            <h3>Patient Information</h3>

            <p className="panel-description">
              Enter patient details before uploading
              the retinal image.
            </p>


            <div className="form-grid">

              <div className="form-group">

                <label>Patient Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter patient name"
                  value={patient.name}
                  onChange={handleChange}
                />

              </div>


              <div className="form-group">

                <label>Patient ID</label>

                <input
                  type="text"
                  name="patientId"
                  placeholder="Optional"
                  value={patient.patientId}
                  onChange={handleChange}
                />

              </div>


              <div className="form-group">

                <label>Age</label>

                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={patient.age}
                  onChange={handleChange}
                />

              </div>


              <div className="form-group">

                <label>Gender</label>

                <select
                  name="gender"
                  value={patient.gender}
                  onChange={handleChange}
                >

                  <option value="">
                    Select gender
                  </option>

                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>

                </select>

              </div>


              <div className="form-group">

                <label>Eye</label>

                <select
                  name="eye"
                  value={patient.eye}
                  onChange={handleChange}
                >

                  <option>Right</option>
                  <option>Left</option>

                </select>

              </div>

            </div>

          </div>


          <div className="panel">

            <h3>Fundus Image</h3>

            <p className="panel-description">
              Upload a clear retinal fundus photograph.
            </p>


            {!preview ? (

              <label className="upload-box">

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                />

                <div className="upload-icon">
                  ☁
                </div>

                <h3>
                  Upload Fundus Image
                </h3>

                <p>
                  Click to browse or drag and drop
                </p>

                <span>
                  JPG, JPEG or PNG
                </span>

              </label>

            ) : (

              <div className="preview-container">

                <img
                  src={preview}
                  alt="Fundus preview"
                  className="fundus-preview"
                />

                <button
                  className="remove-image"
                  onClick={() => {
                    setPreview(null);
                    setImage(null);
                  }}
                >
                  Remove Image
                </button>

              </div>

            )}


            <button
              className="analyze-button"
              onClick={analyzeImage}
              disabled={loading}
            >

              {loading
                ? "Analyzing retinal image..."
                : "🤖 Analyze Image"}

            </button>


            {loading && (

              <div className="loader-area">

                <div className="loader"></div>

                <p>
                  AI is analyzing retinal features...
                </p>

              </div>

            )}

          </div>

        </div>

      ) : (

        <div className="result-page">

          <div className="result-header">

            <div>

              <h2>AI Screening Result</h2>

              <p>
                Analysis completed successfully
              </p>

            </div>

            <span className="ai-badge">
              ✓ AI Analysis Complete
            </span>

          </div>


          <div className="result-grid">

            <div className="panel">

              <div className="panel-header">

                <h3>Fundus Image</h3>

                <span className="quality-badge">
                  ✓ Good Quality
                </span>

              </div>

              <div className="image-display">

                <img
                  src={preview}
                  alt="Fundus"
                />

              </div>

              <div className="image-info">

                <span>
                  Patient: {patient.name}
                </span>

                <span>
                  Eye: {patient.eye}
                </span>

              </div>

            </div>


            <div className="panel">

              <div className="panel-header">

                <h3>Explainability Heatmap</h3>

                <span>AI Focus Areas</span>

              </div>

              <div className="heatmap-container">

                <img
                  src={preview}
                  alt="Heatmap"
                  className="heatmap-image"
                />

                <div className="heat-1"></div>
                <div className="heat-2"></div>
                <div className="heat-3"></div>
                <div className="heat-4"></div>

              </div>

              <p className="heatmap-info">

                Highlighted regions show areas
                that influenced the AI prediction.

              </p>

            </div>


            <div className="panel result-card">

              <div className="result-level">

                <span>
                  {result.level}
                </span>

                <h2>
                  {result.result}
                </h2>

                <p>
                  Moderate diabetic retinopathy
                </p>

              </div>


              <div className="confidence">

                <div className="confidence-header">

                  <span>
                    Confidence
                  </span>

                  <strong>
                    {result.confidence}%
                  </strong>

                </div>

                <div className="progress">

                  <div
                    style={{
                      width:
                        `${result.confidence}%`
                    }}
                  ></div>

                </div>

              </div>


              <div className="evidence">

                <h4>
                  Detected Evidence
                </h4>

                {result.evidence.map(
                  (item, index) => (

                    <span
                      key={index}
                      className="evidence-tag"
                    >
                      ✓ {item}
                    </span>

                  )
                )}

              </div>


              <div className="recommendation">

                ⚠ Referral Recommended

              </div>

            </div>

          </div>


          <div className="result-actions">

            <button
              className="secondary-button"
              onClick={() => setResult(null)}
            >
              ← New Analysis
            </button>


            <button
              className="verify-button"
              onClick={savePatient}
              disabled={saving || isVerified}
            >
              {saving
                ? "Saving..."
                : isVerified
                ? "✓ Verified"
                : "✓ Doctor Verification"}
            </button>


            <button
              className="specialist-button"
              onClick={sendToSpecialist}
              disabled={!isVerified || sending}
              title={
                !isVerified
                  ? "Complete Doctor Verification first"
                  : ""
              }
            >
              {sending ? "Sending..." : "Send to Specialist →"}
            </button>


            <button
              className="primary-button"
              onClick={() => window.print()}
            >
              ⇩ Download PDF Report
            </button>

          </div>

        </div>

      )}

    </div>

  );
}

export default NewScreening;