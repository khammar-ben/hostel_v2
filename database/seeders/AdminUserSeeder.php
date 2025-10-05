<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if admin user already exists
        $existingUser = User::where('email', 'admin@happyhostel.com')->first();
        
        if ($existingUser) {
            $this->command->info('Admin user already exists!');
            $this->command->info('Email: admin@happyhostel.com');
            $this->command->info('Password: admin123456');
            return;
        }

        // Create admin user
        $user = User::create([
            'name' => 'Admin User',
            'email' => 'admin@happyhostel.com',
            'password' => Hash::make('admin123456'),
            'email_verified_at' => now(),
        ]);

        $this->command->info('✅ Admin user created successfully!');
        $this->command->info('📧 Email: admin@happyhostel.com');
        $this->command->info('🔑 Password: admin123456');
        $this->command->info('');
        $this->command->info('You can now login to the admin dashboard at: /login');
    }
}