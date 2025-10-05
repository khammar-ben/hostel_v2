<?php
// Script to populate MongoDB database with sample data
// This script will work once the MongoDB PHP extension is installed

echo "Populating MongoDB database with sample data...\n";

try {
    // Connect to MongoDB
    $client = new MongoDB\Client("mongodb://127.0.0.1:27017");
    $database = $client->selectDatabase('hostel_booking');
    
    echo "✅ Connected to MongoDB successfully!\n";
    
    // Clear existing collections
    $collections = ['users', 'rooms', 'activities', 'offers', 'guests', 'bookings', 'activity_bookings'];
    foreach ($collections as $collection) {
        $database->selectCollection($collection)->drop();
        echo "Cleared collection: $collection\n";
    }
    
    // Insert Users
    $users = [
        [
            'name' => 'Admin User',
            'email' => 'admin@hostel.com',
            'password' => password_hash('admin123', PASSWORD_DEFAULT),
            'email_verified_at' => new MongoDB\BSON\UTCDateTime(),
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime(),
        ],
        [
            'name' => 'John Smith',
            'email' => 'john@example.com',
            'password' => password_hash('password123', PASSWORD_DEFAULT),
            'email_verified_at' => new MongoDB\BSON\UTCDateTime(),
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime(),
        ],
    ];
    
    $usersCollection = $database->selectCollection('users');
    $usersResult = $usersCollection->insertMany($users);
    echo "✅ Inserted " . count($users) . " users\n";
    
    // Insert Rooms
    $rooms = [
        [
            'room_number' => 'R001',
            'name' => '4-Bed Mixed Dorm A',
            'type' => 'Mixed Dormitory',
            'capacity' => 4,
            'occupied' => 3,
            'floor' => 1,
            'price' => 25.00,
            'status' => 'available',
            'description' => 'Comfortable mixed dormitory with individual lockers and reading lights.',
            'amenities' => ['Free WiFi', 'AC', 'Individual Lockers', 'Reading Lights', 'Power Outlets'],
            'last_cleaned' => new MongoDB\BSON\UTCDateTime(),
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime(),
        ],
        [
            'room_number' => 'R002',
            'name' => '6-Bed Female Dorm B',
            'type' => 'Female Dormitory',
            'capacity' => 6,
            'occupied' => 6,
            'floor' => 1,
            'price' => 23.00,
            'status' => 'full',
            'description' => 'Female-only dormitory with shared bathroom facilities.',
            'amenities' => ['Free WiFi', 'AC', 'Individual Lockers', 'Hair Dryer', 'Shared Bathroom'],
            'last_cleaned' => new MongoDB\BSON\UTCDateTime(),
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime(),
        ],
        [
            'room_number' => 'R201',
            'name' => 'Private Double 201',
            'type' => 'Private Double',
            'capacity' => 2,
            'occupied' => 0,
            'floor' => 2,
            'price' => 65.00,
            'status' => 'available',
            'description' => 'Private double room with private bathroom and city view.',
            'amenities' => ['Private Bathroom', 'Free WiFi', 'TV', 'City View', 'Mini Fridge'],
            'last_cleaned' => new MongoDB\BSON\UTCDateTime(),
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime(),
        ],
        [
            'room_number' => 'R301',
            'name' => 'Private Triple 301',
            'type' => 'Private Triple',
            'capacity' => 3,
            'occupied' => 0,
            'floor' => 3,
            'price' => 75.00,
            'status' => 'maintenance',
            'description' => 'Private triple room with private bathroom and balcony.',
            'amenities' => ['Private Bathroom', 'Balcony', 'Free WiFi', 'TV', 'Mini Fridge', 'City View'],
            'last_cleaned' => new MongoDB\BSON\UTCDateTime(),
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime(),
        ],
        [
            'room_number' => 'R401',
            'name' => 'Deluxe Private 401',
            'type' => 'Deluxe Private',
            'capacity' => 2,
            'occupied' => 0,
            'floor' => 4,
            'price' => 95.00,
            'status' => 'available',
            'description' => 'Deluxe private room with premium amenities and panoramic view.',
            'amenities' => ['Private Bathroom', 'Balcony', 'Free WiFi', 'Smart TV', 'Mini Bar', 'Panoramic View', 'Air Conditioning'],
            'last_cleaned' => new MongoDB\BSON\UTCDateTime(),
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime(),
        ],
    ];
    
    $roomsCollection = $database->selectCollection('rooms');
    $roomsResult = $roomsCollection->insertMany($rooms);
    echo "✅ Inserted " . count($rooms) . " rooms\n";
    
    // Insert Activities
    $activities = [
        [
            'name' => 'City Walking Tour',
            'description' => 'Explore the historic city center with our knowledgeable local guide. Discover hidden gems, learn about local history, and experience the authentic culture of our beautiful city.',
            'short_description' => 'Guided walking tour through the historic city center',
            'price' => 25.00,
            'duration_minutes' => 120,
            'max_participants' => 15,
            'min_participants' => 3,
            'difficulty_level' => 'easy',
            'location' => 'City Center',
            'meeting_point' => 'Hostel Reception',
            'available_days' => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
            'start_time' => '10:00',
            'end_time' => '12:00',
            'image_url' => 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
            'is_active' => true,
            'advance_booking_hours' => 24,
            'what_to_bring' => 'Comfortable walking shoes, water bottle, camera',
            'rating' => 4.8,
            'total_reviews' => 127,
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime(),
        ],
        [
            'name' => 'Mountain Hiking Adventure',
            'description' => 'Challenge yourself with a guided hike through scenic mountain trails. Enjoy breathtaking views, fresh mountain air, and the satisfaction of reaching the summit.',
            'short_description' => 'Guided mountain hike with stunning views',
            'price' => 45.00,
            'duration_minutes' => 300,
            'max_participants' => 8,
            'min_participants' => 2,
            'difficulty_level' => 'hard',
            'location' => 'Mountain Trail',
            'meeting_point' => 'Hostel Reception (Transport Provided)',
            'available_days' => ['saturday', 'sunday'],
            'start_time' => '08:00',
            'end_time' => '13:00',
            'image_url' => 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
            'is_active' => true,
            'advance_booking_hours' => 48,
            'what_to_bring' => 'Hiking boots, backpack, water (2L), snacks, weather-appropriate clothing',
            'rating' => 4.9,
            'total_reviews' => 89,
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime(),
        ],
        [
            'name' => 'Cooking Class Experience',
            'description' => 'Learn to cook traditional local dishes with our expert chef. Hands-on cooking experience followed by enjoying the delicious meal you prepared.',
            'short_description' => 'Learn traditional cooking with local chef',
            'price' => 35.00,
            'duration_minutes' => 180,
            'max_participants' => 12,
            'min_participants' => 4,
            'difficulty_level' => 'easy',
            'location' => 'Hostel Kitchen',
            'meeting_point' => 'Hostel Kitchen',
            'available_days' => ['tuesday', 'thursday', 'saturday'],
            'start_time' => '18:00',
            'end_time' => '21:00',
            'image_url' => 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
            'is_active' => true,
            'advance_booking_hours' => 24,
            'what_to_bring' => 'Apron (provided), appetite for learning',
            'rating' => 4.7,
            'total_reviews' => 156,
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime(),
        ],
    ];
    
    $activitiesCollection = $database->selectCollection('activities');
    $activitiesResult = $activitiesCollection->insertMany($activities);
    echo "✅ Inserted " . count($activities) . " activities\n";
    
    // Insert Offers
    $offers = [
        [
            'offer_code' => 'WINTER2024',
            'name' => 'Winter Group Special',
            'description' => '20% off for groups of 8+ people during winter months',
            'type' => 'group-discount',
            'discount_type' => 'percentage',
            'discount_value' => 20.00,
            'min_guests' => 8,
            'min_nights' => null,
            'max_uses' => 100,
            'used_count' => 15,
            'valid_from' => new MongoDB\BSON\UTCDateTime(strtotime('2024-01-01') * 1000),
            'valid_to' => new MongoDB\BSON\UTCDateTime(strtotime('2024-03-31') * 1000),
            'status' => 'active',
            'is_public' => true,
            'conditions' => ['winter_months' => true, 'group_booking' => true],
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime(),
        ],
        [
            'offer_code' => 'SOLO2024',
            'name' => 'Solo Traveler Midweek',
            'description' => '15% off for solo travelers checking in Mon-Thu',
            'type' => 'solo-discount',
            'discount_type' => 'percentage',
            'discount_value' => 15.00,
            'min_guests' => 1,
            'min_nights' => null,
            'max_uses' => 200,
            'used_count' => 42,
            'valid_from' => new MongoDB\BSON\UTCDateTime(strtotime('2024-01-01') * 1000),
            'valid_to' => new MongoDB\BSON\UTCDateTime(strtotime('2024-12-31') * 1000),
            'status' => 'active',
            'is_public' => true,
            'conditions' => ['midweek_only' => true, 'solo_traveler' => true],
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime(),
        ],
    ];
    
    $offersCollection = $database->selectCollection('offers');
    $offersResult = $offersCollection->insertMany($offers);
    echo "✅ Inserted " . count($offers) . " offers\n";
    
    // Insert Guests
    $guests = [
        [
            'first_name' => 'John',
            'last_name' => 'Smith',
            'email' => 'john.smith@email.com',
            'phone' => '+44 7700 900123',
            'nationality' => 'British',
            'date_of_birth' => new MongoDB\BSON\UTCDateTime(strtotime('1990-05-15') * 1000),
            'id_type' => 'passport',
            'id_number' => 'GB123456789',
            'address' => '123 Main Street, London, UK',
            'emergency_contact_name' => 'Jane Smith',
            'emergency_contact_phone' => '+44 7700 900124',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime(),
        ],
        [
            'first_name' => 'Maria',
            'last_name' => 'Garcia',
            'email' => 'maria.garcia@email.com',
            'phone' => '+34 600 123 456',
            'nationality' => 'Spanish',
            'date_of_birth' => new MongoDB\BSON\UTCDateTime(strtotime('1988-08-22') * 1000),
            'id_type' => 'passport',
            'id_number' => 'ES987654321',
            'address' => 'Calle Mayor 45, Madrid, Spain',
            'emergency_contact_name' => 'Carlos Garcia',
            'emergency_contact_phone' => '+34 600 123 457',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime(),
        ],
        [
            'first_name' => 'Hans',
            'last_name' => 'Mueller',
            'email' => 'hans.mueller@email.com',
            'phone' => '+49 30 12345678',
            'nationality' => 'German',
            'date_of_birth' => new MongoDB\BSON\UTCDateTime(strtotime('1985-12-03') * 1000),
            'id_type' => 'passport',
            'id_number' => 'DE456789123',
            'address' => 'Hauptstraße 10, Berlin, Germany',
            'emergency_contact_name' => 'Anna Mueller',
            'emergency_contact_phone' => '+49 30 12345679',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime(),
        ],
    ];
    
    $guestsCollection = $database->selectCollection('guests');
    $guestsResult = $guestsCollection->insertMany($guests);
    echo "✅ Inserted " . count($guests) . " guests\n";
    
    // Get inserted IDs for relationships
    $roomIds = $roomsResult->getInsertedIds();
    $guestIds = $guestsResult->getInsertedIds();
    $activityIds = $activitiesResult->getInsertedIds();
    
    // Insert Bookings
    $bookings = [
        [
            'booking_reference' => 'BK-' . strtoupper(substr(md5(uniqid()), 0, 8)),
            'guest_id' => $guestIds[0],
            'room_id' => $roomIds[0],
            'check_in_date' => new MongoDB\BSON\UTCDateTime(strtotime('+1 day') * 1000),
            'check_out_date' => new MongoDB\BSON\UTCDateTime(strtotime('+4 days') * 1000),
            'number_of_guests' => 1,
            'total_amount' => 100.00,
            'status' => 'confirmed',
            'special_requests' => 'Late check-in requested',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime(),
        ],
        [
            'booking_reference' => 'BK-' . strtoupper(substr(md5(uniqid()), 0, 8)),
            'guest_id' => $guestIds[1],
            'room_id' => $roomIds[1],
            'check_in_date' => new MongoDB\BSON\UTCDateTime(strtotime('+2 days') * 1000),
            'check_out_date' => new MongoDB\BSON\UTCDateTime(strtotime('+7 days') * 1000),
            'number_of_guests' => 2,
            'total_amount' => 138.00,
            'status' => 'pending',
            'special_requests' => 'Ground floor room preferred',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime(),
        ],
    ];
    
    $bookingsCollection = $database->selectCollection('bookings');
    $bookingsResult = $bookingsCollection->insertMany($bookings);
    echo "✅ Inserted " . count($bookings) . " bookings\n";
    
    // Insert Activity Bookings
    $activityBookings = [
        [
            'activity_id' => $activityIds[0],
            'guest_id' => $guestIds[0],
            'booking_reference' => 'ACT-' . strtoupper(substr(md5(uniqid()), 0, 8)),
            'booking_date' => new MongoDB\BSON\UTCDateTime(strtotime('+1 day') * 1000),
            'booking_time' => new MongoDB\BSON\UTCDateTime(strtotime('10:00') * 1000),
            'participants' => 1,
            'total_amount' => 25.00,
            'per_person_price' => 25.00,
            'status' => 'confirmed',
            'special_requests' => 'First time visitor',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime(),
        ],
        [
            'activity_id' => $activityIds[1],
            'guest_id' => $guestIds[1],
            'booking_reference' => 'ACT-' . strtoupper(substr(md5(uniqid()), 0, 8)),
            'booking_date' => new MongoDB\BSON\UTCDateTime(strtotime('+3 days') * 1000),
            'booking_time' => new MongoDB\BSON\UTCDateTime(strtotime('08:00') * 1000),
            'participants' => 2,
            'total_amount' => 90.00,
            'per_person_price' => 45.00,
            'status' => 'pending',
            'special_requests' => 'Group booking',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime(),
        ],
    ];
    
    $activityBookingsCollection = $database->selectCollection('activity_bookings');
    $activityBookingsResult = $activityBookingsCollection->insertMany($activityBookings);
    echo "✅ Inserted " . count($activityBookings) . " activity bookings\n";
    
    echo "\n🎉 Database populated successfully!\n";
    echo "📊 Summary:\n";
    echo "- Users: " . count($users) . "\n";
    echo "- Rooms: " . count($rooms) . "\n";
    echo "- Activities: " . count($activities) . "\n";
    echo "- Offers: " . count($offers) . "\n";
    echo "- Guests: " . count($guests) . "\n";
    echo "- Bookings: " . count($bookings) . "\n";
    echo "- Activity Bookings: " . count($activityBookings) . "\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Make sure MongoDB is running and the PHP MongoDB extension is installed.\n";
}
