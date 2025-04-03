# **Event Management App**

## **1. Event Management Application Features**

This application allows authenticated users to:

* Create and manage events with details like title, date, location, and description
* Register for events
* Track event attendance

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
* Only owners of the events can manage them
* JWT authentication is used for secure access

### CI/CD Pipeline Setup

* Configured for Continuous integration and Continuous deployment
* Build and deploy pipeline is configured to run on a `push` to `main` branch
* Runs on a self hosted agent  
* Agent runs on a Aws EC2 instance
* Application runs on AWS EC2 instance

### Project structure

* backend/ - Node.js API implementation using Express and MongoDB
* frontend/ - React.js application

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
