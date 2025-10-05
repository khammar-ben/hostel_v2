<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@hostel.com',
            'password' => bcrypt('admin123'),
            'email_verified_at' => now(),
        ]);

        // Create additional users
        User::factory(5)->create();

        // Seed all data
        $this->call([
            RoomSeeder::class,
            ActivitySeeder::class,
            OfferSeeder::class,
            GuestBookingSeeder::class,
        ]);

        $this->command->info('Database seeded successfully with comprehensive data!');
    }
}
