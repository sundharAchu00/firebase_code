import sqlite3
import bcrypt

# Ensure tables are created when the module is imported
create_tables()

def create_tables():
    """
    Creates the database 'main.db' and all the tables defined in the schema.
    """
    conn = None  # Initialize connection variable to None
    try:
        # Connect to the SQLite database (creates it if it doesn't exist)
        conn = sqlite3.connect('main.db')
        cursor = conn.cursor()

        # Create the users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL
            )
        """)

        # Create the training_plans table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS training_plans (
                plan_id INTEGER PRIMARY KEY,
                user_id INTEGER,
                plan_content TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            )
        """)

        # Create the employee_feedback table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS employee_feedback (
                feedback_id INTEGER PRIMARY KEY,
                user_id INTEGER,
                feedback_content TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            )
        """)

        # Create the job_descriptions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS job_descriptions (
                description_id INTEGER PRIMARY KEY,
                user_id INTEGER,
                description_content TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            )
        """)
        
        # Create the study_material table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS study_material (
                material_id INTEGER PRIMARY KEY,
                material_content TEXT NOT NULL
            )
        """)

        # Create the chatbot_interactions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS chatbot_interactions (
                interaction_id INTEGER PRIMARY KEY,
                user_id INTEGER,
                message TEXT NOT NULL,
                timestamp DATETIME NOT NULL,
                type TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            )
        """)
        
        # Create the crew_results table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS crew_results (
                result_id INTEGER PRIMARY KEY,
                user_id INTEGER,
                timestamp DATETIME,
                result_content TEXT,
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            )
        """)

        # Commit the changes and close the connection
        conn.commit()
    
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")

    finally:
        if conn:
            conn.close()
            
def register_user(username, password, role):
    """
    Registers a new user in the database.

    Args:
        username (str): The username for the new user.
        password (str): The password for the new user.
        role (str): The role of the new user ('supervisor' or 'employee').

    Returns:
        bool: True if registration was successful, False otherwise.
    """
    conn = None
    try:
        conn = sqlite3.connect('main.db')
        cursor = conn.cursor()

        # Check if the username already exists
        cursor.execute("SELECT 1 FROM users WHERE username = ?", (username,))
        if cursor.fetchone():
            print(f"Username '{username}' already exists.")
            return False

        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Insert the new user into the database
        cursor.execute("""
            INSERT INTO users (username, password_hash, role)
            VALUES (?, ?, ?)
        """, (username, hashed_password.decode('utf-8'), role))

        conn.commit()
        print(f"User '{username}' registered successfully.")
        return True

    except sqlite3.Error as e:
        print(f"An error occurred during registration: {e}")
        return False

    finally:
        if conn:
            conn.close()

def login_user(username, password):
    """
    Logs in a user by verifying their credentials.

    Args:
        username (str): The username of the user.
        password (str): The password provided by the user.

    Returns:
        bool: True if login is successful (username exists and password matches), False otherwise.
    """
    conn = None
    try:
        conn = sqlite3.connect('main.db')
        cursor = conn.cursor()

        # Retrieve the user's information from the database
        cursor.execute("SELECT password_hash FROM users WHERE username = ?", (username,))
        result = cursor.fetchone()

        if result:
            hashed_password = result[0]
            # Verify the password
            if bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8')):
                print(f"User '{username}' logged in successfully.")
                return True
            else:
                print("Incorrect password.")
                return False
        else:
            print(f"User '{username}' not found.")
            return False

    except sqlite3.Error as e:
        print(f"An error occurred during login: {e}")
        return False

    finally:
        if conn:
            conn.close()

def get_user_by_username(username):
    """
    Retrieves user data from the database based on the username.

    Args:
        username (str): The username of the user to retrieve.

    Returns:
        tuple or None: A tuple containing user data (username, password_hash, role) if the user exists,
                       None otherwise.
    """
    conn = sqlite3.connect('main.db')
    cursor = conn.cursor()
    cursor.execute("SELECT user_id, username, password_hash, role FROM users WHERE username = ?", (username,))
    user_data = cursor.fetchone()
    conn.close()
    return user_data

def add_crew_result(user_id, result_content):
    """
    Adds a new crew result to the database.

    Args:
        user_id (int): The ID of the user associated with the result.
        result_content (str): The content of the crew result.

    Returns:
        bool: True if the result was added successfully, False otherwise.
    """
    conn = None
    try:
        conn = sqlite3.connect('main.db')
        cursor = conn.cursor()

        # Insert the new crew result into the database with the current timestamp
        cursor.execute("""
            INSERT INTO crew_results (user_id, timestamp, result_content)
            VALUES (?, datetime('now'), ?)
        """, (user_id, result_content))

        conn.commit()
        print(f"Crew result added successfully for user ID: {user_id}.")
        return True

    except sqlite3.Error as e:
        print(f"An error occurred while adding the crew result: {e}")
        return False

    finally:
        if conn:
            conn.close()
