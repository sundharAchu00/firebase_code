from flask import Flask, request, jsonify, json
import db_manager
import crew_manager
import chatbot_manager

app = Flask(__name__)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data or 'role' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    username = data['username']
    password = data['password']
    role = data['role']
    
    if db_manager.register_user(username, password, role):
        return jsonify({'message': 'User registered successfully'}), 201
    else:
        return jsonify({'error': 'User registration failed'}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Missing required fields'}), 400

    user = db_manager.get_user_by_username(data['username'])

    if user and db_manager.login_user(data['username'], data['password']):
        return jsonify({'message': 'Login successful', 'username': user[1], 'role': user[3]}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/get-crew-result/<int:user_id>', methods=['GET'])
def get_crew_result(user_id):
    result = db_manager.get_last_crew_result(user_id)
    if result:
        return jsonify({'result': result}), 200
    else:
        return jsonify({'error': 'No result found'}, 404)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({'error': 'Missing message'}), 400
    
    message = data['message']
    response = chatbot_manager.get_response(message)
    return jsonify({'reply': response})

@app.route('/run-crew', methods=['POST'])
def run_crew():
    data = request.get_json()
    if not data or 'user_id' not in data:
        return jsonify({'error': 'Missing required fields'}), 400

    user_id = data['user_id']
    # Hardcoded paths for the files
    feedback_pdf_path = "docs/employee_feedback.txt"
    job_description_pdf_path = "docs/job_description.txt"
    excel_path = "docs/study_material.xlsx"
    study_material_pdf_path = "docs/study_material.txt"
    result = crew_manager.run(feedback_pdf_path, job_description_pdf_path, excel_path, study_material_pdf_path, user_id)
    return jsonify({'result': result}), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)