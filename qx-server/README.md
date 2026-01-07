# Quxiang Health API

FastAPI backend for health management platform with role-based access control.

## Tech Stack

- FastAPI
- SQLAlchemy (ORM)
- MySQL
- Alembic (Migrations)
- JWT (Sessions)
- Pydantic (Validation)

## Project Structure

```
app/
├── api/              # API endpoints
│   ├── v1/           # API version 1
│   └── deps.py       # Dependencies (auth, etc.)
├── core/             # Core functionality
│   ├── config.py     # Configuration
│   ├── database.py   # Database setup
│   └── security.py   # Security utilities
├── models/           # SQLAlchemy models
├── schemas/          # Pydantic schemas
└── main.py           # FastAPI app
```

## Requirements

- Python 3.11 or 3.12 (Python 3.14 is not yet supported by all dependencies)
- MySQL 8.0+

## Getting Started

1. Create virtual environment with Python 3.11 or 3.12:
```bash
python3.12 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials:
```
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/quxiang
SECRET_KEY=your-secret-key-here
```

4. Create database:
```bash
mysql -u root -p
CREATE DATABASE quxiang CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. Run migrations:
```bash
alembic upgrade head
```

6. Run the application:
```bash
# Development
python run.py

# Production (recommended)
uvicorn app.main:app --host 127.0.0.1 --port 8010
```

The API will be available at `http://localhost:8010`

## API Endpoints

### Authentication
- `POST /auth/login` - Employee login
- `POST /auth/otp/request` - Request OTP for customer
- `POST /auth/otp/verify` - Verify OTP and login
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout

### Profiles
- `GET /profiles` - List profiles (filtered by role/store)
- `GET /profiles/{id}` - Get profile details
- `POST /profiles` - Create profile (STAFF/HQ only)
- `PUT /profiles/{id}` - Update profile
- `DELETE /profiles/{id}` - Delete profile (HQ only)

### Records
- `GET /records` - List records (filtered by role/store)
- `GET /records/{id}` - Get record details
- `POST /records` - Create record (STAFF/HQ only)
- `PUT /records/{id}` - Update record (STAFF/HQ only)
- `DELETE /records/{id}` - Delete record (HQ only)

### Uploads
- `POST /uploads/presign` - Get presigned upload URL

### AI
- `POST /ai/chat` - Send message to AI
- `GET /ai/conversations` - List conversations
- `GET /ai/conversations/{id}` - Get conversation details

## Authentication Flow

### Employee Login
1. POST `/auth/login` with username/password
2. Server validates credentials
3. Server creates session token (JWT)
4. Server sets HttpOnly cookie
5. Client stores cookie automatically

### Customer OTP Login
1. POST `/auth/otp/request` with phone number
2. Server generates 6-digit code
3. Server sends SMS (mock in dev)
4. Customer enters code
5. POST `/auth/otp/verify` with phone + code
6. Server validates OTP
7. Server creates/finds customer account
8. Server creates session token
9. Server sets HttpOnly cookie

### Session Validation
- All protected endpoints check `session` cookie
- JWT token contains user ID
- Token expires after 30 days
- Invalid/expired tokens return 401

## Role-Based Access

### HQ
- Full access to all resources
- Can manage stores, services, packages
- Can view/edit all profiles and records

### STAFF
- Access limited to their store
- Can create/edit profiles in their store
- Can create/edit records in their store
- Cannot delete resources

### CUSTOMER
- Read-only access to own profile
- Read-only access to own records
- Can chat with AI advisor
- Cannot access other customers' data

## Database Schema

### users
- id (PK)
- role (HQ/STAFF/CUSTOMER)
- username (for employees)
- password_hash (for employees)
- phone (for customers)
- store_id (FK)
- profile_id (FK, for customers)

### profiles
- id (PK)
- name
- phone
- gender
- birth_date
- store_id (FK)

### records
- id (PK)
- profile_id (FK)
- type (detection/service)
- title
- content
- images (JSON)
- staff_id (FK)
- store_id (FK)

### stores
- id (PK)
- name
- address
- phone
- active

### otps
- id (PK)
- phone
- code
- verified
- expires_at

### conversations & messages
- For AI chat history

## Development Notes

- OTP codes are printed to console in development
- File uploads use mock URLs (integrate S3/OSS in production)
- AI responses are mocked (integrate OpenAI/Claude in production)
- Session tokens use JWT with HttpOnly cookies
- CORS configured for localhost:5173 (Vite default)

## Production Checklist

- [ ] Change SECRET_KEY to strong random value
- [ ] Configure real SMS provider
- [ ] Configure real file storage (S3/OSS)
- [ ] Configure real AI provider
- [ ] Update CORS origins
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Review security headers
