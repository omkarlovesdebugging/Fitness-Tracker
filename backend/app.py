# backend/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
from pymongo import MongoClient
from bson.objectid import ObjectId
from otp_utils import generate_otp, send_otp_email, otp_expiry_time
from dotenv import load_dotenv
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True)

# Setup JWT
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'dev-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
jwt = JWTManager(app)

# Setup MongoDB
mongo_uri = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/fitness_tracker')
client = MongoClient(mongo_uri)
db = client.get_database()

# Collections
users = db.users
food_entries = db.food_entries
exercise_entries = db.exercise_entries

# Helper functions
def calculate_bmr(weight, height, age, gender):
    if gender == 'male':
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    else:
        return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)

def calculate_tdee(bmr, activity_level):
    activity_multipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'veryActive': 1.9
    }
    return bmr * activity_multipliers.get(activity_level, 1.2)

def calculate_calorie_goal(tdee, goal):
    goals = {
        'lose': tdee - 500,  # Deficit for weight loss
        'maintain': tdee,    # Maintenance
        'gain': tdee + 500   # Surplus for weight gain
    }
    return goals.get(goal, tdee)

def serialize_doc(doc):
    if doc.get('_id'):
        doc['_id'] = str(doc['_id'])
    return doc

# Error handling
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(400)
def bad_request(error):
    return jsonify({"error": "Bad request"}), 400

@app.errorhandler(401)
def unauthorized(error):
    return jsonify({"error": "Unauthorized"}), 401

# OTP-based Email Verification
import traceback

