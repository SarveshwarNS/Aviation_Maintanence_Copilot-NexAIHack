@echo off
title Aviation Maintenance Copilot Launcher
echo ========================================================
echo Launching Aviation Maintenance Copilot (API + UI)...
echo ========================================================
cd /d "%~dp0"

echo 1. Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "Aviation Copilot - API" cmd /k ""%~dp0run_api.bat""

timeout /t 3 /nobreak >nul

echo 2. Starting Streamlit UI on http://localhost:8501 ...
start "Aviation Copilot - UI" cmd /k ""%~dp0run_ui.bat""

echo.
echo Both services have been launched!
echo - Streamlit UI : http://localhost:8501
echo - FastAPI Docs : http://127.0.0.1:8000/docs
echo ========================================================
