from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_db_connection
import mysql.connector

app = Flask(__name__)

CORS(app)


# --------------------------------
# HOME
# --------------------------------

@app.route("/")
def home():
    return jsonify({
        "message": "SIH Backend is running!"
    })


# --------------------------------
# TEST DATABASE
# --------------------------------

@app.route("/api/test-db", methods=["GET"])
def test_db():

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT 1")
    result = cursor.fetchone()

    cursor.close()
    connection.close()

    return jsonify({
        "database": "MySQL connected!",
        "result": result[0]
    })


# --------------------------------
# GET PATIENT RECORDS
# --------------------------------

@app.route("/api/records", methods=["GET"])
def get_records():

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            id,
            patient_name,
            patient_id,
            age,
            gender,
            eye,
            result,
            confidence,
            status,
            created_at
        FROM records
        ORDER BY id DESC
    """)

    records = cursor.fetchall()

    cursor.close()
    connection.close()

    for record in records:
        if record.get("created_at"):
            record["created_at"] = str(record["created_at"])

    return jsonify(records)


# --------------------------------
# ADD PATIENT SCREENING
# --------------------------------

@app.route("/api/records", methods=["POST"])
def add_record():
    data = request.json

    name = data.get("name")
    patient_id = data.get("patientId")
    age = data.get("age")
    gender = data.get("gender")
    eye = data.get("eye")
    result = data.get("result")
    confidence = data.get("confidence")

    if not name or not age or not result:
        return jsonify({
            "error": "Patient name, age and result are required"
        }), 400

    if not patient_id:
        import random
        patient_id = f"RT-{random.randint(1000, 9999)}"

    # Values for the old columns
    title = name

    description = (
        f"Age: {age}, "
        f"Gender: {gender}, "
        f"Eye: {eye}, "
        f"Result: {result}, "
        f"Confidence: {confidence}%"
    )

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        sql = """
        INSERT INTO records
        (
            title,
            description,
            patient_name,
            patient_id,
            age,
            gender,
            eye,
            result,
            confidence,
            status
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(
            sql,
            (
                title,
                description,
                name,
                patient_id,
                age,
                gender,
                eye,
                result,
                confidence,
                "Verified"
            )
        )

        connection.commit()

        new_id = cursor.lastrowid

        return jsonify({
            "message": "Patient screening saved successfully",
            "id": new_id,
            "patientId": patient_id
        }), 201

    except mysql.connector.Error as error:
        connection.rollback()

        return jsonify({
            "error": str(error)
        }), 500

    finally:
        cursor.close()
        connection.close()

# --------------------------------
# DELETE RECORD
# --------------------------------

@app.route("/api/records/<int:id>", methods=["DELETE"])
def delete_record(id):

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        "DELETE FROM records WHERE id = %s",
        (id,)
    )

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "message": "Patient record deleted successfully"
    })




@app.route("/api/dashboard", methods=["GET"])
def dashboard():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # Total screenings
        cursor.execute("SELECT COUNT(*) AS total FROM records")
        total = cursor.fetchone()["total"]

        # Verified screenings
        cursor.execute("""
            SELECT COUNT(*) AS verified
            FROM records
            WHERE status = 'Verified'
        """)
        verified = cursor.fetchone()["verified"]

        # Moderate NPDR cases
        cursor.execute("""
            SELECT COUNT(*) AS moderate
            FROM records
            WHERE result = 'Moderate NPDR'
        """)
        moderate = cursor.fetchone()["moderate"]

        # Severe / advanced cases
        cursor.execute("""
            SELECT COUNT(*) AS severe
            FROM records
            WHERE result LIKE '%Severe%'
               OR result LIKE '%PDR%'
        """)
        severe = cursor.fetchone()["severe"]

        return jsonify({
            "total": total,
            "verified": verified,
            "moderate": moderate,
            "severe": severe
        })

    except mysql.connector.Error as error:
        return jsonify({
            "error": str(error)
        }), 500

    finally:
        cursor.close()
        connection.close()



@app.route("/api/referrals", methods=["GET"])
def get_referrals():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT *
            FROM referrals
            ORDER BY id DESC
        """)

        referrals = cursor.fetchall()

        for referral in referrals:
            if referral.get("created_at"):
                referral["created_at"] = str(referral["created_at"])

        return jsonify(referrals)

    except mysql.connector.Error as error:
        return jsonify({
            "error": str(error)
        }), 500

    finally:
        cursor.close()
        connection.close()


@app.route("/api/referrals", methods=["POST"])
def add_referral():
    data = request.json

    record_id = data.get("recordId")
    patient_name = data.get("patientName")
    patient_id = data.get("patientId")
    age = data.get("age")
    gender = data.get("gender")
    eye = data.get("eye")
    result = data.get("result")
    confidence = data.get("confidence")

    if not patient_name or not result:
        return jsonify({
            "error": "Patient name and result are required"
        }), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        sql = """
        INSERT INTO referrals
        (
            record_id,
            patient_name,
            patient_id,
            age,
            gender,
            eye,
            result,
            confidence,
            referral_status
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(
            sql,
            (
                record_id,
                patient_name,
                patient_id,
                age,
                gender,
                eye,
                result,
                confidence,
                "Pending"
            )
        )

        connection.commit()

        return jsonify({
            "message": "Patient referred successfully",
            "id": cursor.lastrowid
        }), 201

    except mysql.connector.Error as error:
        connection.rollback()

        return jsonify({
            "error": str(error)
        }), 500

    finally:
        cursor.close()
        connection.close()

# --------------------------------
# UPDATE REFERRAL STATUS (Verify / Send to Specialist)
# --------------------------------

@app.route("/api/referrals/<int:id>", methods=["PATCH"])
def update_referral_status(id):
    data = request.json
    new_status = data.get("referral_status")

    allowed_statuses = ["Pending", "Verified", "Referred"]

    if new_status not in allowed_statuses:
        return jsonify({
            "error": f"Invalid status. Must be one of {allowed_statuses}"
        }), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            "UPDATE referrals SET referral_status = %s WHERE id = %s",
            (new_status, id)
        )
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({
                "error": "Referral not found"
            }), 404

        return jsonify({
            "message": "Referral status updated successfully",
            "id": id,
            "referral_status": new_status
        })

    except mysql.connector.Error as error:
        connection.rollback()
        return jsonify({
            "error": str(error)
        }), 500

    finally:
        cursor.close()
        connection.close()

# --------------------------------
# RUN SERVER
# --------------------------------

if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )

@app.route("/api/test", methods=["GET", "OPTIONS"])
def test():
    return jsonify({"message": "Backend is working"})