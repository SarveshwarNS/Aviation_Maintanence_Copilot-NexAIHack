@echo off
title Aviation Maintenance Copilot - Backend API
echo ========================================================
echo Starting Aviation Maintenance Copilot - FastAPI Backend
echo Local API: http://127.0.0.1:8000
echo Swagger  : http://127.0.0.1:8000/docs
echo ========================================================
cd /d "%~dp0"
"%~dp0venv\Scripts\python.exe" -m uvicorn app:app --reload --host 127.0.0.1 --port 8000
pause
