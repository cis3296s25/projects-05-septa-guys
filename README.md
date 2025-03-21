# Septa Delays

Project Board link: https://septaguys.atlassian.net/jira/core/projects/SEP/list?cloudId=99a5f171-4543-47e0-a223-3865a6db2eb9&source=projectBoard&atlOrigin=eyJpIjoiZWY3YmMzZjcyZGMwNDMzNTkzYjAwY2ZhYjFlZjc1YWEiLCJwIjoiaiJ9

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





<======== To Start =========>

* You'll need the Node.js dependencies. run :

    npm install 

* You'll also need to create .env file to establish local server configuration.
  After this, you can launch it on that specified localhost port and make the following requests:

<======== Example API Requests =========>

/*
Root endpoint

    http://localhost:3000/

Returns information about all available endpoints.
*/

/*
Health check

    http://localhost:3000/health

Returns the health status of the server.
*/

/*
All train locations

    http://localhost:3000/api/trains/locations

Returns real-time locations of all SEPTA Regional Rail 
trains.
*/ 

/*
Train delays

    http://localhost:3000/api/trains/delays

Returns information about delayed trains with status categorization.
*/

/*
Next to arrive

    http://localhost:3000/api/trains/next-to-arrive/:from/:to/:count?

Returns the next trains arriving between two stations.

 * Replace :from with the origin station name (ex: "Suburban")
 * Replace :to with the destination station name (ex: "Airport Terminal E F")
 * :count is optional (defaults to 5)
 ==> Example: http://localhost:3000/api/trains/next-to-arrive/Suburban/Ardmore/3
*/

Train schedule
/*
    http://localhost:3000/api/trains/schedule/:trainNumber/:day?

Returns the schedule for a specific train.

 * Replace :trainNumber with the train number (ex: "456")
 * :day is optional (defaults to current day)
 ==> Example: http://localhost:3000/api/trains/schedule/456
*/

/*
All Regional Rail lines

    http://localhost:3000/api/lines

Returns a list of all SEPTA Regional Rail lines.
*/