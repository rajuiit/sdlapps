# **Event Management App: Full-Stack CRUD Application Development with DevOps Practices**

## **1. Event Management Application Features**

This application allows authenticated users to:

* Create and manage events with details like title, date, location, and description
* Register for events
* Track event attendance

### **2. Project Management with JIRA and SysML**

* Create a **JIRA project** and define:
  * **Epic**
  * **User Stories** (features required in your app)
  * **Child issues & Subtasks** (breaking down development work)
  * **Sprint Planning** (organizing work into milestones)
* Document your JIRA **board URL** in the project README.
* Draw a requirements diagram

## Tech stack

### Backend

* Node.js + Express
* MongoDB

### Frontend

* React.js

### Upcoming features

* Manage event categories and settings
* View event analytics and reports
* Add event management dashboard
* Create calendar view for events
* Add search and filter components

### Authentication & Authorization**

* Only registered and authenticated users can access the system

### CI/CD Pipeline Setup

* Configured for Continuous integration and Continuous deployment
* Build and deploy pipeline is configured to run on a `push` to `main` branch
* Runs on a self hosted agent  
* Agent runs on a Aws EC2 instance
* Application runs on AWS EC2 instance

## **Submission Requirements**

* **JIRA Project Board URL** with event management user stories
* **Requirements diagram** showing event management system features
* **GitHub Repository** containing:
  * `backend/` - Node.js API implementation
  * `frontend/` - React.js application
* **README.md** with:
  * Project overview
  * Setup instructions
  * API documentation
  * Environment variables guide
  * CI/CD pipeline details

## **Setup Instructions**

1. Clone the repository

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies

   ```bash
   npm run install-all
   ```

3. Configure environment variables

   ```
   # Backend .env
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   PORT=5001
   # Frontend 
   Application launch uri =http://localhost:3000
   ```

4. Run the application

    ```bash
    npm run dev
    ```
