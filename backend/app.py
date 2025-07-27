from flask import Flask
from flask_cors import CORS
from db import db
from routes.interview import interview_bp
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / 'file.env')

def create_app():

    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    CORS(app, origins=["https://bootdev-hackathon-brv0rufzr-tomisaurio09s-projects.vercel.app/"])

    app.register_blueprint(interview_bp)

    with app.app_context():
        db.create_all()

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))  
    app.run(host='0.0.0.0', port=port)        
