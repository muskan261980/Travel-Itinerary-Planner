import json
import os

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai

# Load environment variables from backend/.env
load_dotenv()

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify(
        {
            "message": "Welcome to TravelMate!",
            "status": "Backend is running successfully",
        }
    )


@app.route("/api/health")
def health():
    return jsonify({"status": "healthy"})


@app.route("/api/plan-trip", methods=["POST"])
def plan_trip():
    data = request.get_json(silent=True) or {}

    destination = str(data.get("destination", "")).strip()

    if not destination:
        return jsonify({"error": "Destination is required"}), 400

    try:
        days = int(data.get("days", 3))
        travellers = int(data.get("travellers", 2))
        budget = float(data.get("budget", 10000))
    except (ValueError, TypeError):
        return (
            jsonify({"error": "Days, travellers and budget must be valid numbers"}),
            400,
        )

    if days < 1 or travellers < 1 or budget <= 0:
        return jsonify({"error": "Days, travellers and budget must be positive"}), 400

    if days > 14 or travellers > 20:
        return jsonify({"error": "Please choose up to 14 days and 20 travellers"}), 400

    travel_style = str(data.get("travelStyle", "Adventure"))
    interests = data.get("interests", [])

    if not isinstance(interests, list):
        interests = []

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        app.logger.error("GEMINI_API_KEY is missing from backend/.env")
        return (
            jsonify({"error": "Gemini API key is not configured. Check backend/.env."}),
            500,
        )

    prompt = f"""
You are TravelMate, a helpful travel itinerary planner.

Create a personalized travel itinerary using these preferences:
- Destination: {destination}
- Duration: {days} days
- Total budget: INR {budget:.2f}
- Number of travellers: {travellers}
- Travel style: {travel_style}
- Interests: {", ".join(str(i) for i in interests) or "General sightseeing"}

Return ONLY valid JSON without Markdown fences.

Use exactly this structure:
{{
  "summary": "A short description of the trip",
  "days": [
    {{
      "day": 1,
      "title": "Day title",
      "activities": [
        {{
          "time": "Morning",
          "activity": "Activity description",
          "location": "Place name",
          "estimatedCostINR": 500
        }}
      ]
    }}
  ],
  "budgetBreakdown": {{
    "accommodationINR": 0,
    "foodINR": 0,
    "transportINR": 0,
    "activitiesINR": 0,
    "miscellaneousINR": 0
  }},
  "travelTips": [
    "Useful practical tip"
  ]
}}

Requirements:
- Include exactly {days} day entries.
- Each day must include several useful activities.
- Each activity must have time, activity, location, and estimatedCostINR.
- Tailor activities to the interests and travel style.
- Keep costs reasonable for the destination and group size.
- Treat the budget as the total budget for all {travellers} travellers.
- Keep total estimated expenses within the budget where feasible.
- All costs must be numeric values in INR.
- Do not claim prices, opening hours, availability, or weather are verified live.
- Mention in the summary that prices are estimates.
- Return valid JSON with no extra text.
"""

    try:
        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "temperature": 0.7,
            },
        )

        if not response.text:
            app.logger.error("Gemini returned an empty response")
            return (
                jsonify(
                    {"error": "The AI returned an empty itinerary. Please try again."}
                ),
                502,
            )

        itinerary_data = json.loads(response.text)

        if not isinstance(itinerary_data, dict):
            raise ValueError("The AI response was not a JSON object")

        daily_plans = itinerary_data.get("days", [])

        if not isinstance(daily_plans, list) or len(daily_plans) != days:
            app.logger.error(
                "Gemini returned %s days; expected %s",
                len(daily_plans) if isinstance(daily_plans, list) else "invalid",
                days,
            )
            return (
                jsonify(
                    {
                        "error": (
                            "The AI returned an incomplete itinerary. "
                            "Please try generating it again."
                        )
                    }
                ),
                502,
            )

        # Preserve the requested details and the complete AI response.
        trip = {
            "destination": destination,
            "days": days,
            "budget": budget,
            "travellers": travellers,
            "travelStyle": travel_style,
            "interests": interests,
            "itinerary": itinerary_data,
        }

        return (
            jsonify(
                {
                    "message": "AI itinerary generated successfully",
                    "trip": trip,
                }
            ),
            200,
        )

    except json.JSONDecodeError:
        app.logger.exception("Gemini returned invalid JSON")
        return (
            jsonify({"error": "The AI returned unreadable data. Please try again."}),
            502,
        )

    except Exception as error:
        app.logger.exception("Gemini itinerary generation failed")
        error_message = str(error).lower()

        if "503" in error_message or "unavailable" in error_message:
            return (
                jsonify(
                    {
                        "error": (
                            "Gemini is temporarily busy. "
                            "Please wait a minute and try again."
                        )
                    }
                ),
                503,
            )

        if "429" in error_message or "resource_exhausted" in error_message:
            return (
                jsonify(
                    {
                        "error": (
                            "Gemini's current usage quota has been reached. "
                            "Please check your AI Studio quota and try again later."
                        )
                    }
                ),
                429,
            )

        if "api_key_invalid" in error_message or "invalid api key" in error_message:
            return (
                jsonify(
                    {"error": "The Gemini API key is invalid. Check backend/.env."}
                ),
                401,
            )

        if "403" in error_message or "permission_denied" in error_message:
            return (
                jsonify(
                    {
                        "error": (
                            "Gemini denied access to this model. "
                            "Check your API key and model access."
                        )
                    }
                ),
                403,
            )

        return (
            jsonify(
                {
                    "error": (
                        "Could not generate the itinerary. "
                        "Check the Flask terminal for the detailed error."
                    )
                }
            ),
            502,
        )


if __name__ == "__main__":
    app.run(debug=True, port=5000)
