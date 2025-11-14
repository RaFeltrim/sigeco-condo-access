@echo off
REM Test Orchestration Script - Runs all tests and generates test-errors.log
REM Usage: run-tests-and-log.bat

echo ========================================
echo   SIGECO Test Orchestration System
echo ========================================
echo.

npm run test:all:with-log

echo.
echo ========================================
echo   Test execution complete!
echo   Check test-errors.log for results
echo ========================================

pause
