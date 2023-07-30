# WTWR (What to Wear?): Back End

## Domain

Front end: https://www.wtwr.twilightparadox.com
Back end: https://api.wtwr.twilightparadox.com

## Functionality

The back-end projects will focus on creating a server for your WTWR project. While working on them, you'll learn how to work with databases, set up security and testing, and deploy your web application on a remote machine. The goal of all this is to create a server with an API and user authorization.

At this stage, you'll:
set up an Express project
create a database and connect it to the server
configure the first routes and controllers
handle errors

## Technologies and Techniques

### set up an Express project

1. Set up the project by cloning the repository from your GitHub account. Enter the directory on your local machine and run npm init to generate the package.json file.
2. Set up a linter to is called ESLint which will help to find errors and maintain code consistency.
3. Create an entry point by creating the app.js file in the project root, then create an Express server inside of it and configure it to run on port 3001.
4. Set up hot reload to make the server restart when project files change. To do this, install the nodemon package as a dev dependency.
5. Create a project structure by creating folders for modules:
   routes for storing files responsible for request routing
   controllers for storing files with functions that define routes
   models for storing files with described schemas and models
   utils for storing supportive data

### create a database and connect it to the server

Initialize a database for storing user and clothing item data by installing MongoDB on computer.
Install Mongoose to project: npm install mongoose@6.6.1 .
Connect to the MongoDB server: mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

### configure the routes and controllers

Users:
GET /users — returns all users
GET /users/:userId - returns a user by \_id
POST /users — creates a new user

Clothing items:
GET /items — returns all clothing items
POST /items — creates a new item
DELETE /items/:itemId — deletes an item by \_id
PUT /items/:itemId/likes — like an item
DELETE /items/:itemId/likes — unlike an item

### Implement a temporary authorization solution

Create a test user via Postman:
Create an authorization middleware

### handle errors

400 — invalid data passed to the methods for creating an item/user or updating an item, or invalid ID passed to the params.
404 — there is no user or clothing item with the requested id, or the request was sent to a non-existent address.
500 — default error. Accompanied by the message: "An error has occurred on the server."

### expand the user schema

The user will sign up using their email address and password. Each user's email will be unique and validated against the email schema.

### create routes and controllers for signing up, signing in, and modifying the current user data

- Update the createUser controller
- Create the login controller
- Add routes and controllers for signing up and signing in
- Create middleware for authorization
- Add a controller and route to get the user data
- Add a controller and route to modify the user data
- Configure user rights
- Install cors

### Test your project

Check project independently using two new tools: Postman and GitHub Actions

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature
