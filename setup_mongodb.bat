@echo off
echo Setting up MongoDB for Laravel...
echo.

echo 1. Checking if MongoDB service is running...
sc query MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo MongoDB service not found. Please install MongoDB first.
    echo Download from: https://www.mongodb.com/try/download/community
    pause
    exit /b 1
)

echo 2. Starting MongoDB service...
net start MongoDB

echo 3. Testing MongoDB connection...
php test_mongodb.php

echo.
echo Setup complete! If you see any errors, please install the MongoDB PHP extension.
echo Download from: https://pecl.php.net/package/mongodb
pause
