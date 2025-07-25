from flask import Blueprint, jsonify, request
from models import Question, Answer
from db import db
from utils import get_random_question


interview_bp = Blueprint('interview', __name__)

#So far everything works, but I need to add the ideal answer when the user submits an answer
#I have to do some changes, but i think that will be mostly in the frontend
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

#Its a little bit weird, but I think this is part of the frontend logic
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
    #Return the correct answer to the question so the user can see if his answer is correct
    return jsonify({"message": "Answer submitted successfully"}), 201

@interview_bp.route('/questions/<int:id>', methods=['GET'])
def get_question_by_id(id):
    question = Question.query.get(id)
    if not question:
        return jsonify({"error": "Question not found"}), 404
    return jsonify({
        "id": question.id,
        "title": question.title,
        "category": question.category,
        "difficulty": question.difficulty,
        "ideal_answer": question.ideal_answer
    })

@interview_bp.route('/answers', methods=['GET'])
def get_user_answers():
    user_name = request.args.get('user') #It takes the name from the URL
    if not user_name:
        return jsonify({"error": "Falta el nombre del usuario"}), 400

    answers = Answer.query.filter_by(user_name=user_name).all()
    result = []
    for a in answers:
        result.append({
            "question": a.question.title,
            "user_answer": a.user_answer,
            "ideal_answer": a.question.ideal_answer,
            "timestamp": a.timestamp.isoformat()
        })
    return jsonify(result)


"""
Personal function to add a question
This is not part of the API, but it can be used to add questions to the database:

@interview_bp.route("/post_question", methods=["POST"])
def post_question():
    data = request.json
    if not data or 'title' not in data or 'category' not in data or 'difficulty' not in data:
        return jsonify({"error": "Invalid input"}), 400

    new_question = Question(
        title=data['title'],
        category=data['category'],
        difficulty=data['difficulty'],
        ideal_answer=data.get('ideal_answer')  # Optional field
    )
    db.session.add(new_question)
    db.session.commit()
    return jsonify({"message": "Question added successfully"}), 201
"""