<?php
// Test MongoDB extension installation
echo "Testing MongoDB PHP Extension...\n";

if (extension_loaded('mongodb')) {
    echo "✅ MongoDB extension is loaded!\n";
    
    // Test connection
    try {
        $client = new MongoDB\Client("mongodb://127.0.0.1:27017");
        $database = $client->selectDatabase('hostel_booking');
        $collection = $database->selectCollection('test');
        
        // Insert a test document
        $result = $collection->insertOne(['test' => 'Hello MongoDB!', 'timestamp' => new MongoDB\BSON\UTCDateTime()]);
        echo "✅ MongoDB connection successful! Document ID: " . $result->getInsertedId() . "\n";
        
        // Find the document
        $document = $collection->findOne(['_id' => $result->getInsertedId()]);
        echo "✅ Document retrieved: " . json_encode($document->toArray()) . "\n";
        
    } catch (Exception $e) {
        echo "❌ MongoDB connection failed: " . $e->getMessage() . "\n";
        echo "Make sure MongoDB is running on port 27017\n";
    }
} else {
    echo "❌ MongoDB extension is NOT loaded!\n";
    echo "Please install the MongoDB PHP extension first.\n";
    echo "Download from: https://pecl.php.net/package/mongodb\n";
    echo "For XAMPP, download the Thread Safe version for PHP 8.2\n";
}
