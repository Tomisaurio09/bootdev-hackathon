import random
from models import Question

#implementacion de paginacion con offset y limit para que no sea necesario cargar todas las preguntas a la vez
def get_random_question():
    questions = Question.query.all()
    if not questions:
        return None
    return random.choice(questions)
