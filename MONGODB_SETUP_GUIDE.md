# MongoDB Setup Guide for Hostel Booking System

## Prerequisites

1. **MongoDB Community Server** - Download from: https://www.mongodb.com/try/download/community
2. **XAMPP** (already installed)
3. **MongoDB PHP Extension** for PHP 8.2

## Step 1: Install MongoDB Server

1. Download MongoDB Community Server for Windows
2. Run the installer and follow the setup wizard
3. Choose "Complete" installation
4. Install MongoDB as a Windows Service
5. Install MongoDB Compass (optional but recommended)

## Step 2: Install MongoDB PHP Extension

### Option A: Using PECL (Recommended)
```bash
# In your XAMPP directory
C:\xampp\php\pecl.bat install mongodb
```

### Option B: Manual Installation
1. Download MongoDB PHP extension for PHP 8.2 Thread Safe:
   - Go to: https://pecl.php.net/package/mongodb
   - Download the Windows DLL for PHP 8.2 (Thread Safe version)
2. Extract `php_mongodb.dll` to `C:\xampp\php\ext\`
3. Open `C:\xampp\php\php.ini` in a text editor
4. Add this line: `extension=mongodb`
5. Save the file
6. Restart Apache in XAMPP Control Panel

## Step 3: Verify Installation

Run the test script:
```bash
php test_mongodb.php
```

You should see:
```
✅ MongoDB extension is loaded!
✅ MongoDB connection successful!
```

## Step 4: Import Data

### Option A: Using the Batch File (Easiest)
```bash
import_data.bat
```

### Option B: Using MongoDB Shell
```bash
mongo hostel_booking import_mongodb_data.js
```

### Option C: Using Laravel Seeder (After PHP extension is installed)
```bash
php artisan db:seed
```

## Step 5: Verify Data Import

Check your database:
```bash
mongo hostel_booking --eval "db.users.find().count()"
```

## Database Structure

Your `hostel_booking` database will contain:

### Collections:
- **users** - Admin and regular users
- **rooms** - 15 different room types across 4 floors
- **activities** - 6 different activities and tours
- **offers** - 6 special offers and discounts
- **guests** - 12 sample guests from different countries
- **bookings** - 5 room bookings with various statuses
- **activity_bookings** - 3 activity bookings

### Room Types:
- Mixed Dormitories (4, 6, 8, 10, 12 beds)
- Female Dormitories (6, 8 beds)
- Male Dormitory (8 beds)
- Private Single, Double, Twin, Triple
- Private Family, Quad
- Deluxe Private

### Activities:
- City Walking Tour
- Mountain Hiking Adventure
- Cooking Class Experience
- Bike City Tour
- Photography Workshop
- Pub Crawl Night

### Special Offers:
- Winter Group Special (20% off)
- Solo Traveler Midweek (15% off)
- Extended Stay Deal (8th night free)
- Student Summer Special (25% off)
- Early Bird 2024 (10% off)
- Loyalty Member Bonus (5% off)

## Troubleshooting

### MongoDB Extension Not Found
- Make sure you downloaded the Thread Safe version for PHP 8.2
- Check that `php_mongodb.dll` is in `C:\xampp\php\ext\`
- Verify `extension=mongodb` is in `php.ini`
- Restart Apache after making changes

### Connection Refused
- Make sure MongoDB service is running: `net start MongoDB`
- Check if MongoDB is running on port 27017
- Verify firewall settings

### Data Import Issues
- Make sure MongoDB is running before importing
- Check that the `hostel_booking` database exists
- Verify the import script has proper permissions

## Next Steps

1. Start your Laravel application: `php artisan serve`
2. Visit `http://localhost:8000` to see your hostel booking system
3. Use admin credentials: `admin@hostel.com` / `admin123`

## Support

If you encounter any issues:
1. Check the MongoDB logs
2. Verify PHP error logs
3. Ensure all services are running
4. Check file permissions

Your hostel booking system is now ready with a fully populated MongoDB database!
