# Backend API Testing Guide

This guide explains how to test all API endpoints in the SIGECO backend.

## Prerequisites

- Backend server running (`npm run dev`)
- PostgreSQL database configured and seeded
- curl or HTTP client installed

## Quick Start

### Option 1: Automated Test Script

Run the automated test script to verify all endpoints:

```bash
cd backend
./scripts/test-endpoints.sh
```

This will:
- Check if the server is running
- Login with admin credentials
- Test all major endpoints
- Display results with pass/fail status

### Option 2: Manual Testing with HTTP Client

Use the provided HTTP collection file with REST Client (VS Code extension) or Postman:

1. Open `backend/tests/api-test-collection.http` in VS Code
2. Install REST Client extension
3. Click "Send Request" above each endpoint

### Option 3: Manual Testing with curl

See examples below for each endpoint category.

## API Endpoint Tests

### 1. Health Check

```bash
curl http://localhost:3001/api/health
```

Expected: `{"status":"ok","timestamp":"..."}`

### 2. Authentication

#### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sigeco.com","password":"admin123"}'
```

Expected: Returns JWT token
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "admin@sigeco.com",
    "name": "Administrador",
    "role": "ADMIN"
  }
}
```

Save the token for authenticated requests:
```bash
export TOKEN="your-jwt-token-here"
```

#### Register New User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@sigeco.com",
    "password":"Test123!@#",
    "name":"Test User",
    "role":"PORTEIRO"
  }'
```

#### Get Current User
```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Residents

#### List All Residents
```bash
curl http://localhost:3001/api/residents \
  -H "Authorization: Bearer $TOKEN"
```

#### Get Residents with Filters
```bash
curl "http://localhost:3001/api/residents?status=ATIVO&search=Ana" \
  -H "Authorization: Bearer $TOKEN"
```

#### Get Resident by ID
```bash
curl http://localhost:3001/api/residents/RESIDENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

#### Create Resident (Admin/Sindico only)
```bash
curl -X POST http://localhost:3001/api/residents \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Maria Santos",
    "email":"maria.santos@email.com",
    "phone":"(11) 98888-7777",
    "document":"111.222.333-44",
    "type":"PROPRIETARIO",
    "unitId":"UNIT_ID_HERE"
  }'
```

#### Update Resident (Admin/Sindico only)
```bash
curl -X PUT http://localhost:3001/api/residents/RESIDENT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone":"(11) 99999-8888",
    "status":"ATIVO"
  }'
```

#### Delete Resident (Admin/Sindico only)
```bash
curl -X DELETE http://localhost:3001/api/residents/RESIDENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Appointments

#### List All Appointments
```bash
curl http://localhost:3001/api/appointments \
  -H "Authorization: Bearer $TOKEN"
```

#### Get Appointments with Filters
```bash
curl "http://localhost:3001/api/appointments?status=CONFIRMADO&date=2024-11-15" \
  -H "Authorization: Bearer $TOKEN"
```

#### Create Appointment
```bash
curl -X POST http://localhost:3001/api/appointments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "visitorName":"Dr. Roberto Silva",
    "visitorDoc":"555.666.777-88",
    "visitorPhone":"(11) 97777-6666",
    "destination":"Apto 101",
    "reason":"Consulta médica",
    "scheduledDate":"2024-11-15",
    "scheduledTime":"14:00",
    "observations":"Médico cardiologista",
    "residentId":"RESIDENT_ID",
    "unitId":"UNIT_ID"
  }'
```

#### Update Appointment
```bash
curl -X PUT http://localhost:3001/api/appointments/APPOINTMENT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status":"CONFIRMADO",
    "observations":"Confirmado por telefone"
  }'
```

#### Delete Appointment
```bash
curl -X DELETE http://localhost:3001/api/appointments/APPOINTMENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Visits

#### List All Visits
```bash
curl http://localhost:3001/api/visits \
  -H "Authorization: Bearer $TOKEN"
```

#### Get Visits with Filters
```bash
curl "http://localhost:3001/api/visits?status=ATIVO&date=2024-11-10" \
  -H "Authorization: Bearer $TOKEN"
```

#### Register New Visit
```bash
curl -X POST http://localhost:3001/api/visits \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "visitorName":"Paulo Oliveira",
    "document":"999.888.777-66",
    "unitId":"UNIT_ID",
    "purpose":"Visita social"
  }'
