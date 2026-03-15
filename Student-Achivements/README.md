# Student Achievements (Frontend + Backend)

## Deploy Locally with Docker Compose

1. Create `.env` at repo root with:

```
MONGO_URI=mongodb://host:port/dbname
```

2. Start services:

```bash
docker compose up --build
```

Frontend: http://localhost:3000
Backend API: http://localhost:8000/api

## Run Locally Without Docker

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Build Frontend
```bash
cd frontend
npm run build
```

## GitHub Update (Push Latest)

```bash
git add .
git commit -m "Add deploy configuration: Dockerfiles, docker-compose, and dynamic API base URL"
git push origin main
```
