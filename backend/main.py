import os
from flask import Flask
from flask_cors import CORS

from backend.app.routes import auth, movies, people, profile, awards, admin

def create_app():
    
    static_folder_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
    
    app = Flask(__name__, static_folder=static_folder_path)
    
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    app.register_blueprint(auth.bp)
    app.register_blueprint(movies.bp)
    app.register_blueprint(people.bp)
    app.register_blueprint(profile.bp)
    app.register_blueprint(awards.bp)
    app.register_blueprint(admin.bp)
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="127.0.0.1", port=5000, debug=True)