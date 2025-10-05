<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rooms = [
            // Ground Floor Rooms
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
                'last_cleaned' => now()->subHours(2),
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
                'last_cleaned' => now()->subHours(1),
            ],
            [
                'room_number' => 'R003',
                'name' => '8-Bed Male Dorm C',
                'type' => 'Male Dormitory',
                'capacity' => 8,
                'occupied' => 5,
                'floor' => 1,
                'price' => 22.00,
                'status' => 'available',
                'description' => 'Male-only dormitory with shared facilities and common area.',
                'amenities' => ['Free WiFi', 'AC', 'Individual Lockers', 'Shared Bathroom', 'Common Area'],
                'last_cleaned' => now()->subHours(3),
            ],
            [
                'room_number' => 'R004',
                'name' => 'Private Single 101',
                'type' => 'Private Single',
                'capacity' => 1,
                'occupied' => 1,
                'floor' => 1,
                'price' => 45.00,
                'status' => 'occupied',
                'description' => 'Private single room with shared bathroom facilities.',
                'amenities' => ['Private Space', 'Shared Bathroom', 'Free WiFi', 'Quiet Area', 'Reading Desk'],
                'last_cleaned' => now()->subDays(1),
            ],
            
            // Second Floor Rooms
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
                'last_cleaned' => now()->subDays(2),
            ],
            [
                'room_number' => 'R202',
                'name' => '6-Bed Mixed Dorm D',
                'type' => 'Mixed Dormitory',
                'capacity' => 6,
                'occupied' => 4,
                'floor' => 2,
                'price' => 24.00,
                'status' => 'available',
                'description' => 'Mixed dormitory with modern amenities and city view.',
                'amenities' => ['Free WiFi', 'AC', 'Individual Lockers', 'City View', 'Reading Lights'],
                'last_cleaned' => now()->subHours(2),
            ],
            [
                'room_number' => 'R203',
                'name' => 'Private Twin 203',
                'type' => 'Private Twin',
                'capacity' => 2,
                'occupied' => 2,
                'floor' => 2,
                'price' => 55.00,
                'status' => 'occupied',
                'description' => 'Private twin room with two single beds and shared bathroom.',
                'amenities' => ['Two Single Beds', 'Shared Bathroom', 'Free WiFi', 'Reading Desk', 'Storage'],
                'last_cleaned' => now()->subDays(1),
            ],
            [
                'room_number' => 'R204',
                'name' => '10-Bed Mixed Dorm E',
                'type' => 'Mixed Dormitory',
                'capacity' => 10,
                'occupied' => 7,
                'floor' => 2,
                'price' => 19.00,
                'status' => 'available',
                'description' => 'Large mixed dormitory perfect for groups.',
                'amenities' => ['Free WiFi', 'AC', 'Individual Lockers', 'Large Windows', 'Group Area'],
                'last_cleaned' => now()->subHours(4),
            ],
            
            // Third Floor Rooms
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
                'last_cleaned' => now()->subDays(3),
            ],
            [
                'room_number' => 'R302',
                'name' => '12-Bed Mixed Dorm F',
                'type' => 'Mixed Dormitory',
                'capacity' => 12,
                'occupied' => 8,
                'floor' => 3,
                'price' => 18.00,
                'status' => 'available',
                'description' => 'Economy option with basic amenities and large windows.',
                'amenities' => ['Free WiFi', 'Individual Lockers', 'Large Windows', 'Reading Lights'],
                'last_cleaned' => now()->subHours(4),
            ],
            [
                'room_number' => 'R303',
                'name' => 'Private Family 303',
                'type' => 'Private Family',
                'capacity' => 4,
                'occupied' => 4,
                'floor' => 3,
                'price' => 85.00,
                'status' => 'occupied',
                'description' => 'Family room with private bathroom and kitchenette.',
                'amenities' => ['Private Bathroom', 'Kitchenette', 'Free WiFi', 'TV', 'Family Area', 'Balcony'],
                'last_cleaned' => now()->subDays(1),
            ],
            [
                'room_number' => 'R304',
                'name' => '8-Bed Female Dorm G',
                'type' => 'Female Dormitory',
                'capacity' => 8,
                'occupied' => 6,
                'floor' => 3,
                'price' => 21.00,
                'status' => 'available',
                'description' => 'Female-only dormitory with modern facilities.',
                'amenities' => ['Free WiFi', 'AC', 'Individual Lockers', 'Hair Dryer', 'Shared Bathroom', 'City View'],
                'last_cleaned' => now()->subHours(2),
            ],
            
            // Fourth Floor Rooms
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
                'last_cleaned' => now()->subHours(1),
            ],
            [
                'room_number' => 'R402',
                'name' => 'Private Quad 402',
                'type' => 'Private Quad',
                'capacity' => 4,
                'occupied' => 0,
                'floor' => 4,
                'price' => 80.00,
                'status' => 'available',
                'description' => 'Private quad room perfect for groups of friends.',
                'amenities' => ['Private Bathroom', 'Free WiFi', 'TV', 'Group Area', 'Storage', 'City View'],
                'last_cleaned' => now()->subHours(2),
            ],
            [
                'room_number' => 'R403',
                'name' => '6-Bed Mixed Dorm H',
                'type' => 'Mixed Dormitory',
                'capacity' => 6,
                'occupied' => 3,
                'floor' => 4,
                'price' => 26.00,
                'status' => 'available',
                'description' => 'Premium mixed dormitory with rooftop access.',
                'amenities' => ['Free WiFi', 'AC', 'Individual Lockers', 'Rooftop Access', 'City View', 'Reading Lights'],
                'last_cleaned' => now()->subHours(1),
            ],
        ];

        foreach ($rooms as $roomData) {
            Room::create($roomData);
        }
    }
}
