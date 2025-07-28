from flask import Blueprint, jsonify, request
from models import Answer, Question
from db import db
from utils import get_random_question
import pytz


interview_bp = Blueprint('interview', __name__)

@interview_bp.route('/questions/random', methods=['GET'])
def get_random_question_route():
    question = get_random_question()
    if not question:
        return jsonify({"error": "No questions found"}), 404
    return jsonify({
        "id": question.id,
        "title": question.title,
        "category": question.category,
        "difficulty": question.difficulty
    })

@interview_bp.route('/questions/random_filtered', methods=['GET'])
def get_filtered_random_question():
    category = request.args.get('category')
    difficulty = request.args.get('difficulty')

    question = get_random_question(category, difficulty)
    if not question:
        return jsonify({"error": "No questions found"}), 404

    return jsonify({
        "id": question.id,
        "title": question.title,
        "category": question.category,
        "difficulty": question.difficulty
    })



@interview_bp.route('/answers', methods=['POST'])
def submit_answer_route():
    data = request.json
    if not data or 'question_id' not in data or 'user_name' not in data or 'user_answer' not in data:
        return jsonify({"error": "Invalid input"}), 400

    new_answer = Answer(
        question_id=data['question_id'],
        user_name=data['user_name'],
        user_answer=data['user_answer']
    )
    db.session.add(new_answer)
    db.session.commit()
    
    return jsonify({"message": "Answer submitted successfully"}), 201

@interview_bp.route('/user_answers', methods=['GET'])
def get_user_answers():
    user_name = request.args.get('user') 
    if not user_name:
        return jsonify({"error": "Missing username"}), 400

    answers = Answer.query.filter_by(user_name=user_name).all()
    result = []
    for a in answers:
        result.append({
            "question_id": a.question_id,
            "question": a.question.title,
            "user_answer": a.user_answer,
            "ideal_answer": a.question.ideal_answer,
            "timestamp": a.timestamp.astimezone(pytz.utc).isoformat()
        })
    return jsonify(result)

@interview_bp.route('/delete_answer_history', methods=['DELETE'])
def delete_answer_history():
    data = request.get_json()
    question_id = data.get("question_id")
    user_name = data.get("user_name")

    if not question_id or not user_name:
        return jsonify({"error": "Missing data"}), 400

    answer = Answer.query.filter_by(question_id=question_id, user_name=user_name).order_by(Answer.timestamp.desc()).first()

    if not answer:
        return jsonify({"error": "Answer not found"}), 404

    db.session.delete(answer)
    db.session.commit()
    return jsonify({"message": "Answer deleted successfully"}), 200


