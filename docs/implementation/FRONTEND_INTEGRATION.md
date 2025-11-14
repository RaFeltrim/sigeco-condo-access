# Frontend Integration Guide

This guide explains how to integrate the React frontend with the SIGECO backend API.

## Overview

The frontend now includes complete API service layer for communicating with the backend. All API calls are centralized in `src/lib/api/` with TypeScript types and error handling.

## Setup

### 1. Configure Environment

Create `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### 2. Install axios (if not already installed)

```bash
npm install axios
```

### 3. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## API Services

All API services are available in `src/lib/api/`:

### Authentication Service

```typescript
import { authService } from '@/lib/api';

// Login
const { token, user } = await authService.login({
  email: 'admin@sigeco.com',
  password: 'admin123'
});

// Register
const { user } = await authService.register({
  email: 'new@user.com',
  password: 'password',
  name: 'New User',
  role: 'PORTEIRO'
});

// Get current user
const { user } = await authService.getCurrentUser();

// Logout
authService.logout();
```

### Residents Service

```typescript
import { residentsService } from '@/lib/api';

// Get all residents
const { residents } = await residentsService.getAll();

// Get with filters
const { residents } = await residentsService.getAll({
  status: 'ATIVO',
  search: 'Ana'
});

// Get by ID
const { resident } = await residentsService.getById(id);

// Create resident
const { resident } = await residentsService.create({
  name: 'Maria Santos',
  email: 'maria@email.com',
  phone: '(11) 98888-7777',
  document: '111.222.333-44',
  type: 'PROPRIETARIO',
  unitId: 'unit-id'
});

// Update resident
const { resident } = await residentsService.update(id, {
  phone: '(11) 99999-8888'
});

// Delete resident
await residentsService.delete(id);
```

### Appointments Service

```typescript
import { appointmentsService } from '@/lib/api';

// Get all appointments
const { appointments } = await appointmentsService.getAll();

// Get with filters
const { appointments } = await appointmentsService.getAll({
  status: 'CONFIRMADO',
  date: '2024-11-15'
});

// Create appointment
const { appointment } = await appointmentsService.create({
  visitorName: 'Dr. Roberto Silva',
  visitorDoc: '555.666.777-88',
  visitorPhone: '(11) 97777-6666',
  destination: 'Apto 101',
  reason: 'Consulta médica',
  scheduledDate: '2024-11-15',
  scheduledTime: '14:00',
  residentId: 'resident-id',
  unitId: 'unit-id'
});

// Update appointment
const { appointment } = await appointmentsService.update(id, {
  status: 'CONFIRMADO'
});

// Delete appointment
await appointmentsService.delete(id);
```

### Visits Service

```typescript
import { visitsService } from '@/lib/api';

// Get all visits
const { visits } = await visitsService.getAll();

// Get with filters
const { visits } = await visitsService.getAll({
  status: 'ATIVO',
  date: '2024-11-10'
});

// Register visit
const { visit } = await visitsService.create({
  visitorName: 'Paulo Oliveira',
  document: '999.888.777-66',
  unitId: 'unit-id',
  purpose: 'Visita social'
});

// Checkout visitor
const { visit } = await visitsService.checkout(id);
```

### Dashboard Service

```typescript
import { dashboardService } from '@/lib/api';

// Get dashboard stats
const { stats, recentVisits } = await dashboardService.getStats();

// stats contains:
// - visitsToday
// - activeVisitors
// - visitsWeek
// - pendingAppointments
// - totalResidents

// Get reports
const { visits } = await dashboardService.getReports({
  startDate: '2024-11-01',
  endDate: '2024-11-30'
});
```

## Example: Update Login Page

Replace mock authentication with real API:

```typescript
// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user } = await authService.login({ email, password });
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${user.name}!`,
      });

      // Redirect based on role
      if (user.role === 'ADMIN' || user.role === 'SINDICO') {
        navigate('/admin-dashboard');
      } else {
        navigate('/porteiro-dashboard');
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* form fields */}
    </form>
  );
}
```

## Example: Update Dashboard with Real Data

