🌍 TravelMate — Personalized Travel Itinerary Planner

TravelMate is an AI-powered travel planning web application that generates personalized, day-wise travel itineraries based on a user's destination, trip duration, budget, number of travelers, travel style, and interests.

The project uses Google's Gemini API to help travelers plan trips quickly and discover activities suited to their preferences.

🚀 Live Demo

- Live Application: https://travel-itinerary-planner-two.vercel.app/
- Backend API: https://travel-itinerary-planner-f89p.onrender.com
- GitHub Repository: https://github.com/muskan261980/Travel-Itinerary-Planner

✨ Features

- 🌎 Plan trips to destinations around the world.
- 📅 Generate day-wise travel itineraries.
- 💰 Provide a budget to personalize trip planning.
- 👥 Specify the number of travelers.
- 🎯 Customize plans using travel styles and personal interests.
- 🤖 Generate itinerary suggestions using Google's Gemini API.
- 📱 Access the application through a web browser.
- ☁️ Deploy the frontend and backend independently.

🛠️ Technology Stack

Frontend

- React
- Vite
- JavaScript
- CSS

Backend

- Python
- Flask
- Flask-CORS

Generative AI

- Google Gemini API
- Google Gen AI Python SDK

Deployment

- Vercel — Frontend
- Render — Backend

Configuration

- Environment variables using "python-dotenv"

🏗️ Application Architecture

1. The user enters travel preferences through the React frontend.
2. The frontend sends a request to the Flask backend.
3. The backend validates the trip details and calls the Gemini API.
4. Gemini generates a personalized travel itinerary.
5. The backend returns the result to the frontend.
6. The frontend displays the generated itinerary to the user.

⚙️ Run Locally

Prerequisites

- Python 3.10 or later
- Node.js and npm
- A Google Gemini API key

1. Clone the repository

git clone https://github.com/muskan261980/Travel-Itinerary-Planner.git
cd Travel-Itinerary-Planner

2. Configure the backend

Open a terminal:

cd backend
python -m venv venv

Activate the virtual environment.

Windows PowerShell:

.\venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt

Create a ".env" file inside the "backend" directory:

GEMINI_API_KEY=your_gemini_api_key

Replace the placeholder with your own API key. Never commit the ".env" file or expose your API key publicly.

Start the backend:

python app.py

3. Configure the frontend

Open a second terminal from the repository root:

cd frontend
npm install

Create a ".env" file inside the "frontend" directory:

VITE_API_URL=http://127.0.0.1:5000

Start the development server:

npm run dev

Open the local URL displayed in your terminal.

🔐 Environment Variables

Variable| Purpose
"GEMINI_API_KEY"| Authenticates requests to Google's Gemini API on the backend
"VITE_API_URL"| Specifies the backend API base URL for the frontend

Keep API keys private. Only the public backend URL should be exposed to the frontend.

🌐 Deployment

- Frontend: Deployed on Vercel.
- Backend: Deployed on Render.
- AI Integration: Google's Gemini API.

The deployed frontend uses "VITE_API_URL" to communicate with the backend. The backend uses "GEMINI_API_KEY" to access the AI service.

⚠️ Limitations

- Generated itineraries are AI-generated suggestions and may contain inaccurate or outdated information.
- Prices and budget estimates should be independently verified.
- Opening hours, availability, transportation schedules, weather, and travel restrictions are not guaranteed to be live-verified.
- AI-generated travel plans should be reviewed before making bookings.

🔮 Future Enhancements

- Live weather integration.
- Maps and route optimization.
- Hotel and transportation recommendations.
- Real-time travel cost estimates.
- Saving, editing, and exporting itineraries.
- User accounts and saved trips.

🎓 Project Purpose

TravelMate was developed as a Generative AI learning project to demonstrate full-stack web development, API integration, AI-powered content generation, environment configuration, and cloud deployment.

---

Built with ❤️ using React, Flask, and Google Gemini AI.
