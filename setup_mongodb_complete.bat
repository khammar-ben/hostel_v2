@echo off
echo ========================================
echo    MongoDB Setup for Hostel Booking
echo ========================================
echo.

echo Step 1: Checking MongoDB service...
sc query MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB service not found!
    echo Please install MongoDB Community Server first:
    echo Download from: https://www.mongodb.com/try/download/community
    echo.
    pause
    exit /b 1
) else (
    echo ✅ MongoDB service found
)

echo.
echo Step 2: Starting MongoDB service...
net start MongoDB

echo.
echo Step 3: Installing MongoDB PHP Extension...
echo Please follow these steps:
echo 1. Download MongoDB PHP extension for PHP 8.2 Thread Safe
echo 2. Extract php_mongodb.dll to C:\xampp\php\ext\
echo 3. Add "extension=mongodb" to C:\xampp\php\php.ini
echo 4. Restart Apache in XAMPP
echo.

echo Step 4: Testing MongoDB connection...
php test_mongodb.php

echo.
echo Step 5: Populating database...
php populate_mongodb.php

echo.
echo Step 6: Running Laravel seeder...
php artisan db:seed

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Your hostel booking database is now ready with:
echo - 2 Users (including admin)
echo - 15 Rooms (various types)
echo - 6 Activities
echo - 6 Special Offers
echo - 12 Guests
echo - Sample Bookings
echo - Activity Bookings
echo.
pause