```typescript
// src/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { dashboardService } from '@/lib/api';
import type { DashboardData } from '@/lib/api';

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const dashboardData = await dashboardService.getStats();
      setData(dashboardData);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="stats">
        <div>Visits Today: {data.stats.visitsToday}</div>
        <div>Active Visitors: {data.stats.activeVisitors}</div>
        <div>Week Total: {data.stats.visitsWeek}</div>
      </div>
      
      <div className="recent-visits">
        <h2>Recent Visits</h2>
        {data.recentVisits.map(visit => (
          <div key={visit.id}>
            {visit.visitorName} - Unit {visit.unit.number}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Error Handling

The API client includes automatic error handling:

- **401 Unauthorized**: Automatically clears token and redirects to login
- **Network errors**: Rejected promise with error details
- **Validation errors**: Returns error object with details

Example error handling:

```typescript
try {
  await residentsService.create(data);
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 400) {
      // Validation error
      console.error('Validation errors:', error.response.data.details);
    } else if (error.response?.status === 409) {
      // Conflict (duplicate)
      console.error('Email already exists');
    } else {
      // Other errors
      console.error('Server error:', error.response?.data.error);
    }
  }
}
```

## Authentication State Management

For global auth state, consider using React Context or a state management library:

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService, isAuthenticated } from '@/lib/api';
import type { User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    if (isAuthenticated()) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const { user } = await authService.getCurrentUser();
      setUser(user);
    } catch (error) {
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { user } = await authService.login({ email, password });
    setUser(user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

## Real-time Updates with Socket.IO

For real-time features, add Socket.IO client:

```bash
npm install socket.io-client
```

```typescript
// src/lib/socket.ts
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3001';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});

// Connect when authenticated
export function connectSocket() {
  socket.connect();
  socket.emit('join:visits');
  socket.emit('join:notifications');
}

// Disconnect on logout
export function disconnectSocket() {
  socket.disconnect();
}

// Listen for visit updates
socket.on('visit:created', (visit) => {
  console.log('New visit registered:', visit);
  // Update UI
});

socket.on('visit:checkout', (visit) => {
  console.log('Visitor checked out:', visit);
  // Update UI
});
```

## Testing Integration

### 1. Test Authentication

```bash
# Login page should work with real credentials
Email: admin@sigeco.com
Password: admin123
```

### 2. Test API Calls

Open browser DevTools Network tab and verify:
- API calls go to `http://localhost:3001/api`
- Authorization header includes JWT token
- Responses return actual data from database

### 3. Test Error Handling

- Try invalid login credentials
- Try accessing protected pages without token
- Check console for error messages

## Troubleshooting

### CORS Errors

If you see CORS errors:
1. Verify backend CORS_ORIGIN includes frontend URL
2. Check backend `.env`: `CORS_ORIGIN=http://localhost:5173`
3. Restart backend server

### 401 Unauthorized

- Token expired (JWT expires after 7 days)
- Invalid token
- Backend not running
- Solution: Login again to get new token

### Connection Refused

- Backend not running
- Wrong API_BASE_URL in frontend .env
- Solution: Start backend with `npm run dev` in backend folder

### Network Timeout

- Backend taking too long to respond
- Database not connected
- Solution: Check backend logs, verify PostgreSQL is running

## Migration Checklist

To migrate existing pages to use real API:

- [ ] Update Login page to use authService
- [ ] Add AuthContext for global auth state
- [ ] Update AdminDashboard to load real stats
- [ ] Update GerenciamentoMoradoresPage to use residentsService
- [ ] Update AgendamentoPage to use appointmentsService
- [ ] Update PorteiroDashboard to use visitsService
- [ ] Add Socket.IO for real-time updates
- [ ] Remove all mock data
- [ ] Update error handling
- [ ] Test all workflows end-to-end

## Next Steps

1. **Update Login Page**: Implement real authentication
2. **Add Auth Context**: Global auth state management
3. **Migrate Pages**: Replace mock data with API calls
4. **Add Real-time**: Implement Socket.IO updates
5. **Error Handling**: Improve user feedback
6. **Loading States**: Add loading indicators
7. **Optimizations**: Add caching, pagination

## Resources

- Backend API Documentation: `/backend/README.md`
- API Testing Guide: `/backend/TESTING.md`
- Backend Implementation: `/docs/BACKEND_IMPLEMENTATION.md`
