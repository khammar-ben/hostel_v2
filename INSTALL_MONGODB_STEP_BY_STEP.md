# Step-by-Step MongoDB PHP Extension Installation

## Your System Info:
- PHP Version: 8.2.12
- Type: ZTS (Thread Safe) ✅
- XAMPP: ✅

## Step 1: Download the Extension

1. **Go to**: https://pecl.php.net/package/mongodb
2. **Click**: "Windows DLL" link
3. **Download**: The latest version for PHP 8.2 Thread Safe
4. **File should be**: `php_mongodb-1.21.0-8.2-ts-vs16-x64.zip` (or similar)

## Step 2: Extract and Install

1. **Extract the ZIP file**
2. **Copy `php_mongodb.dll`** to `C:\xampp\php\ext\`
3. **Open** `C:\xampp\php\php.ini` in a text editor
4. **Add this line**: `extension=mongodb`
5. **Save the file**

## Step 3: Restart Services

1. **Open XAMPP Control Panel**
2. **Stop Apache**
3. **Start Apache**

## Step 4: Test Installation

Run this command:
```bash
php test_mongodb.php
```

You should see:
```
✅ MongoDB extension is loaded!
✅ MongoDB connection successful!
```

## Alternative: Manual Download Links

If the above doesn't work, try these direct links:

### For PHP 8.2 Thread Safe:
- https://windows.php.net/downloads/pecl/releases/mongodb/
- Look for: `php_mongodb-1.21.0-8.2-ts-vs16-x64.zip`

### For PHP 8.2 Non-Thread Safe:
- Look for: `php_mongodb-1.21.0-8.2-nts-vs16-x64.zip`

## Troubleshooting

### If extension still not working:
1. Check if file exists: `C:\xampp\php\ext\php_mongodb.dll`
2. Check php.ini: Look for `extension=mongodb`
3. Restart Apache completely
4. Check PHP error logs

### If you get "file not found":
- Make sure you downloaded the Thread Safe (TS) version
- Check the file is in the correct location
- Verify the file name is exactly `php_mongodb.dll`

## After Installation

Once the extension is installed:
1. Your Laravel app will automatically connect to MongoDB
2. All your data will be available
3. Registration will work with MongoDB
4. You can run: `php artisan db:seed` to add more data

## Quick Test Commands

```bash
# Test extension
php test_mongodb.php

# Test Laravel connection
php artisan tinker
# Then in tinker: User::count()

# Test registration
# Visit: http://localhost:8000/register
```

Your MongoDB database is ready with all data - just need the PHP extension!
