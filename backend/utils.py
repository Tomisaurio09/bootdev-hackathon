import random
from models import Question

def get_random_question(category=None, difficulty=None):
    query = Question.query

    if category:
        query = query.filter_by(category=category)
    if difficulty:
        query = query.filter_by(difficulty=difficulty)

    questions = query.all()
    if not questions:
        return None

    return random.choice(questions)

