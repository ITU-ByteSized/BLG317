from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/movies")
def movies():
    data = [ # Sample movie data
        {"id": 1, "title": "The Prestige", "year": 2006},
        {"id": 2, "title": "Interstellar", "year": 2014},
        {"id": 3, "title": "Ford V Ferrari", "year": 2019},
    ]
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
