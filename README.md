Aviation Arrivals & Departures – Frontend
Overview

This repository contains the frontend for the Aviation Arrivals & Departures full-stack application built for the Semester 4 Final Sprint.

The frontend is a React application (Vite) that consumes a Spring Boot REST API to display real-time arrivals and departures for multiple airports, along with an admin interface to manage flights.

The application is fully Dockerized, follows clean UI practices, and communicates with the backend using RESTful HTTP requests.

Tech Stack

React 18

Vite

JavaScript (ES6+)

HTML5 / CSS

Nginx (Production Build)

Docker

GitHub Actions (CI)

Features
Public Board

View Arrivals and Departures

Switch between multiple airports

Live data loaded from backend API

Clean, responsive layout

Admin Section

Create new flights

Update flight status

Delete flights

Changes persist directly to the database

Backend Dependency

This frontend communicates with the Aviation Spring Boot API.

Backend repo (example):

https://github.com/<your-username>/aviation-api


API base URL is configured using environment variables.

⚙Environment Configuration
.env
VITE_API_BASE_URL=http://localhost:8080


In Docker, the frontend communicates with the API using the internal Docker network.
 
Running Locally (Development)
1Install dependencies
npm install

Start dev server
npm run dev


Frontend will be available at:

http://localhost:5173

Running with Docker (Production)

This frontend is designed to run as part of the full stack Docker Compose setup.

Build image
docker build -t aviation-frontend .

Run container
docker run -p 5173:80 aviation-frontend


In production, the app is served via Nginx.

Testing

Manual UI testing based on user stories

CRUD operations verified through admin interface

API connectivity validated through live data rendering

Manual testing scenarios are documented as user stories in the project submission.

CI / GitHub Actions

This repository includes a GitHub Actions workflow that:

Builds the React application

Ensures dependencies install correctly

Validates production build on pull requests

This enforces code quality before merging to the main branch.

Clean Code Practices

Modular component structure

Clear separation between public and admin views

Centralized API configuration

Simple, readable state management

Defensive error handling for API calls

Deployment Readiness (AWS)

The frontend is deployment-ready for AWS:

Can be hosted on S3 Static Website Hosting

Or served via EC2 / ECS with Nginx

Environment variables allow flexible API endpoint configuration

Team Collaboration

Trunk-based development workflow

Feature branches used

Pull Requests opened and reviewed

GitHub Actions enforced before merge

Demo Video

A full demo video showcasing:

Application functionality

Docker setup

API integration

Admin CRUD features

Link provided in Teams submission.

License

This project was created for educational purposes as part of the Keyin College Software Development Program.