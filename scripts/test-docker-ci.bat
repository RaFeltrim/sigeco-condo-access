@echo off
REM ==============================================================================
REM Docker CI/CD Local Test Script (Windows)
REM ==============================================================================
REM This script validates the Docker-based CI/CD setup locally before pushing
REM to GitHub. It mirrors the exact steps that run in GitHub Actions.
REM ==============================================================================

setlocal enabledelayedexpansion

echo.
echo ======================================================================
echo Docker CI/CD Local Validation Script
echo ======================================================================
echo.

REM ==============================================================================
REM Step 1: Validate Docker Setup
REM ==============================================================================
echo [STEP 1] Validating Docker installation...

where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop.
    exit /b 1
)

docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker daemon is not running. Please start Docker Desktop.
    exit /b 1
)

echo [SUCCESS] Docker is installed and running
echo.

REM ==============================================================================
REM Step 2: Build Docker Image (Validation Target)
REM ==============================================================================
echo [STEP 2] Building Docker image (validation target)...
echo This may take 5-10 minutes on first run...
echo.

docker build -t sigeco-ci:validate --target validate .
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build validation image
    exit /b 1
)

echo [SUCCESS] Validation image built successfully
echo.

REM ==============================================================================
REM Step 3: Build Docker Image (Test Target)
REM ==============================================================================
echo [STEP 3] Building Docker image (test target)...
echo.

docker build -t sigeco-ci:test --target test .
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build test image
    exit /b 1
)

echo [SUCCESS] Test image built successfully
echo.

REM ==============================================================================
REM Step 4: Run Validation (Type Check, Lint, Build)
REM ==============================================================================
echo [STEP 4] Running validation inside Docker container...
echo.

docker run --rm -e CI=true sigeco-ci:validate npm run validate
if %errorlevel% neq 0 (
    echo [ERROR] Validation failed
    exit /b 1
)

echo [SUCCESS] Validation passed (type-check, lint, build)
echo.

REM ==============================================================================
REM Step 5: Verify Cypress Installation
REM ==============================================================================
echo [STEP 5] Verifying Cypress binary inside container...
echo.

docker run --rm sigeco-ci:test npx cypress verify
if %errorlevel% neq 0 (
    echo [ERROR] Cypress binary verification failed
    exit /b 1
)

echo [SUCCESS] Cypress binary verified successfully
echo.

REM ==============================================================================
REM Step 6: Check Cypress Info
REM ==============================================================================
echo [STEP 6] Checking Cypress info...
echo.

docker run --rm sigeco-ci:test npx cypress info
echo.

REM ==============================================================================
REM Summary
REM ==============================================================================
echo.
echo ======================================================================
echo [SUCCESS] Docker CI/CD Setup Validation Complete!
echo ======================================================================
echo.
echo Your Docker-based CI environment is ready. Key points:
echo.
echo   [CHECKMARK] Docker image builds successfully
echo   [CHECKMARK] Validation pipeline works (type-check, lint, build)
echo   [CHECKMARK] Cypress binary is installed and verified
echo.
echo Next steps:
echo   1. Install dependencies: npm install
echo   2. Push changes to GitHub: git push
echo   3. Monitor GitHub Actions workflows
echo   4. Check for any real test failures (not environment issues)
echo.
echo ======================================================================
echo To run Cypress tests locally inside Docker:
echo   docker run --rm --network host -it sigeco-ci:test
echo   # Inside container: npm run dev ^& sleep 10 ^&^& npm run test:cypress:ci
echo ======================================================================
echo.
echo Happy coding! 🚀
echo.

pause
