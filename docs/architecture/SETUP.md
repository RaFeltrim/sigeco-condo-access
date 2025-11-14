# SIGECO - Environment Setup Guide

> **Complete step-by-step guide for setting up the SIGECO development environment**

**Last Updated:** January 13, 2025  
**Version:** 1.0.0

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Database Setup](#database-setup)
- [Troubleshooting](#troubleshooting)
- [IDE Setup](#ide-setup)
- [Additional Tools](#additional-tools)

---

## Prerequisites

### Required Software

#### 1. **Node.js** (v20.x or higher)

**Check if installed:**
```bash
node --version
# Expected: v20.x.x or higher
```

**Installation:**
- **Windows/Mac:** Download from [nodejs.org](https://nodejs.org/)
- **Linux (Ubuntu/Debian):**
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```
- **Using nvm (Recommended):**
  ```bash
  # Install nvm
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  
  # Install Node.js 20
  nvm install 20
  nvm use 20
  ```

#### 2. **npm** (v10.x or higher)

npm is included with Node.js, but verify the version:

```bash
npm --version
# Expected: v10.x.x or higher
```

**Update npm if needed:**
```bash
npm install -g npm@latest
```

#### 3. **Git**

**Check if installed:**
```bash
git --version
```

**Installation:**
- **Windows:** Download from [git-scm.com](https://git-scm.com/)
- **Mac:** `brew install git` (requires Homebrew)
- **Linux:** `sudo apt-get install git`

#### 4. **Modern Web Browser**

- **Chrome** (recommended for development)
- **Edge** (Chromium-based)
- **Firefox** (ESR or latest)

---

### Optional but Recommended

- **VS Code** - Recommended IDE ([download](https://code.visualstudio.com/))
- **PostgreSQL** - If using database features (see [Database Setup](#database-setup))
- **Docker** - For containerized development (optional)

---

## Installation

### 1. Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/YOUR_USERNAME/sigeco-condo-access.git

# OR clone via SSH (if you have SSH keys set up)
git clone git@github.com:YOUR_USERNAME/sigeco-condo-access.git

# Navigate to project directory
cd sigeco-condo-access
```

### 2. Install Frontend Dependencies

```bash
# Install all frontend dependencies
npm install
```

**Expected output:**
```
added XXX packages in YYs
```

**If you encounter errors:**
- Try `npm install --legacy-peer-deps` if there are peer dependency conflicts
- Ensure you're using Node.js 20.x
- Clear npm cache: `npm cache clean --force`

### 3. Install Backend Dependencies

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Return to project root
cd ..
```

---

## Configuration

### 1. Environment Variables

The project uses environment variables for configuration. Create a `.env` file in the project root.

#### **Copy the example file:**

```bash
# Copy the example environment file
cp .env.example .env
```

#### **Configure the `.env` file:**

Edit the `.env` file with your preferred editor:

```bash
# Open in VS Code
code .env

# Or use nano
nano .env

# Or use vim
vim .env
```

**Example `.env` configuration:**

```env
# Application
VITE_APP_NAME=SIGECO
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:9323

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000

# Features Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ACTIVITY_LOGGER=true

# Backend (if running locally)
DATABASE_URL=postgresql://user:password@localhost:5432/sigeco
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRATION=24h

# External Services (optional)
VITE_WHATSAPP_SUPPORT_NUMBER=+5511999999999
```

**Important Notes:**
- ⚠️ **Never commit `.env` to Git** - It's in `.gitignore` by default
- 🔐 Change `JWT_SECRET` to a strong random string for production
- 📝 `VITE_*` variables are exposed to the frontend (use for non-sensitive data only)

### 2. Backend Configuration (Optional)

If you're running the backend locally, you'll need to configure it:

#### **Create backend `.env` file:**

```bash
cd backend
cp .env.example .env
```

#### **Edit `backend/.env`:**

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sigeco

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-jwt-refresh-secret
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# CORS
ALLOWED_ORIGINS=http://localhost:9323,http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Running the Application

### Development Mode

#### **Start Frontend Development Server:**

```bash
# From project root
npm run dev
```

**Expected output:**
```
  VITE v6.4.1  ready in XXX ms

  ➜  Local:   http://localhost:9323/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**Open browser:**  
Navigate to **http://localhost:9323**

#### **Start Backend Development Server (Optional):**

```bash
# In a new terminal, from project root
cd backend
npm run dev
```

**Expected output:**
```
🚀 Server started on port 3000
📦 Connected to database
```

### Production Preview

To preview the production build locally:

```bash
# Build for production
npm run build

# Preview the build
npm run preview
```

---

## Database Setup

### Using PostgreSQL (Recommended)

#### 1. **Install PostgreSQL**

**Windows:**
- Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- Run the installer and note the password you set

**Mac:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### 2. **Create Database**

```bash
# Access PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE sigeco;

# Create user (optional)
CREATE USER sigeco_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sigeco TO sigeco_user;

# Exit psql
\q
```

#### 3. **Run Prisma Migrations**

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed
```

### Using SQLite (Development Only)

For quick development without PostgreSQL:

#### **Update `backend/.env`:**

```env
DATABASE_URL="file:./dev.db"
```

#### **Run migrations:**

```bash
cd backend
npm run prisma:migrate
```

---

## Troubleshooting

### Common Issues and Solutions

#### **Issue: `npm install` fails with peer dependency errors**

**Solution:**
```bash
npm install --legacy-peer-deps
```

#### **Issue: Port 9323 is already in use**

**Solution:**
```bash
# Find process using port 9323
# Windows
netstat -ano | findstr :9323

# Mac/Linux
lsof -i :9323

# Kill the process or change port in vite.config.ts
```

#### **Issue: TypeScript errors on first run**

**Solution:**
```bash
# Clear TypeScript build info
rm tsconfig.test.tsbuildinfo

# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

#### **Issue: Database connection errors**

**Solution:**
1. Verify PostgreSQL is running:
   ```bash
   # Mac/Linux
   pg_isready
   
   # Windows - check Services
   ```
2. Check `DATABASE_URL` in `.env`
3. Ensure database exists:
   ```bash
   psql -U postgres -c "\l" | grep sigeco
   ```

#### **Issue: Hot Module Replacement (HMR) not working**

**Solution:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev
```

#### **Issue: "Cannot find module '@/...'" errors**

**Solution:**
- Ensure `tsconfig.json` has correct path mappings
- Restart TypeScript server
- Check that `vite.config.ts` has the alias configured

---

## IDE Setup

### Visual Studio Code (Recommended)

#### **Recommended Extensions:**

Install these extensions for the best development experience:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",           // ESLint
    "esbenp.prettier-vscode",           // Prettier
    "bradlc.vscode-tailwindcss",        // Tailwind CSS IntelliSense
    "Prisma.prisma",                    // Prisma syntax highlighting
    "ms-playwright.playwright",         // Playwright Test Runner
    "unifiedjs.vscode-mdx",            // MDX support
    "mikestead.dotenv",                // .env syntax highlighting
    "YoavBls.pretty-ts-errors"         // Better TypeScript error messages
  ]
}
```

**Install via command palette:**
```
Cmd/Ctrl + Shift + P → "Extensions: Install Extensions"
```

#### **Workspace Settings:**

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

#### **Debug Configuration:**

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:9323",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

---

## Additional Tools

### Browser DevTools

#### **React Developer Tools**
- [Chrome Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

#### **Redux DevTools** (if using Redux)
- [Chrome Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)

### Testing Tools

#### **Install Playwright Browsers:**

```bash
npx playwright install
```

#### **Cypress Setup:**

Cypress is already configured. To open Cypress:

```bash
npm run test:cypress
```

---

## Verification

### Verify Installation

Run these commands to verify everything is set up correctly:

```bash
# 1. Check dependencies are installed
npm list --depth=0

# 2. Run TypeScript type checking
npm run type-check

# 3. Run linting
npm run lint

# 4. Run tests
npm run test

# 5. Build the project
npm run build

# 6. Run full validation
npm run validate
```

**All commands should complete without errors.**

---

## Next Steps

After successful setup:

1. **Explore the codebase:**
   - Read [ARCHITECTURE.md](./ARCHITECTURE.md) for project structure
   - Check out [FEATURES.md](./FEATURES.md) for available features

2. **Start developing:**
   - Review [DEVELOPMENT.md](./DEVELOPMENT.md) for development workflow
   - Read [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines

3. **Run tests:**
   - See [TESTING.md](./TESTING.md) for testing guide

4. **Check project status:**
   - Run `npm run verify:mvp` to see MVP completion status
   - Review [ROADMAP.md](../ROADMAP.md) for development plan

---

## Getting Help

If you encounter issues not covered in this guide:

1. **Check existing documentation:**
   - [TROUBLESHOOTING](../docs/TROUBLESHOOTING.md)
   - [FAQ](../docs/FAQ.md) (if available)

2. **Search issues:**
   - GitHub Issues for known problems

3. **Ask for help:**
   - Create a new GitHub Issue with:
     - Your environment (OS, Node version, npm version)
     - Error messages
     - Steps to reproduce

---

<div align="center">

**Setup Complete! You're ready to develop with SIGECO.**

[← Back to README](../README.md) | [Architecture Guide →](./ARCHITECTURE.md)

</div>
