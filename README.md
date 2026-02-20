## Blog application (Live)

Blog App is a full-stack web application that allows users to register, log in, create blogs, like posts, and delete their own blogs. Blogs are dynamically sorted by the number of likes, making popular content easy to discover. All data is stored in a backend database, and user authentication is handled securely using JSON Web Tokens (JWT).

## Live site:

👉 https://blog-app-2026.fly.dev

## What the project does

User authentication (register & login)
Create, view, like, and delete blogs
Blogs sorted by popularity (likes)
Role-based permissions (only creators can delete their blogs)
Persistent data storage in a database
Automated backend and end-to-end tests
Continuous integration and deployment

## How to run the project locally

1. Clone the repository:

```bash
git clone https://github.com/nngo23/blog-app
cd blog-app
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

Create a **.env** file with:

MONGODB_URI=<your-mongodb-uri>
SECRET=<your-jwt-secret>

Start backend:
npm run dev

Frontend runs on: http://localhost:5173

## Technologies used

1. Frontend
   React
   Vite
   Axios
   CSS
2. Backend
   Node.js
   Express
   MongoDB
   Mongoose
   JSON Web Token (JWT)
   bcrypt
3. Testing
   Jest (backend testing)
   Playwright (end-to-end testing)
4. DevOps & Deployment
   GitHub Actions (CI/CD)
   Fly.io (deployment)

## My contribution

This is my first project where I handled the entire development lifecycle independently:

    Designed and implemented the backend REST API
    Built the React frontend and managed state
    Implemented authentication and authorization logic
    Wrote unit tests and end-to-end tests
    Configured CI/CD pipelines in GitHub Actions
    Managed environment variables and deployment to Fly.io
    Debugged production and CI environment issues
