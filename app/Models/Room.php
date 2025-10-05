<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    protected $fillable = [
        'room_number',
        'name',
        'type',
        'capacity',
        'occupied',
        'floor',
        'price',
        'status',
        'description',
        'amenities',
        'last_cleaned',
    ];

    protected $casts = [
        'amenities' => 'array',
        'last_cleaned' => 'datetime',
        'price' => 'decimal:2',
    ];

    // Accessor for availability
    public function getAvailableAttribute()
    {
        return $this->occupied < $this->capacity;
    }

    // Accessor for occupancy percentage
    public function getOccupancyPercentageAttribute()
    {
        if ($this->capacity === 0) return 0;
        return round(($this->occupied / $this->capacity) * 100);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Update room status based on current occupancy
     */
    public function updateStatusBasedOnOccupancy(): void
    {
        if ($this->occupied >= $this->capacity) {
            $this->update(['status' => 'full']);
        } elseif ($this->occupied > 0) {
            $this->update(['status' => 'occupied']);
        } else {
            $this->update(['status' => 'available']);
        }
    }

    /**
     * Check if room is available for booking
     */
    public function isAvailableForBooking(): bool
    {
        return in_array($this->status, ['available', 'occupied']) && $this->occupied < $this->capacity;
    }

    /**
     * Check if room can accommodate additional guests
     */
    public function canAccommodate(int $additionalGuests): bool
    {
        return ($this->occupied + $additionalGuests) <= $this->capacity;
    }

    /**
     * Get available beds/spaces in the room
     */
    public function getAvailableSpaces(): int
    {
        return max(0, $this->capacity - $this->occupied);
    }

    /**
     * Calculate occupancy based on active bookings
     */
    public function calculateActualOccupancy(): int
    {
        return $this->bookings()
            ->whereIn('status', ['confirmed', 'checked_in'])
            ->sum('number_of_guests');
    }

    /**
     * Sync occupancy with actual bookings
     */
    public function syncOccupancy(): void
    {
        $actualOccupancy = $this->calculateActualOccupancy();
        $this->update(['occupied' => $actualOccupancy]);
        $this->updateStatusBasedOnOccupancy();
    }
}
