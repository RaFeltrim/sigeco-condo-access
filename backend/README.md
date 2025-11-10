# SIGECO Backend API

Backend REST API for the SIGECO Condominium Access Management System.

## 🚀 Technologies

- **Node.js** + **TypeScript**
- **Express.js** - Web framework
- **Prisma** - ORM and database management
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Socket.IO** - Real-time features
- **Zod** - Input validation
- **Winston** - Logging

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

## 🔧 Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials and secrets:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/sigeco_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3001
```

### 3. Database Setup

Run Prisma migrations to create the database schema:

```bash
npm run prisma:migrate
```

Generate Prisma Client:

```bash
npm run prisma:generate
```

### 4. Seed Database (Optional)

Populate the database with initial data:

```bash
npm run prisma:seed
```

This creates:
- Admin user: `admin@sigeco.com` / `admin123`
- Sample units and residents
- Sample appointments

### 5. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## 📚 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Residents (Moradores)

- `GET /api/residents` - List all residents
- `GET /api/residents/:id` - Get resident by ID
- `POST /api/residents` - Create new resident (Admin/Sindico only)
- `PUT /api/residents/:id` - Update resident (Admin/Sindico only)
- `DELETE /api/residents/:id` - Delete resident (Admin/Sindico only)

### Appointments (Agendamentos)

- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Visits (Acessos)

- `GET /api/visits` - List visits/access logs
- `POST /api/visits` - Register new visit
- `PUT /api/visits/:id/checkout` - Check out visitor

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/reports` - Get reports data

### Health Check

- `GET /api/health` - Health check endpoint

## 🔐 Authentication

All endpoints (except `/api/auth/login` and `/api/auth/register`) require authentication.

Include the JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

## 👥 User Roles

- **ADMIN** - Full system access
- **SINDICO** - Condominium manager (create/edit residents, manage units)
- **PORTEIRO** - Security guard (register visits, view appointments)

## 🔄 Real-time Features

The backend supports real-time updates via Socket.IO:

### Events

- `join:visits` - Join room for visit updates
- `join:notifications` - Join room for notifications
- `visit:created` - Emitted when a new visit is registered
- `visit:checkout` - Emitted when a visitor checks out

### Example Client Connection

```typescript
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.emit('join:visits');

socket.on('visit:created', (visit) => {
  console.log('New visit registered:', visit);
});
```

## 📊 Database Schema

### Main Entities

- **User** - System users (admin, porteiro, sindico)
- **Unit** - Residential units/apartments
- **Resident** - Condominium residents
- **Appointment** - Scheduled visits
- **Visit** - Active visitor access logs
- **Employee** - Condominium employees
- **Delivery** - Package deliveries
- **Supply** - Supplies/resources management
- **AccessLog** - Audit trail
- **Backup** - System backups
- **Notification** - System notifications

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:studio` - Open Prisma Studio (DB GUI)
- `npm run prisma:seed` - Seed database with initial data
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Database Management

View and edit data using Prisma Studio:

```bash
npm run prisma:studio
```

This opens a web interface at `http://localhost:5555`

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Prevent abuse
- **JWT** - Secure authentication
- **bcrypt** - Password hashing
- **Input Validation** - Zod schemas
- **SQL Injection Protection** - Prisma ORM

## 📝 Logging

Logs are written to console using Winston logger.

Log levels:
- `error` - Error messages
- `warn` - Warning messages
- `info` - Informational messages
- `http` - HTTP requests
- `debug` - Debug messages (development only)

## 🚀 Production Deployment

### 1. Build

```bash
npm run build
```

### 2. Set Environment Variables

Configure production environment variables:

```env
NODE_ENV=production
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-secure-secret-key"
PORT=3001
CORS_ORIGIN="https://your-frontend-domain.com"
```

### 3. Run Migrations

```bash
npm run prisma:migrate
```

### 4. Start Server

```bash
npm start
```

### Docker Deployment (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build
RUN npm run prisma:generate

EXPOSE 3001

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t sigeco-backend .
docker run -p 3001:3001 --env-file .env sigeco-backend
```

## 📖 API Documentation

For detailed API documentation, import the endpoints into Postman or use tools like Swagger/OpenAPI.

### Example Requests

#### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@sigeco.com", "password": "admin123"}'
```

#### Get Residents

```bash
curl -X GET http://localhost:3001/api/residents \
  -H "Authorization: Bearer <your-token>"
```

#### Create Appointment

```bash
curl -X POST http://localhost:3001/api/appointments \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "visitorName": "João Silva",
    "visitorDoc": "123.456.789-00",
    "visitorPhone": "(11) 99999-1234",
    "destination": "Apto 101",
    "reason": "Visita familiar",
    "scheduledDate": "2024-11-15",
    "scheduledTime": "14:00",
    "residentId": "<resident-id>",
    "unitId": "<unit-id>"
  }'
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🐛 Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### Port Already in Use

Change PORT in .env or kill the process using port 3001:

```bash
# Find process
lsof -i :3001

# Kill process
kill -9 <PID>
```

### Prisma Issues

Regenerate Prisma Client:

```bash
npm run prisma:generate
```

Reset database (⚠️ destructive):

```bash
npx prisma migrate reset
```

## 📞 Support

For issues or questions, contact the SIGECO development team.
