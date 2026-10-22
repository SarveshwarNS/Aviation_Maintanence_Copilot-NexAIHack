@echo off
title Aviation Maintenance Copilot - Streamlit UI
echo ========================================================
echo Starting Aviation Maintenance Copilot - Streamlit UI
echo App URL: http://localhost:8501
echo ========================================================
cd /d "%~dp0"
"%~dp0venv\Scripts\python.exe" -m streamlit run ui.py
pause
