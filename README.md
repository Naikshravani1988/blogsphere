# BlogSphere — Experiment No. 10

A responsive mini blog web application using HTML5, CSS3, Bootstrap 5, JavaScript, and Node.js/Express.

## Features
- Publish a post with title, author, and content
- View posts on the home page
- Delete existing posts
- Basic input validation and safe HTML escaping
- Responsive layout

## Requirements
- Node.js (LTS recommended)
- A web browser

## Run locally
1. Extract the project folder.
2. Open a terminal in the `blogsphere` folder.
3. Run `npm install`.
4. Run `npm start`.
5. Open `http://localhost:3000` in your browser.

## Deployment
Push the complete folder to a GitHub repository. On Render, create a **Web Service** connected to the repository. Set **Build Command** to `npm install` and **Start Command** to `npm start`. Deploy and open the public URL.

## Note about storage
This practical uses in-memory storage to keep setup simple. Posts reset whenever the server restarts or redeploys. For persistent online posts, connect a database such as MongoDB or PostgreSQL.
