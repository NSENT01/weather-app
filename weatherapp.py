from flask import Flask, render_template, jsonify, request
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
API_KEY = os.getenv("OPEN_WEATHERMAP_API")
BASE_URL = 'https://api.openweathermap.org/data/2.5/'
if not API_KEY:
    raise ValueError("OPEN_WEATHERMAP_API key not set in .env")


@app.route("/")
def index():
	return render_template("index.html")

@app.route("/weather")
def getweather():
	city = request.args.get("city")
	if not city:
		return jsonify({'error':'City parameter is required'}), 400
	coords = requests.get(
		f"https://api.openweathermap.org/geo/1.0/direct?q={city}&appid={API_KEY}"
		).json()
	if not coords or len(coords) == 0:
		return jsonify({'error': 'City not found'}), 404
	lat = coords[0]['lat']
	lon = coords[0]['lon']
	weather = requests.get(
		f"{BASE_URL}weather?lat={lat}&lon={lon}&appid={API_KEY}&units=imperial"
        ).json()
	return jsonify(weather)

@app.route("/forecast")
def forecast():
	city = request.args.get("city")
	if not city:
		return jsonify({'error': 'City parameter is required'}), 400
	coords = requests.get(
		f"https://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={API_KEY}"
		).json()
	if not coords or len(coords) == 0:
		return jsonify({'error': 'City not found'}), 404
	lat = coords[0]['lat']
	lon = coords[0]['lon']
	forecast = requests.get(
		f"{BASE_URL}forecast?lat={lat}&lon={lon}&appid={API_KEY}&units=imperial"
        ).json()
	return jsonify(forecast)


	
    