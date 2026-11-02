# ApiForge frontend

The ApiForge web client is a React single-page application built with Vite. It provides account pages and a personal API workspace.

## Requirements

- Node.js compatible with the installed Vite version.
- npm.
- The ApiForge Django backend running at `http://127.0.0.1:8000` (the default API base URL).

## Setup

From this directory:

```bash
npm install
npm run dev
```

Vite prints the local URL, normally `http://localhost:5173`.

To use a different backend, copy `.env.example` to `.env` and update:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

The backend must allow the frontend origin in its CORS settings. Requests to third-party APIs are sent from the browser, so those API servers must also allow the frontend origin through CORS.

## Available commands

```bash
npm run dev      # Start the Vite development server
npm run lint     # Run ESLint
npm run build    # Create a production build in dist/
npm run preview  # Preview the production build locally
```

## Main routes

- `/login` — sign in with a username and password.
- `/register` — create an account.
- `/forgot-password` — request a password reset link.
- `/reset-password/:uid/:token` — set a new password from a reset link.
- `/app` — authenticated workspace with Collections, Environments, and History sections.

## Collections shortcuts

- **Ctrl/⌘ + Enter** sends the current request.
- **Ctrl/⌘ + S** saves the request when Database storage is enabled.

The database-storage preference is kept in browser local storage. Login session tokens are kept in session storage.

## Source layout

```text
src/
├── features/
│   ├── auth/       # Login, registration, password reset, profile auth calls
│   └── workspace/  # Request composer, collections, environments, history
├── shared/
│   ├── api/        # JSON API client
│   └── components/ # Shared brand component
├── App.jsx
└── main.jsx
```
