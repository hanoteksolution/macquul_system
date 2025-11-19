@echo off
echo ========================================
echo    Starting Django Server for Mobile
echo ========================================
echo.

echo Stopping any existing Django servers...
taskkill /f /im python.exe 2>nul

echo Starting Django server on all interfaces...
echo Server will be accessible at: http://10.161.1.4:8000
echo.

python manage.py runserver 0.0.0.0:8000

echo.
echo Server stopped.
pause
