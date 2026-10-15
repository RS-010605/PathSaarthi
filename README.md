<div align="center">

# PathSaarthi Gujarat

**Discover your career. Plan your journey. Build your future.**

A career-guidance platform for exploring career options and structured roadmaps, powered by React, Express, and MongoDB.

</div>

---

## Contents

- [Overview](#overview)
- [Technology](#technology)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Run the Application](#run-the-application)
- [Database Seeding](#database-seeding)
- [API Reference](#api-reference)
- [Career Statuses](#career-statuses)
- [Troubleshooting](#troubleshooting)
- [Production Checklist](#production-checklist)
- [Security](#security)

## Overview

PathSaarthi Gujarat helps users explore career options and understand the steps needed to pursue them. The application has:

- A **React + Vite** frontend
- A **Node.js + Express** backend
- **MongoDB + Mongoose** for persistent data
- A browser `localStorage` fallback for demo data when API requests fail

> **Development status:** This README documents the current local development setup. Confirm route names, npm scripts, and environment variable names against the files in your checkout before deployment.

## Technology

| Layer | Tools |
|---|---|
| Frontend | React, Vite, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Version control | Git, GitHub |

## Project Structure

```text
pathsaarthi-gujarat/
├── client/
│   ├── src/
│   │   └── data/
│   │       ├── repository.js
│   │       └── seedData.js
│   ├── .env
│   └── package.json
├── server/
│   ├── src/
│   │   ├── index.js
│   │   ├── models.js
│   │   └── seed.js
│   └── package.json
├── .gitignore
└── README.md
```

This is a simplified view of the main files; your project may contain additional folders.

## Getting Started

### Prerequisites

Install:

- [Node.js and npm](https://nodejs.org/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community), or use a MongoDB connection URI
- [Git](https://git-scm.com/) (optional, for version control)

### 1. Get the project

If you already have the project on your computer, open its root folder:

```text
D:\PathSaarthi\pathsaarthi-gujarat
```

Or clone your GitHub repository:

```bash
git clone <your-repository-url>
cd pathsaarthi-gujarat
```

### 2. Install ependencies

From the project root:

```bash
npm install
npm run dev
```

## Environment Configuration

### Frontend

Create `client/.env` and add:

```env
VITE_API_URL=http://localhost:5000/api
```

Restart the Vite server after changing `.env`. Vite loads these variables when it starts.

### Backend and MongoDB

The local MongoDB URI used during development is:

```text
mongodb://127.0.0.1:27017
```

The database name is:

```text
pathsaarthi
```

Configure any backend environment variables using the names expected by `server/src/index.js` and the database connection code. Check those files before creating a backend `.env`.

**Never commit passwords, private MongoDB connection strings, API keys, or other secrets.** Keep real `.env` files local and share a `.env.example` containing placeholder values if needed.

## Run the Application

Start MongoDB first, then run the backend and frontend in separate terminals.

**Terminal 1 — Backend**

```bash
cd server
npm run
```

The command above lists the scripts available in `server/package.json`. Then run the appropriate script shown there (commonly `npm run dev` or `npm start`).

Expected local backend address:

- API base: `http://localhost:5000/api`
- Health check, if configured: `http://localhost:5000/api/health`
- Careers: `http://localhost:5000/api/careers`

**Terminal 2 — Frontend**

```bash
cd client
npm run dev
```

Open the local URL printed by Vite, typically:

- `http://localhost:5173`

## Database Seeding

Seed career data is stored in `client/src/data/seedData.js`. The seed script is `server/src/seed.js`.

From the `server` folder, inspect available scripts:

```bash
npm run
```

Use the seed command defined in `server/package.json`. If no seed command exists, check `server/src/seed.js` and the package configuration before running it.

The project previously imported **26 career records**. Review the seed script before running it again, especially if you have manually edited database records.

## API Reference

The routes below reflect the endpoints discussed during development. Check `server/src/index.js` for the definitive route definitions and expected request/response formats.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Check server/database health, if configured |
| `GET` | `/api/careers` | Retrieve career records |
| `GET` | `/api/careers/:slug` | Retrieve a published career by slug |
| `POST` | `/api/admin/careers` | Create a career record |
| `PATCH` | `/api/admin/careers/:id` | Update a career record |
| `DELETE` | `/api/admin/careers/:id` | Archive a career record |
| `PUT` | `/api/admin/careers/:id/roadmap` | Update a career roadmap |
| `POST` | `/api/contributions` | Submit a contribution |
| `GET` | `/api/admin/contributions` | Retrieve contributions |
| `PATCH` | `/api/admin/contributions/:id` | Update a contribution |

## Career Statuses

Career records are stored in the `pathsaarthi` database, in the `careers` collection.

| Status | Meaning |
|---|---|
| `draft` | Work in progress; should not be public |
| `published` | Ready to display publicly |
| `archived` | Removed from normal active use |

Make sure public list and detail endpoints apply the intended status filters. Test this before deployment so draft or archived records are not unintentionally exposed.

## Troubleshooting

### The website displays old demo data

The frontend repository includes a `localStorage` fallback. If the API request fails, the app may display previously saved demo data.

1. Confirm the backend is running.
2. Open `http://localhost:5000/api/careers` and check that it returns career JSON.
3. Check `client/.env` contains:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Restart Vite and refresh the page.
5. Press **F12** in the browser and inspect **Console** and **Network** for failed requests.

To clear only the saved career list for this website in the current browser, run this in the browser Console:

```js
localStorage.removeItem('pathsaarthi.careers.v1');
location.reload();
```

This removes browser-stored career data only. It does **not** delete MongoDB records.

### MongoDB is not connecting

- Make sure the MongoDB service is running.
- Verify the URI and database name used by the backend.
- Check the backend terminal for connection errors.
- Visit `http://localhost:5000/api/health` if that endpoint is configured.

### Career changes do not persist

- Check the browser **Console** and **Network** tabs for failed requests.
- Confirm the API request returns a successful status.
- Verify the record in MongoDB.
- Remember that a local-storage fallback can make a change appear in the browser even when the API save fails.

## Production Checklist

Before deploying:

- [ ] Confirm frontend and backend start successfully.
- [ ] Confirm the API can connect to MongoDB.
- [ ] Create and edit a career, then verify the changes in MongoDB.
- [ ] Verify public pages show only the intended career statuses.
- [ ] Test roadmaps and contribution workflows.
- [ ] Configure production environment variables.
- [ ] Set CORS to allow only trusted frontend origins.
- [ ] Add authentication and authorization to administrative endpoints.
- [ ] Use HTTPS and review deployment logs.

## Security

- Do not expose administrative write endpoints without authentication and authorization.
- Validate incoming data on the backend.
- Keep credentials in environment variables.
- Do not commit `.env` files containing real secrets.
- Restrict CORS to trusted origins in production.
- Use HTTPS for deployed applications.

## License

No license has been specified yet. Add a `LICENSE` file before distributing the project publicly.
