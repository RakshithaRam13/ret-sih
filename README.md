# 🩺 RET-SIH — AI-Powered Diabetic Retinopathy Screening System

## 📌 Overview

**RET-SIH** is an AI-powered retinal screening web application designed to assist in the early detection of **Diabetic Retinopathy (DR)** using retinal fundus images.

The system provides a web-based interface for healthcare professionals to:

* Register patient information
* Upload retinal images
* Perform AI-based screening
* View screening results
* View patient records
* Identify patients requiring specialist referral
* Track referral status
* Access a doctor/specialist dashboard

The project consists of a **React frontend** and a **Python Flask backend**, deployed separately using Vercel.

---

## 🌐 Live Demo

### Frontend

👉 https://ret-sih-v4vr.vercel.app

### Screening Page

👉 https://ret-sih-v4vr.vercel.app/screening

### Backend API

👉 https://ret-sih.vercel.app

The backend root endpoint should return:

```json
{
  "message": "SIH Backend is running!"
}
```

---

## 🏗️ Project Architecture

```text
                    ┌─────────────────────────┐
                    │     React Frontend      │
                    │                         │
                    │  Dashboard              │
                    │  New Screening          │
                    │  Patient Records        │
                    │  Specialist Referrals   │
                    │  Doctor Dashboard       │
                    └────────────┬────────────┘
                                 │
                                 │ REST API
                                 ▼
                    ┌─────────────────────────┐
                    │    Flask Backend        │
                    │                         │
                    │  Patient APIs           │
                    │  Screening APIs         │
                    │  Referral APIs          │
                    │  AI Prediction          │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │       Database          │
                    │                         │
                    │ Patient Records         │
                    │ Screening Results       │
                    │ Referral Information    │
                    └─────────────────────────┘
```

---

## 🛠️ Technologies Used

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* React Router
* Fetch API
* Local Storage

### Backend

* Python
* Flask
* Flask-CORS
* REST APIs

### AI / Machine Learning

* Python
* Image Processing
* Deep Learning / CNN-based retinal image classification

### Deployment

* Vercel — Frontend
* Vercel — Backend
* GitHub — Version Control

---

## ✨ Features

### 👤 Patient Management

* Add new patient
* Store patient information
* Patient ID generation
* Age and gender details
* Eye selection
* View previous screening records

### 🖼️ Retinal Image Screening

* Upload retinal fundus image
* Preview uploaded image
* Send image to AI backend
* Generate screening result
* Display prediction confidence

### 🧠 AI Screening

The system analyzes retinal images and provides an AI-assisted result.

Example results may include:

```text
No DR
Mild DR
Moderate DR
Severe DR
Proliferative DR
```

> The AI result is intended to assist healthcare professionals and should not replace professional medical diagnosis.

### 📋 Patient Records

The Patient Records section allows users to view:

* Patient name
* Patient ID
* Age
* Gender
* Eye
* Screening result
* Confidence
* Status
* Screening date

### 🩺 Specialist Referrals

Patients requiring further review can be displayed in the Specialist Referrals section.

The referral interface includes:

* Patient information
* AI result
* Confidence score
* Age
* Eye
* Referral status
* Specialist referral action

### 👨‍⚕️ Doctor Dashboard

The doctor interface is designed to provide access to:

* Patient screening information
* AI screening results
* Referral cases
* Patient history

---

## 📁 Project Structure

### Frontend

```text
ret-sih/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── Sidebar.js
│   │   ├── Navbar.js
│   │   └── StatCard.js
│   │
│   ├── pages/
│   │   ├── Dashboard.js
│   │   ├── NewScreening.js
│   │   ├── PatientRecords.js
│   │   ├── Referrals.js
│   │   └── Doctor.js
│   │
│   ├── App.js
│   ├── App.css
│   └── index.js
│
├── package.json
├── package-lock.json
└── README.md
```

### Backend

```text
sih-backend/
│
├── app.py
├── requirements.txt
├── model/
│
├── uploads/
│
├── api/
│
└── vercel.json
```

---

## 🔗 API Connection

The React frontend communicates with the deployed Flask backend.

### Backend URL

```text
https://ret-sih.vercel.app
```

Example API request:

```javascript
fetch("https://ret-sih.vercel.app/api/records")
```

Example referrals request:

```javascript
fetch("https://ret-sih.vercel.app/api/referrals")
```

### Important

Do not use:

```javascript
http://127.0.0.1:5000
```

or:

```javascript
http://localhost:5000
```

in the deployed frontend.

These addresses refer to the user's local computer and will not work for the deployed website.

---

## 🚀 Running the Frontend Locally

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Enter the project directory:

```bash
cd ret-sih
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The application will normally be available at:

```text
http://localhost:3000
```

---

## 🐍 Running the Backend Locally

Enter the backend directory:

```bash
cd backend
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Start Flask:

```bash
python app.py
```

The backend will normally run at:

```text
http://127.0.0.1:5000
```

---

## ☁️ Deployment

### Frontend Deployment

The React frontend is deployed on Vercel.

Production URL:

```text
https://ret-sih-v4vr.vercel.app
```

Updates can be deployed by pushing changes to the `main` branch:

```bash
git add .
git commit -m "Update frontend"
git push origin main
```

Vercel automatically creates a new production deployment.

### Backend Deployment

The Flask backend is deployed separately on Vercel.

Production URL:

```text
https://ret-sih.vercel.app
```

---

## 🔄 Application Flow

```text
1. Doctor opens the application
              ↓
2. Creates a new screening
              ↓
3. Enters patient information
              ↓
4. Uploads retinal fundus image
              ↓
5. Image is sent to Flask backend
              ↓
6. AI model analyzes the image
              ↓
7. Screening result is generated
              ↓
8. Result and confidence are displayed
              ↓
9. Patient record is stored
              ↓
10. High-risk cases can be referred
              ↓
11. Specialist reviews the case
```

---

## 🔐 Important Security Notes

This project is intended as a prototype / hackathon system.

For production deployment, additional security measures should be implemented, including:

* User authentication
* Role-based access control
* Secure patient data storage
* HTTPS-only communication
* Database encryption
* Secure image storage
* API authentication
* Input validation
* Rate limiting
* Audit logging
* Protection of medical information

---

## ⚠️ Medical Disclaimer

This application is an **AI-assisted screening prototype** and is not intended to replace a qualified ophthalmologist or other healthcare professional.

AI-generated results should be reviewed and interpreted by an appropriately qualified medical professional before making clinical decisions.

---

## 🎯 Future Improvements

Potential future enhancements include:

* Real-time AI inference
* Improved retinal image classification
* Explainable AI / heatmaps
* Grad-CAM visualization
* Doctor authentication
* Specialist authentication
* Patient history timeline
* Referral workflow
* Email/SMS notifications
* Cloud database integration
* Secure image storage
* PDF medical reports
* Advanced analytics dashboard
* Multi-hospital support
* Mobile application

---


### Smart India Hackathon — SIH

**Project:** RET-SIH
**Domain:** Healthcare / Artificial Intelligence
**Focus:** AI-Assisted Diabetic Retinopathy Screening

---

## 📜 License

This project is developed for educational, research, and hackathon purposes.

© 2026 RET-SIH Team

```
```
