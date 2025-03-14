# Septa Delays

This document proposes a web-based application for tracking SEPTA Regional Rail delays and real-time train locations. The application will leverage the SEPTA API to process and display real-time data on train routes, schedules, and delay statuses. Users will be able to access this data via a modern, intuitive interface that includes an interactive map.

Unlike general transit tracking apps, this application is exclusively designed for SEPTA’s Regional Rail system, incorporating real-time tracking, delay notifications, and predictive delay insights (if feasible within the timeline). This project aims to provide commuters, tourists, and daily transit riders with improved trip planning, reduced travel uncertainty, and a seamless experience when navigating SEPTA’s rail network.

High-Level Requirement
The SEPTA Delays Tracking Application will:

Track real-time train locations via API integration.
Provide live delay notifications for regional rail lines.
Display an interactive map showing train positions.
Offer a user-friendly UI optimized for both desktop and mobile browsers.
From a user perspective, this application provides clear and concise train updates without requiring complex filtering or navigation. Users will quickly see whether their train is running on time, its current location, and if they need to adjust their travel plans.

Conceptual Design
The application will be built as a web-based platform with the following architecture:

Software Architecture & Technology Stack:
Frontend: HTML, CSS, JavaScript
Backend (Optional): Node.js for API management
API Handling: Fetch API or Axios for data retrieval
Mapping & Visualization: Google Maps API, Leaflet.js, OpenStreetMap API
UI Styling: Bootstrap or Tailwind CSS
Core Features:
Live Train Tracking: Fetches real-time train location data from the SEPTA API.
Delay Alerts: Highlights delayed trains and alerts users.
Interactive Map View: Displays train positions dynamically.
Predictive Delay Insights (Stretch Goal): Uses historical data to estimate potential future disruptions.
Required Resources
Background Knowledge & Learning Areas
Web Development: Proficiency in HTML, CSS, JavaScript.
API Handling & Data Processing: Experience using Fetch API, JSON Data Processing.
Geographic Visualization: Understanding Google Maps API, OpenStreetMap API.
Frontend Design: Familiarity with UI/UX principles for accessibility and usability.
Backend (Maybe): Basic Node.js for additional data processing.

Hardware Requirements
A pc.

Software Resources:
Version Control: GitHub for collaboration and version tracking.
Potential Hosting: Render.com, Firebase, or GitHub Pages for deployment.
If external resources outside the standard Computer Science Department lab resources are needed, they will be identified early and discussed with the instructor.

Background & References
This project builds upon existing open-source SEPTA tracking applications, including:

IsSeptaFcked – A text-based program for tracking SEPTA train statuses.
septaTrains – A basic SEPTA regional rail delay tracker.
TrainTracker – Implements train tracking logic and real-time data integration.
