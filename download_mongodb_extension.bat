@echo off
echo ========================================
echo    MongoDB PHP Extension Downloader
echo ========================================
echo.

echo Step 1: Creating download directory...
if not exist "mongodb_extension" mkdir mongodb_extension
cd mongodb_extension

echo Step 2: Downloading MongoDB PHP Extension...
echo Downloading for PHP 8.2 Thread Safe (ZTS)...

:: Try to download using PowerShell
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://windows.php.net/downloads/pecl/releases/mongodb/1.21.0/php_mongodb-1.21.0-8.2-ts-vs16-x64.zip' -OutFile 'mongodb_extension.zip'}"

if exist "mongodb_extension.zip" (
    echo ✅ Download successful!
    echo.
    echo Step 3: Extracting files...
    powershell -Command "Expand-Archive -Path 'mongodb_extension.zip' -DestinationPath '.' -Force"
    
    echo Step 4: Copying to XAMPP...
    copy "php_mongodb.dll" "C:\xampp\php\ext\"
    
    if exist "C:\xampp\php\ext\php_mongodb.dll" (
        echo ✅ Extension copied successfully!
        echo.
        echo Step 5: Adding to php.ini...
        echo extension=mongodb >> C:\xampp\php\php.ini
        
        echo ✅ Installation complete!
        echo.
        echo Please restart Apache in XAMPP Control Panel
        echo Then run: php test_mongodb.php
    ) else (
        echo ❌ Failed to copy extension
    )
) else (
    echo ❌ Download failed
    echo.
    echo Manual installation required:
    echo 1. Go to: https://pecl.php.net/package/mongodb
    echo 2. Download Windows DLL for PHP 8.2 Thread Safe
    echo 3. Extract php_mongodb.dll to C:\xampp\php\ext\
    echo 4. Add "extension=mongodb" to C:\xampp\php\php.ini
    echo 5. Restart Apache
)

echo.
echo ========================================
echo    Installation Complete!
echo ========================================
pause
