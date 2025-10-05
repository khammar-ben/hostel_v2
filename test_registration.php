<?php
// Test registration functionality
echo "Testing registration functionality...\n";

// Test data
$testData = [
    'name' => 'Test User',
    'email' => 'test@example.com',
    'password' => 'password123',
    'password_confirmation' => 'password123'
];

// Make a test request to the registration endpoint
$url = 'http://localhost:8000/register';
$data = json_encode($testData);

$options = [
    'http' => [
        'header' => "Content-type: application/json\r\n",
        'method' => 'POST',
        'content' => $data
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);

if ($result === FALSE) {
    echo "❌ Registration test failed - could not connect to server\n";
    echo "Make sure Laravel server is running: php artisan serve\n";
} else {
    $response = json_decode($result, true);
    if (isset($response['message']) && $response['message'] === 'Registration successful') {
        echo "✅ Registration test successful!\n";
        echo "User created: " . $response['user']['name'] . " (" . $response['user']['email'] . ")\n";
    } else {
        echo "❌ Registration test failed:\n";
        echo "Response: " . $result . "\n";
    }
}

echo "\n";
echo "You can now test registration at: http://localhost:8000\n";
echo "Or visit the admin registration page: http://localhost:8000/register\n";
?>
