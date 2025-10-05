<?php
// Test MongoDB connection through Laravel
require_once 'vendor/autoload.php';

use App\Models\User;

echo "Testing MongoDB connection through Laravel...\n";

try {
    // Test if we can create a User model instance
    $user = new User();
    echo "✅ User model loaded successfully!\n";
    
    // Test if we can access the database
    $userCount = User::count();
    echo "✅ Database connection working! Found $userCount users.\n";
    
    // Test if we can create a new user
    $testUser = User::create([
        'name' => 'Test User',
        'email' => 'test@mongodb.com',
        'password' => bcrypt('password123')
    ]);
    
    echo "✅ User creation successful! ID: " . $testUser->id . "\n";
    
    // Clean up test user
    $testUser->delete();
    echo "✅ Test user cleaned up.\n";
    
    echo "\n🎉 MongoDB connection is working perfectly!\n";
    echo "Your registration should now work with MongoDB!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "This is likely due to the missing MongoDB PHP extension.\n";
    echo "Please install it to use MongoDB with Laravel.\n";
}
?>
