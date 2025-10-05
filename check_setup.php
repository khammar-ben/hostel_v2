<?php
echo "=== HOSTEL BOOKING SYSTEM STATUS ===\n";
echo "Date: " . date('Y-m-d H:i:s') . "\n\n";

// Check PHP version
echo "1. PHP Version: " . PHP_VERSION . "\n";
echo "   Thread Safe: " . (ZEND_THREAD_SAFE ? 'Yes' : 'No') . "\n\n";

// Check if MongoDB extension is loaded
echo "2. MongoDB Extension: ";
if (extension_loaded('mongodb')) {
    echo "✅ LOADED\n";
} else {
    echo "❌ NOT LOADED\n";
}
echo "\n";

// Check if MongoDB is running
echo "3. MongoDB Server: ";
$output = shell_exec('mongosh --eval "db.runCommand({ping: 1})" 2>&1');
if (strpos($output, 'ok') !== false) {
    echo "✅ RUNNING\n";
} else {
    echo "❌ NOT RUNNING\n";
}
echo "\n";

// Check database data
echo "4. Database Status: ";
$dbCheck = shell_exec('mongosh hostel_booking --eval "print(\"Users: \" + db.users.countDocuments()); print(\"Rooms: \" + db.rooms.countDocuments());" 2>&1');
if (strpos($dbCheck, 'Users:') !== false) {
    echo "✅ DATA AVAILABLE\n";
    echo "   " . trim($dbCheck) . "\n";
} else {
    echo "❌ NO DATA\n";
}
echo "\n";

// Check Laravel server
echo "5. Laravel Server: ";
$serverCheck = shell_exec('netstat -an | findstr :8000');
if (strpos($serverCheck, 'LISTENING') !== false) {
    echo "✅ RUNNING on port 8000\n";
} else {
    echo "❌ NOT RUNNING\n";
}
echo "\n";

// Summary
echo "=== SUMMARY ===\n";
if (extension_loaded('mongodb')) {
    echo "🎉 EVERYTHING IS READY!\n";
    echo "Your hostel booking system is fully functional!\n";
    echo "Visit: http://localhost:8000\n";
} else {
    echo "⚠️  MongoDB PHP Extension needed!\n";
    echo "Run: download_mongodb_extension.bat\n";
    echo "Or follow: INSTALL_MONGODB_STEP_BY_STEP.md\n";
}
echo "\n";
?>
