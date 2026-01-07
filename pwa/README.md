# Quxiang PWA Frontend

Progressive Web App for health management platform with role-based access (HQ, STAFF, CUSTOMER).

## Tech Stack

- Vue 3 + TypeScript
- Vite
- Vue Router
- Pinia (State Management)
- Axios (HTTP Client)
- PWA Plugin

## Project Structure

```
src/
├── app/              # App configuration
│   ├── router/       # Vue Router setup
│   └── styles/       # Global styles
├── pages/            # Page components by role
│   ├── public/       # Public pages (login, QR entry)
│   ├── staff/        # Staff pages
│   ├── customer/     # Customer pages
│   └── hq/           # HQ pages
├── stores/           # Pinia stores
├── services/         # API services
│   └── api/          # API client & endpoints
├── domain/           # TypeScript types
└── main.ts           # App entry point
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your API URL:
```
VITE_API_BASE_URL=http://localhost:8000
```

4. Run development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Features

### Authentication
- Employee login (username/password)
- Customer OTP login (phone verification)
- Session-based authentication with auto-login
- Role-based routing guards

### QR Code Entry
- Fixed store QR codes: `/q?store=STORE_ID`
- Auto-redirect based on login status and role

### Role-Based Access

**STAFF**
- Customer profile management
- Service record creation
- Store QR code display

**CUSTOMER**
- View personal records
- AI health advisor chat
- Profile settings

**HQ**
- Store management (placeholder)
- Service configuration (placeholder)
- Package configuration (placeholder)

## API Integration

The app expects the following backend endpoints:

### Auth
- `POST /auth/login` - Employee login
- `POST /auth/otp/request` - Request OTP
- `POST /auth/otp/verify` - Verify OTP
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout

### Business
- `GET/POST/PUT /profiles` - Profile management
- `GET/POST/PUT /records` - Record management
- `POST /uploads/presign` - File upload
- `POST /ai/chat` - AI chat

## PWA Features

- Offline-ready with service worker
- App manifest for installation
- Network-first caching strategy for API calls
- Static asset caching

## Development Notes

- TypeScript strict mode enabled
- All API calls use axios with credentials
- 401 responses auto-redirect to `/q`
- Role mismatches redirect to appropriate home page
