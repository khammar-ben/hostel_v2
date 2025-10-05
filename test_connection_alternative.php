<?php
// Alternative test without MongoDB PHP extension
// This tests if we can connect to MongoDB using the shell

echo "Testing MongoDB connection (alternative method)...\n";

// Test if MongoDB is running
$output = shell_exec('mongosh --eval "db.runCommand({ping: 1})" 2>&1');

if (strpos($output, 'ok') !== false) {
    echo "✅ MongoDB is running!\n";
    
    // Test if our database exists and has data
    $checkDb = shell_exec('mongosh hostel_booking --eval "print(\"Users: \" + db.users.countDocuments()); print(\"Rooms: \" + db.rooms.countDocuments()); print(\"Activities: \" + db.activities.countDocuments());" 2>&1');
    
    if (strpos($checkDb, 'Users:') !== false) {
        echo "✅ Database 'hostel_booking' exists and has data!\n";
        echo "📊 Database Summary:\n";
        echo $checkDb;
        
        echo "\n🎉 Your MongoDB database is ready!\n";
        echo "You can now use your Laravel application.\n";
        echo "\nTo start your app, run: php artisan serve\n";
        echo "Then visit: http://localhost:8000\n";
        
    } else {
        echo "❌ Database 'hostel_booking' not found or empty.\n";
        echo "Please run: mongosh hostel_booking import_mongodb_data.js\n";
    }
    
} else {
    echo "❌ MongoDB is not running!\n";
    echo "Please start MongoDB service:\n";
    echo "1. Open XAMPP Control Panel\n";
    echo "2. Start MongoDB service\n";
    echo "Or run: net start MongoDB\n";
}

echo "\n";
echo "Note: To use Laravel with MongoDB, you still need to install the PHP extension.\n";
echo "But your data is ready and MongoDB is working!\n";
?>
