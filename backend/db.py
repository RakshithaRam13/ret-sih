import mysql.connector


def get_db_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="rakshitha",
        database="sih_project"
    )

    return connection