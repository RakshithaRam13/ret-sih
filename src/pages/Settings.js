import React, { useState } from "react";

function Settings() {

  const [notifications, setNotifications] =
    useState(true);

  const [autoReferral, setAutoReferral] =
    useState(true);


  return (

    <div className="page">

      <div className="page-heading">

        <div>

          <h2>Settings</h2>

          <p>
            Manage your screening preferences
          </p>

        </div>

      </div>


      <div className="settings-grid">


        <div className="panel">

          <h3>
            AI Screening Settings
          </h3>

          <p className="panel-description">
            Configure how the screening system
            behaves.
          </p>


          <div className="setting-row">

            <div>

              <strong>
                Automatic Referral
              </strong>

              <p>
                Recommend specialist referral
                for high-risk cases.
              </p>

            </div>


            <button
              className={
                autoReferral
                  ? "toggle active"
                  : "toggle"
              }
              onClick={() =>
                setAutoReferral(!autoReferral)
              }
            >

              <span></span>

            </button>

          </div>


          <div className="setting-row">

            <div>

              <strong>
                Notifications
              </strong>

              <p>
                Receive alerts for new screening
                results.
              </p>

            </div>


            <button
              className={
                notifications
                  ? "toggle active"
                  : "toggle"
              }
              onClick={() =>
                setNotifications(!notifications)
              }
            >

              <span></span>

            </button>

          </div>

        </div>


        <div className="panel">

          <h3>
            System Information
          </h3>


          <div className="system-info">

            <div>

              <span>
                AI Model
              </span>

              <strong>
                RetinaExplain v1.0
              </strong>

            </div>


            <div>

              <span>
                Model Type
              </span>

              <strong>
                CNN / Explainable AI
              </strong>

            </div>


            <div>

              <span>
                Explainability
              </span>

              <strong className="online">
                ● Enabled
              </strong>

            </div>


            <div>

              <span>
                System Status
              </span>

              <strong className="online">
                ● Online
              </strong>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Settings;