@app.route('/api/auth/request-otp', methods=['POST'])
def request_otp():
    data = request.json
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    user = users.find_one({'email': email})
    if not user:
        return jsonify({'error': 'Email not registered'}), 404
    otp = generate_otp()
    expiry = otp_expiry_time()
    users.update_one({'email': email}, {'$set': {'otp': otp, 'otp_expiry': expiry}})
    try:
        # Check SMTP environment variables
        smtp_vars = ['SMTP_SERVER', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD']
        missing_vars = [var for var in smtp_vars if not os.environ.get(var)]
        if missing_vars:
            print(f"[ERROR] Missing SMTP environment variables: {', '.join(missing_vars)}")
            return jsonify({'error': f'Missing SMTP config: {', '.join(missing_vars)}'}), 500
        send_otp_email(email, otp)
    except Exception as e:
        print('[ERROR] Exception in /api/auth/request-otp:', str(e))
        traceback.print_exc()
        return jsonify({'error': f'Failed to send OTP: {str(e)}'}), 500
    return jsonify({'message': 'OTP sent to email'}), 200

@app.route('/api/auth/verify-otp', methods=['POST'])
def verify_otp():
    try:
        data = request.json
        email = data.get('email')
        otp = data.get('otp')
        if not email or not otp:
            return jsonify({'error': 'Email and OTP are required'}), 400
        user = users.find_one({'email': email})
        if not user or 'otp' not in user or 'otp_expiry' not in user:
            return jsonify({'error': 'OTP not requested or expired'}), 400
        if user['otp'] != otp:
            return jsonify({'error': 'Invalid OTP'}), 401
        if datetime.utcnow() > user['otp_expiry']:
            return jsonify({'error': 'OTP expired'}), 401
        # OTP valid, clear OTP fields and log in user
        users.update_one({'email': email}, {'$unset': {'otp': '', 'otp_expiry': ''}})
        access_token = create_access_token(identity=str(user['_id']))
        user_data = {k: v for k, v in user.items() if k not in ['password', 'otp', 'otp_expiry']}
        user_data['_id'] = str(user_data['_id'])
        return jsonify({'user': user_data, 'access_token': access_token}), 200
    except Exception as e:
        print('[ERROR] Exception in /api/auth/verify-otp:', str(e))
        traceback.print_exc()
        return jsonify({'error': f'Failed to verify OTP: {str(e)}'}), 500

# ---- AUTH ROUTES ----
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    
    # Check if email already exists
    if users.find_one({'email': data.get('email')}):
        return jsonify({"error": "Email already registered"}), 400
    
    # Hash password
    hashed_password = generate_password_hash(data.get('password'))
    
    # Calculate calorie goal
    bmr = calculate_bmr(
        float(data.get('weight')),
        float(data.get('height')),
        int(data.get('age')),
        data.get('gender')
    )
    tdee = calculate_tdee(bmr, data.get('activityLevel'))
    calorie_goal = calculate_calorie_goal(tdee, data.get('goal'))
    
    # Create user
    user = {
        'name': data.get('name'),
        'email': data.get('email'),
        'password': hashed_password,
        'weight': float(data.get('weight')),
        'height': float(data.get('height')),
        'age': int(data.get('age')),
        'gender': data.get('gender'),
        'activityLevel': data.get('activityLevel'),
        'goal': data.get('goal'),
        'calorieGoal': round(calorie_goal),
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    }
    
    result = users.insert_one(user)
    
    # Create JWT token
    access_token = create_access_token(identity=str(result.inserted_id))
    
    # Return user info without password
    user.pop('password', None)
    user['_id'] = str(result.inserted_id)
    
    return jsonify({
        'user': user,
        'access_token': access_token
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    # Find user
    user = users.find_one({'email': email})
    
    if not user or not check_password_hash(user.get('password'), password):
        return jsonify({"error": "Invalid credentials"}), 401
    
    # Create JWT token
    access_token = create_access_token(identity=str(user['_id']))
    
    # Return user info without password
    user_data = {k: v for k, v in user.items() if k != 'password'}
    user_data['_id'] = str(user_data['_id'])
    
    return jsonify({
        'user': user_data,
        'access_token': access_token
    }), 200

@app.route('/api/auth/status', methods=['GET'])
@jwt_required()
def auth_status():
    current_user_id = get_jwt_identity()
    user = users.find_one({'_id': ObjectId(current_user_id)})
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Return user info without password
    user_data = {k: v for k, v in user.items() if k != 'password'}
    user_data['_id'] = str(user_data['_id'])
    
    return jsonify(user_data), 200

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    # Frontend will handle token removal
    return jsonify({"message": "Logged out successfully"}), 200

@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = users.find_one({'_id': ObjectId(current_user_id)})
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Return user info without password
    user_data = {k: v for k, v in user.items() if k != 'password'}
    user_data['_id'] = str(user_data['_id'])
    
    return jsonify(user_data), 200

@app.route('/api/user/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    data = request.json
    
    # Get user
    user = users.find_one({'_id': ObjectId(current_user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Update fields
    updates = {
        'name': data.get('name', user.get('name')),
        'weight': float(data.get('weight', user.get('weight'))),
        'height': float(data.get('height', user.get('height'))),
        'age': int(data.get('age', user.get('age'))),
        'gender': data.get('gender', user.get('gender')),
        'activityLevel': data.get('activityLevel', user.get('activityLevel')),
        'goal': data.get('goal', user.get('goal')),
        'updated_at': datetime.utcnow()
    }
    
    # Recalculate calorie goal if relevant data changed
    if any(key in data for key in ['weight', 'height', 'age', 'gender', 'activityLevel', 'goal']):
        bmr = calculate_bmr(
            updates['weight'],
            updates['height'],
            updates['age'],
            updates['gender']
        )
        tdee = calculate_tdee(bmr, updates['activityLevel'])
        updates['calorieGoal'] = round(calculate_calorie_goal(tdee, updates['goal']))
    
    # Update user in database
    result = users.update_one(
        {'_id': ObjectId(current_user_id)},
        {'$set': updates}
    )
    
    if result.modified_count == 0:
        return jsonify({"message": "No changes made"}), 200
    
    # Get updated user
    updated_user = users.find_one({'_id': ObjectId(current_user_id)})
    user_data = {k: v for k, v in updated_user.items() if k != 'password'}
    user_data['_id'] = str(user_data['_id'])
    
    return jsonify(user_data), 200

@app.route('/api/user/calorie-goal', methods=['PUT'])
@jwt_required()
def update_calorie_goal():
    current_user_id = get_jwt_identity()
    data = request.json
    
    calorie_goal = data.get('calorieGoal')
    if not calorie_goal:
        return jsonify({"error": "Calorie goal is required"}), 400
    
    # Update user
    result = users.update_one(
        {'_id': ObjectId(current_user_id)},
        {'$set': {
            'calorieGoal': int(calorie_goal),
            'updated_at': datetime.utcnow()
        }}
    )
    
    if result.modified_count == 0:
        return jsonify({"message": "No changes made"}), 200
    
    return jsonify({"message": "Calorie goal updated successfully"}), 200

# Food entries
@app.route('/api/food', methods=['GET'])
@jwt_required()
def get_food_entries():
    current_user_id = get_jwt_identity()
    date = request.args.get('date')
    
    if not date:
        return jsonify({"error": "Date parameter is required"}), 400
    
    # Parse date
    try:
        query_date = datetime.strptime(date, '%Y-%m-%d')
        start_date = query_date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = query_date.replace(hour=23, minute=59, second=59, microsecond=999999)
    except ValueError:
        return jsonify({"error": "Invalid date format, use YYYY-MM-DD"}), 400
    
    # Query food entries
    entries = food_entries.find({
        'user_id': current_user_id,
        'date': {'$gte': start_date, '$lte': end_date}
    }).sort('date', 1)
    
    result = [serialize_doc(entry) for entry in entries]
    return jsonify(result), 200

@app.route('/api/food', methods=['POST'])
@jwt_required()
def add_food_entry():
    current_user_id = get_jwt_identity()
    data = request.json
    
    # Validate required fields
    required_fields = ['name', 'calories', 'date', 'mealType']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Field '{field}' is required"}), 400
    
    # Parse date
    try:
        entry_date = datetime.strptime(data.get('date'), '%Y-%m-%d')
    except ValueError:
        return jsonify({"error": "Invalid date format, use YYYY-MM-DD"}), 400
    
    # Create food entry
    food_entry = {
        'user_id': current_user_id,
        'name': data.get('name'),
        'calories': int(data.get('calories')),
        'protein': float(data.get('protein', 0)),
        'carbs': float(data.get('carbs', 0)),
        'fat': float(data.get('fat', 0)),
        'date': entry_date,
        'mealType': data.get('mealType'),
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    }
    
    result = food_entries.insert_one(food_entry)
    food_entry['_id'] = str(result.inserted_id)
    
    return jsonify(food_entry), 201

@app.route('/api/food/<id>', methods=['PUT'])
@jwt_required()
def update_food_entry(id):
    current_user_id = get_jwt_identity()
    data = request.json
    
    # Validate food entry exists and belongs to user
    entry = food_entries.find_one({
        '_id': ObjectId(id),
        'user_id': current_user_id
    })
    
    if not entry:
        return jsonify({"error": "Food entry not found"}), 404
    
    # Parse date if provided
    entry_date = entry.get('date')
    if 'date' in data:
        try:
            entry_date = datetime.strptime(data.get('date'), '%Y-%m-%d')
        except ValueError:
            return jsonify({"error": "Invalid date format, use YYYY-MM-DD"}), 400
    
    # Update fields
    updates = {
        'name': data.get('name', entry.get('name')),
        'calories': int(data.get('calories', entry.get('calories'))),
        'protein': float(data.get('protein', entry.get('protein', 0))),
        'carbs': float(data.get('carbs', entry.get('carbs', 0))),
        'fat': float(data.get('fat', entry.get('fat', 0))),
        'date': entry_date,
        'mealType': data.get('mealType', entry.get('mealType')),
        'updated_at': datetime.utcnow()
    }
    
    result = food_entries.update_one(
        {'_id': ObjectId(id), 'user_id': current_user_id},
        {'$set': updates}
    )
    
    if result.modified_count == 0:
        return jsonify({"message": "No changes made"}), 200
    
    # Get updated entry
    updated_entry = food_entries.find_one({'_id': ObjectId(id)})
    return jsonify(serialize_doc(updated_entry)), 200

@app.route('/api/food/<id>', methods=['DELETE'])
@jwt_required()
def delete_food_entry(id):
    current_user_id = get_jwt_identity()
    
    # Validate food entry exists and belongs to user
    entry = food_entries.find_one({
        '_id': ObjectId(id),
        'user_id': current_user_id
    })
    
    if not entry:
        return jsonify({"error": "Food entry not found"}), 404
    
    result = food_entries.delete_one({'_id': ObjectId(id), 'user_id': current_user_id})
    
    if result.deleted_count == 0:
        return jsonify({"error": "Failed to delete food entry"}), 500
    
    return jsonify({"message": "Food entry deleted successfully"}), 200

# Exercise entries
@app.route('/api/exercise', methods=['GET'])
@jwt_required()
def get_exercise_entries():
    current_user_id = get_jwt_identity()
    date = request.args.get('date')
    
    if not date:
        return jsonify({"error": "Date parameter is required"}), 400
    
    # Parse date
    try:
        query_date = datetime.strptime(date, '%Y-%m-%d')
        start_date = query_date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = query_date.replace(hour=23, minute=59, second=59, microsecond=999999)
    except ValueError:
        return jsonify({"error": "Invalid date format, use YYYY-MM-DD"}), 400
    
    # Query exercise entries
    entries = exercise_entries.find({
        'user_id': current_user_id,
        'date': {'$gte': start_date, '$lte': end_date}
    }).sort('date', 1)
    
    result = [serialize_doc(entry) for entry in entries]
    return jsonify(result), 200

@app.route('/api/exercise', methods=['POST'])
@jwt_required()
def add_exercise_entry():
    current_user_id = get_jwt_identity()
    data = request.json
    
    # Validate required fields
    required_fields = ['name', 'duration', 'caloriesBurned', 'date', 'exerciseType']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Field '{field}' is required"}), 400
    
    # Parse date
    try:
        entry_date = datetime.strptime(data.get('date'), '%Y-%m-%d')
    except ValueError:
        return jsonify({"error": "Invalid date format, use YYYY-MM-DD"}), 400
    
    # Create exercise entry
    exercise_entry = {
        'user_id': current_user_id,
        'name': data.get('name'),
        'duration': int(data.get('duration')),
        'caloriesBurned': int(data.get('caloriesBurned')),
        'date': entry_date,
        'exerciseType': data.get('exerciseType'),
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    }
    
    result = exercise_entries.insert_one(exercise_entry)
    exercise_entry['_id'] = str(result.inserted_id)
    
    return jsonify(exercise_entry), 201

@app.route('/api/exercise/<id>', methods=['PUT'])
@jwt_required()
def update_exercise_entry(id):
    current_user_id = get_jwt_identity()
    data = request.json
    
    # Validate exercise entry exists and belongs to user
    entry = exercise_entries.find_one({
        '_id': ObjectId(id),
        'user_id': current_user_id
    })
    
    if not entry:
        return jsonify({"error": "Exercise entry not found"}), 404
    
    # Parse date if provided
    entry_date = entry.get('date')
    if 'date' in data:
        try:
            entry_date = datetime.strptime(data.get('date'), '%Y-%m-%d')
        except ValueError:
            return jsonify({"error": "Invalid date format, use YYYY-MM-DD"}), 400
    
    # Update fields
    updates = {
        'name': data.get('name', entry.get('name')),
        'duration': int(data.get('duration', entry.get('duration'))),
        'caloriesBurned': int(data.get('caloriesBurned', entry.get('caloriesBurned'))),
        'date': entry_date,
        'exerciseType': data.get('exerciseType', entry.get('exerciseType')),
        'updated_at': datetime.utcnow()
    }
    
    result = exercise_entries.update_one(
        {'_id': ObjectId(id), 'user_id': current_user_id},
        {'$set': updates}
    )
    
    if result.modified_count == 0:
        return jsonify({"message": "No changes made"}), 200
    
    # Get updated entry
    updated_entry = exercise_entries.find_one({'_id': ObjectId(id)})
    return jsonify(serialize_doc(updated_entry)), 200

@app.route('/api/exercise/<id>', methods=['DELETE'])
@jwt_required()
def delete_exercise_entry(id):
    current_user_id = get_jwt_identity()
    
    # Validate exercise entry exists and belongs to user
    entry = exercise_entries.find_one({
        '_id': ObjectId(id),
        'user_id': current_user_id
    })
    
    if not entry:
        return jsonify({"error": "Exercise entry not found"}), 404
    
    result = exercise_entries.delete_one({'_id': ObjectId(id), 'user_id': current_user_id})
    
    if result.deleted_count == 0:
        return jsonify({"error": "Failed to delete exercise entry"}), 500
    
    return jsonify({"message": "Exercise entry deleted successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)