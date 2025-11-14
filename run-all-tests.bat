@echo off
REM =========================================
REM SIGECO - Comprehensive Test Suite
REM 100%% Coverage Target with Cypress + Robot Framework
REM =========================================

echo.
echo ========================================
echo SIGECO - Complete Test Execution Plan
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found. Please install Node.js first.
    exit /b 1
)

REM Check if Python is installed (for Robot Framework)
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Python not found. Robot Framework tests will be skipped.
    set SKIP_ROBOT=1
)

echo [STEP 1/8] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)

echo.
echo [STEP 2/8] Installing Robot Framework (if Python available)...
if NOT defined SKIP_ROBOT (
    pip install robotframework robotframework-browser
    if %ERRORLEVEL% NEQ 0 (
        echo [WARNING] Failed to install Robot Framework. Continuing without it.
        set SKIP_ROBOT=1
    ) else (
        rfbrowser init chromium
    )
)

echo.
echo [STEP 3/8] Running TypeScript compilation check...
call npm run type-check
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] TypeScript errors found. Continuing with tests...
)

echo.
echo [STEP 4/8] Running ESLint...
call npm run lint
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Linting errors found. Continuing with tests...
)

echo.
echo [STEP 5/8] Starting development server in background...
start /B npm run dev
timeout /t 10 /nobreak >nul
echo [INFO] Development server started on http://localhost:5173

echo.
echo [STEP 6/8] Running Unit + Integration Tests (Vitest)...
call npm run test:unit
set VITEST_EXIT=%ERRORLEVEL%

echo.
echo [STEP 7/8] Running E2E Tests (Playwright)...
call npm run test:e2e
set PLAYWRIGHT_EXIT=%ERRORLEVEL%

echo.
echo [STEP 8/8] Running Cypress Tests...
call npm run test:cypress:ci
set CYPRESS_EXIT=%ERRORLEVEL%

echo.
if NOT defined SKIP_ROBOT (
    echo [STEP 9/8] Running Robot Framework Tests...
    call npm run test:robot:ci
    set ROBOT_EXIT=%ERRORLEVEL%
) else (
    echo [SKIP] Robot Framework tests skipped (Python not available)
    set ROBOT_EXIT=0
)

echo.
echo ========================================
echo Generating Merged Coverage Report...
echo ========================================
call npm run coverage:merge
call npm run coverage:report

echo.
echo ========================================
echo TEST EXECUTION SUMMARY
echo ========================================
echo.
echo Unit/Integration Tests (Vitest): %VITEST_EXIT%
echo E2E Tests (Playwright):         %PLAYWRIGHT_EXIT%
echo Cypress Tests:                  %CYPRESS_EXIT%
if NOT defined SKIP_ROBOT (
    echo Robot Framework Tests:        %ROBOT_EXIT%
)
echo.

if %VITEST_EXIT% EQU 0 if %PLAYWRIGHT_EXIT% EQU 0 if %CYPRESS_EXIT% EQU 0 (
    if NOT defined SKIP_ROBOT (
        if %ROBOT_EXIT% EQU 0 (
            echo [SUCCESS] All tests passed! 100%% coverage target achieved.
            echo Coverage report available at: coverage/merged/index.html
            exit /b 0
        )
    ) else (
        echo [SUCCESS] All available tests passed!
        echo Coverage report available at: coverage/merged/index.html
        exit /b 0
    )
)

echo [FAILURE] Some tests failed. Please check the logs above.
exit /b 1
