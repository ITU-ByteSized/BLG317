# BLG317 – Database Term Project

ITU BLG317 Database Systems Course Project  
A full-stack movie database application built with Flask (backend), vanilla JavaScript (frontend), and MySQL.

---

## Quick Start

### 1. Install Dependencies



```bash
pip install -r requirements.txt
```

**Note:** Ensure you have latest versions of Python and MySQL installed on your system.

## Database Configuration

The backend uses a `.env` file located at `backend/.env` for database configuration.  
Update the existing `backend/.env` file to match your local MySQL setup, for example:

```env
DB_HOST=127.0.0.1
DB_NAME=bytesizedDB_project
DB_USER=root
DB_PASS=your_password_here
```

These values are read by the backend using `python-dotenv`.

## Makefile Commands

This project provides a `Makefile` to simplify local development.
From the project root (`BLG317/`), you can use:

### Create database tables (schema)

```bash
make init-db
```

### Insert seed data
```bash
make seed
```

### Run both: create schema + seed data
```bash
make db-setup
```

### Start the backend server
```bash
make run
```

The backend will start on: `http://127.0.0.1:5000`

After starting the backend, open the frontend (e.g., via Live Server) on: `http://127.0.0.1:5500`

## Database Schema

![Database Schema](database/schema/database_schema.png)
