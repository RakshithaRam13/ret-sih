import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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


  const sendToSpecialist = async () => {
  if (!patient.name || !patient.age || !result) {
    alert("Please complete the patient screening first.");
    return;
  }

  try {
    // First save the patient record
    const patientResponse = await fetch(
      "http://127.0.0.1:5000/api/records",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: patient.name,
          patientId:
            patient.patientId ||
            `RT-${Math.floor(1000 + Math.random() * 9000)}`,
          age: Number(patient.age),
          gender: patient.gender,
          eye: patient.eye,
          result: result.result,
          confidence: result.confidence
        })
      }
    );

    const patientData = await patientResponse.json();

    if (!patientResponse.ok) {
      throw new Error(patientData.error || "Failed to save patient");
    }

    // Then create the referral
    const referralResponse = await fetch(
      "http://127.0.0.1:5000/api/referrals",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          recordId: patientData.id,
          patientName: patient.name,
          patientId: patientData.patientId,
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
    console.error(error);
    alert(error.message);
  }
};

  // --------------------------------
  // SAVE PATIENT TO MYSQL
  // --------------------------------

  const savePatient = async () => {

    if (!result) {
      alert("Please analyze the image first.");
      return;
    }

    setSaving(true);

    const patientData = {

      name: patient.name,

      patientId:
        patient.patientId ||
        `RT-${Math.floor(
          1000 + Math.random() * 9000
        )}`,

      age: Number(patient.age),

      gender: patient.gender,

      eye: patient.eye,

      result: result.result,

      confidence: result.confidence

    };


    try {

      const response = await fetch(
        "http://127.0.0.1:5000/api/records",
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

        throw new Error(
          data.error || "Failed to save patient"
        );

      }


      alert(
        "Screening saved successfully!"
      );

      navigate("/patients");


    } catch (error) {

      console.error(error);

      alert(
        "Unable to save screening. Make sure Flask is running."
      );

    } finally {

      setSaving(false);

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
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "✓ Doctor Verification"}
            </button>


          <button
          className="specialist-button"
          onClick={sendToSpecialist}
          disabled={saving}
          >
        Send to Specialist →
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