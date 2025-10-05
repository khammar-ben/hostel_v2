# Install MongoDB PHP Extension for XAMPP on Windows

## Method 1: Using PECL (Recommended)

### Step 1: Open Command Prompt as Administrator
1. Press `Win + R`
2. Type `cmd`
3. Press `Ctrl + Shift + Enter` to run as Administrator

### Step 2: Navigate to XAMPP PHP directory
```cmd
cd C:\xampp\php
```

### Step 3: Install MongoDB extension
```cmd
pecl install mongodb
```

### Step 4: Add extension to php.ini
1. Open `C:\xampp\php\php.ini` in a text editor
2. Add this line: `extension=mongodb`
3. Save the file

### Step 5: Restart Apache
1. Open XAMPP Control Panel
2. Stop Apache
3. Start Apache again

## Method 2: Manual Installation

### Step 1: Download the Extension
1. Go to: https://pecl.php.net/package/mongodb
2. Download the Windows DLL for PHP 8.2 (Thread Safe version)
3. Extract `php_mongodb.dll`

### Step 2: Install the Extension
1. Copy `php_mongodb.dll` to `C:\xampp\php\ext\`
2. Open `C:\xampp\php\php.ini` in a text editor
3. Add this line: `extension=mongodb`
4. Save the file

### Step 3: Restart Apache
1. Open XAMPP Control Panel
2. Stop Apache
3. Start Apache again

## Method 3: Using Composer (Alternative)

If the above methods don't work, you can try:

```cmd
composer require mongodb/mongodb --ignore-platform-req=ext-mongodb
```

## Verify Installation

### Test 1: Check if extension is loaded
```cmd
php -m | findstr mongodb
```

### Test 2: Run our test script
```cmd
php test_mongodb.php
```

### Test 3: Check in phpinfo()
1. Create a file `info.php` in `C:\xampp\htdocs\`
2. Add: `<?php phpinfo(); ?>`
3. Visit `http://localhost/info.php`
4. Search for "mongodb"

## Troubleshooting

### If PECL is not found:
1. Download PECL from: https://pecl.php.net/
2. Extract to `C:\xampp\php\`
3. Try the installation again

### If extension still not working:
1. Check PHP version: `php --version`
2. Make sure you downloaded the correct version (Thread Safe for XAMPP)
3. Verify the file is in the correct location: `C:\xampp\php\ext\php_mongodb.dll`
4. Check php.ini syntax (no spaces around the equals sign)

### If you get permission errors:
1. Run Command Prompt as Administrator
2. Make sure XAMPP is not running when copying files
3. Check file permissions

## After Installation

Once the extension is installed, you can:

1. **Run Laravel seeder:**
   ```cmd
   php artisan db:seed
   ```

2. **Test the connection:**
   ```cmd
   php test_mongodb.php
   ```

3. **Start your application:**
   ```cmd
   php artisan serve
   ```

Your MongoDB connection should now work perfectly!
