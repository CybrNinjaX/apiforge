# ApiForge

ApiForge is a browser based API client built with React and Django REST Framework. Sign in, compose HTTP requests, inspect responses, and optionally save requests and history to your account.

## Features

- Account registration, login, JWT authentication, profile editing, and password reset.
- Request composer for `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`.
- Query parameters, custom headers, Bearer token, Basic Auth, and API key authentication.
- No body, multipart form data, URL encoded, raw JSON/JavaScript/text/HTML/XML, and binary file request bodies.
- Response status, elapsed time, content type, and response body.
- Personal collections and saved requests.
- Environments with named key/value variables. Variables are stored in the environment page; they are not currently substituted into request URLs automatically.
- Request history for calls made from Collections.
- Database storage switch on Collections. It starts Off; when On, saving requests and recording history are enabled. The preference is kept in the current browser.
- Keyboard shortcuts in Collections: **Ctrl/⌘ + Enter** sends the request and **Ctrl/⌘ + S** saves it when storage is On.

## Tech stack

- Frontend: React, Vite, React Router, Lucide icons, and CSS.
- Backend: Python, Django, Django REST Framework, and Simple JWT.
- Database: SQLite by default, with PostgreSQL supported through environment settings.

## Project layout

```text
ApiForge/
├── backend/
│   ├── accounts/          # Registration, login support, profile, password reset
│   ├── api_collections/   # Collections
│   ├── api_requests/      # Saved request definitions
│   ├── environments/      # Environment storage
│   ├── history/           # Request history storage
│   ├── workspaces/        # Personal workspace model
│   ├── config/            # Django settings and root URLs
│   ├── .env.example
│   └── manage.py
├── frontend/
│   ├── src/features/auth/
│   ├── src/features/workspace/
│   ├── .env.example
│   └── package.json
└── README.md
```

## Local setup

You need Python, Node.js, and npm. The backend can use SQLite without a separate database server.

### Backend

From the repository root:

```bash
cd backend
python3 -m venv ../.venv
source ../.venv/bin/activate
pip install -r requirements.txt
cp -n .env.example .env
```

Set `SECRET_KEY` in `backend/.env` to a generated value:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

The example leaves `DATABASE_NAME` empty, which selects SQLite. To use PostgreSQL, set `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_HOST`, and `DATABASE_PORT` in `backend/.env`.

Apply migrations and start Django:

```bash
python manage.py migrate
python manage.py runserver
```

The API is available at `http://127.0.0.1:8000/api/`.

For local password reset, the example email backend prints the reset email in the backend terminal. Configure valid SMTP settings and network access if you want to send actual email.

### Frontend

Open another terminal from the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The default API address is `http://127.0.0.1:8000/api`. To change it, copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_BASE_URL`.

## Using the API client

1. Register an account and sign in.
2. Open **Collections**, select an HTTP method, and enter an `http://` or `https://` URL.
3. Add query parameters, headers, authentication, or a request body from the composer tabs.
4. Select **Send** or press **Ctrl/⌘ + Enter** to view the response.
5. Turn **Database storage** On to enable **Save request** and request history. Turn it Off to stop new request and history writes from Collections.

Requests run in the browser. The target server must allow your frontend origin through CORS; ApiForge does not currently proxy requests through Django. Browser security also limits access to some response headers.

Environments let you save named sets of variables. Saved variables currently need to be copied into request URLs, headers, or bodies manually; automatic variable replacement is not implemented.

## API endpoints

All routes below are relative to `http://127.0.0.1:8000`. Routes marked **JWT** require an `Authorization: Bearer <access-token>` header.

| Method | Route | Purpose | Auth |
|---|---|---|---|
| `POST` | `/api/accounts/register/` | Create an account | Public |
| `POST` | `/api/auth/token/` | Obtain access and refresh tokens | Public |
| `POST` | `/api/auth/token/refresh/` | Refresh an access token | Public |
| `GET`, `PATCH` | `/api/accounts/me/` | Read or update the current profile | JWT |
| `POST` | `/api/accounts/password-reset/` | Request a password reset email | Public |
| `POST` | `/api/accounts/password-reset/confirm/` | Set a password using a valid reset token | Public |
| `GET`, `POST` | `/api/collections/` | List or create collections | JWT |
| `GET`, `PUT`, `PATCH`, `DELETE` | `/api/collections/{id}/` | Read, edit, or delete a collection | JWT |
| `GET`, `POST` | `/api/requests/` | List or save requests | JWT |
| `GET`, `PUT`, `PATCH`, `DELETE` | `/api/requests/{id}/` | Read, edit, or delete a saved request | JWT |
| `GET`, `POST` | `/api/environments/` | List or create environments | JWT |
| `GET`, `PUT`, `PATCH`, `DELETE` | `/api/environments/{id}/` | Read, edit, or delete an environment | JWT |
| `GET`, `POST` | `/api/history/` | Read or record request history | JWT |

Registration and password reset requests use JSON. For example:

```json
{
  "username": "api_developer",
  "email": "developer@example.com",
  "password": "a-strong-unique-password",
  "password_confirm": "a-strong-unique-password"
}
```

## Tests and checks

Run the Django test suite with the in-memory SQLite test settings:

```bash
cd backend
DEBUG=true DJANGO_SETTINGS_MODULE=config.test_settings ../.venv/bin/python manage.py test
```

Frontend commands:

```bash
cd frontend
npm run lint
npm run build
```

## Configuration and deployment

Keep `.env` files and real credentials out of version control. The checked-in examples are for local development. Before deployment, set `DEBUG=False`, a strong `SECRET_KEY`, production `ALLOWED_HOSTS`, database credentials, frontend/API origins, and a production email backend. Django's development server is for local development only; use a production WSGI or ASGI server for deployment.

## Project status

ApiForge is under active development. The current app focuses on personal API work; team collaboration, API analytics, import/export, automatic environment substitution, script execution, and server-side request proxying are not implemented.