```

#### Checkout Visitor
```bash
curl -X PUT http://localhost:3001/api/visits/VISIT_ID/checkout \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Dashboard

#### Get Dashboard Statistics
```bash
curl http://localhost:3001/api/dashboard/stats \
  -H "Authorization: Bearer $TOKEN"
```

Expected response:
```json
{
  "stats": {
    "visitsToday": 5,
    "activeVisitors": 2,
    "visitsWeek": 28,
    "pendingAppointments": 3,
    "totalResidents": 15
  },
  "recentVisits": [...]
}
```

#### Get Reports
```bash
curl "http://localhost:3001/api/dashboard/reports?startDate=2024-11-01&endDate=2024-11-30" \
  -H "Authorization: Bearer $TOKEN"
```

## Expected HTTP Status Codes

- `200 OK` - Successful GET, PUT
- `201 Created` - Successful POST (resource created)
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource (e.g., email already exists)
- `500 Internal Server Error` - Server error

## Testing Checklist

Use this checklist to verify all endpoints:

### Authentication
- [ ] POST /api/auth/login - Login works with correct credentials
- [ ] POST /api/auth/login - Fails with incorrect credentials
- [ ] POST /api/auth/register - Creates new user
- [ ] GET /api/auth/me - Returns current user info

### Residents
- [ ] GET /api/residents - Lists all residents
- [ ] GET /api/residents?search=name - Filters work
- [ ] GET /api/residents/:id - Returns specific resident
- [ ] POST /api/residents - Creates new resident (Admin/Sindico)
- [ ] POST /api/residents - Rejects creation (Porteiro)
- [ ] PUT /api/residents/:id - Updates resident
- [ ] DELETE /api/residents/:id - Deletes resident

### Appointments
- [ ] GET /api/appointments - Lists appointments
- [ ] GET /api/appointments?status=CONFIRMADO - Filters work
- [ ] POST /api/appointments - Creates appointment
- [ ] PUT /api/appointments/:id - Updates appointment status
- [ ] DELETE /api/appointments/:id - Deletes appointment

### Visits
- [ ] GET /api/visits - Lists visits
- [ ] GET /api/visits?status=ATIVO - Filters active visits
- [ ] POST /api/visits - Registers new visit
- [ ] PUT /api/visits/:id/checkout - Checks out visitor

### Dashboard
- [ ] GET /api/dashboard/stats - Returns statistics
- [ ] GET /api/dashboard/reports - Returns filtered data

## Troubleshooting

### Server Not Running
```
Error: Failed to connect to localhost:3001
```
**Solution:** Start the server with `npm run dev`

### Authentication Errors
```
{"error": "Invalid token"}
```
**Solution:** 
1. Get a new token by logging in
2. Update the TOKEN variable
3. Ensure token is included in Authorization header

### Database Errors
```
{"error": "Database connection failed"}
```
**Solution:**
1. Check PostgreSQL is running
2. Verify DATABASE_URL in .env
3. Run migrations: `npm run prisma:migrate`

### Validation Errors
```
{"error": "Validation error", "details": [...]}
```
**Solution:** Check the request body matches the expected schema

## Integration Testing

For automated integration tests, install supertest:

```bash
npm install --save-dev supertest @types/supertest
```

Example test:
```typescript
import request from 'supertest';
import { app } from '../src/app';

describe('Authentication', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@sigeco.com',
        password: 'admin123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
```

## Performance Testing

Test API performance under load:

```bash
# Install apache bench
sudo apt-get install apache2-utils

# Test endpoint with 1000 requests, 10 concurrent
ab -n 1000 -c 10 -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/dashboard/stats
```

## Security Testing

Verify security measures:

1. **Rate Limiting:** Make 100+ requests in 15 minutes, verify rate limit kicks in
2. **CORS:** Verify requests from unauthorized origins are blocked
3. **JWT Expiration:** Wait for token expiry (7 days) and verify it fails
4. **SQL Injection:** Try malicious input, verify Prisma protects against it
5. **Authorization:** Verify PORTEIRO cannot access Admin-only endpoints

## Next Steps

After verifying all endpoints:
1. Integrate with frontend application
2. Setup automated CI/CD testing
3. Configure production environment
4. Setup monitoring and logging
