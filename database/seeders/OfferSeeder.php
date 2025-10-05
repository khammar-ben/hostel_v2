<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Offer;

class OfferSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $offers = [
            [
                'offer_code' => 'OFF0001',
                'name' => 'Winter Group Special',
                'description' => '20% off for groups of 8+ people during winter months',
                'type' => 'group-discount',
                'discount_type' => 'percentage',
                'discount_value' => 20.00,
                'min_guests' => 8,
                'min_nights' => null,
                'max_uses' => 100,
                'used_count' => 15,
                'valid_from' => '2024-01-01',
                'valid_to' => '2024-03-31',
                'status' => 'active',
                'is_public' => true,
                'conditions' => ['winter_months' => true, 'group_booking' => true]
            ],
            [
                'offer_code' => 'OFF0002',
                'name' => 'Solo Traveler Midweek',
                'description' => '15% off for solo travelers checking in Mon-Thu',
                'type' => 'solo-discount',
                'discount_type' => 'percentage',
                'discount_value' => 15.00,
                'min_guests' => 1,
                'min_nights' => null,
                'max_uses' => 200,
                'used_count' => 42,
                'valid_from' => '2024-01-01',
                'valid_to' => '2024-12-31',
                'status' => 'active',
                'is_public' => true,
                'conditions' => ['midweek_only' => true, 'solo_traveler' => true]
            ],
            [
                'offer_code' => 'OFF0003',
                'name' => 'Extended Stay Deal',
                'description' => 'Stay 7+ nights and get the 8th night free',
                'type' => 'length-discount',
                'discount_type' => 'free_night',
                'discount_value' => 1.00,
                'min_guests' => 1,
                'min_nights' => 7,
                'max_uses' => 50,
                'used_count' => 8,
                'valid_from' => '2024-01-15',
                'valid_to' => '2024-06-30',
                'status' => 'active',
                'is_public' => true,
                'conditions' => ['extended_stay' => true, 'min_nights' => 7]
            ],
            [
                'offer_code' => 'OFF0004',
                'name' => 'Student Summer Special',
                'description' => '25% off for students with valid ID during summer',
                'type' => 'student-discount',
                'discount_type' => 'percentage',
                'discount_value' => 25.00,
                'min_guests' => 1,
                'min_nights' => null,
                'max_uses' => 150,
                'used_count' => 0,
                'valid_from' => '2024-06-01',
                'valid_to' => '2024-08-31',
                'status' => 'scheduled',
                'is_public' => true,
                'conditions' => ['student_id_required' => true, 'summer_season' => true]
            ],
            [
                'offer_code' => 'OFF0005',
                'name' => 'Early Bird 2024',
                'description' => 'Book 30 days in advance and save 10%',
                'type' => 'early-booking',
                'discount_type' => 'percentage',
                'discount_value' => 10.00,
                'min_guests' => 1,
                'min_nights' => null,
                'max_uses' => 75,
                'used_count' => 23,
                'valid_from' => '2024-01-01',
                'valid_to' => '2024-01-15',
                'status' => 'expired',
                'is_public' => true,
                'conditions' => ['advance_booking' => true, 'min_days_ahead' => 30]
            ],
            [
                'offer_code' => 'OFF0006',
                'name' => 'Loyalty Member Bonus',
                'description' => 'Extra 5% off for returning guests',
                'type' => 'loyalty',
                'discount_type' => 'percentage',
                'discount_value' => 5.00,
                'min_guests' => 1,
                'min_nights' => null,
                'max_uses' => null,
                'used_count' => 67,
                'valid_from' => '2024-01-01',
                'valid_to' => '2024-12-31',
                'status' => 'active',
                'is_public' => true,
                'conditions' => ['returning_guest' => true, 'loyalty_member' => true]
            ]
        ];

        foreach ($offers as $offer) {
            Offer::create($offer);
        }
    }
}
