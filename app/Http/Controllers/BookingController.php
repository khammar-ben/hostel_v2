<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Guest;
use App\Models\Room;
use App\Services\TelegramService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $bookings = Booking::with(['guest', 'room'])
                ->orderBy('created_at', 'desc')
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $bookings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch bookings: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                // Guest information
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'nullable|string|max:20',
                'nationality' => 'nullable|string|max:100',
                'date_of_birth' => 'nullable|date',
                'id_type' => 'nullable|string|max:50',
                'id_number' => 'nullable|string|max:100',
                'address' => 'nullable|string',
                'emergency_contact_name' => 'nullable|string|max:255',
                'emergency_contact_phone' => 'nullable|string|max:20',
                
                // Booking information
                'room_id' => 'required|exists:rooms,id',
                'check_in_date' => 'required|date|after_or_equal:today',
                'check_out_date' => 'required|date|after:check_in_date',
                'number_of_guests' => 'required|integer|min:1',
                'special_requests' => 'nullable|string',
            ]);

            // Check room availability
            $room = Room::findOrFail($validated['room_id']);
            if (!$room->isAvailableForBooking()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Room is not available for booking'
                ], 400);
            }

            // Check if room has enough capacity
            if ($validated['number_of_guests'] > $room->capacity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Number of guests exceeds room capacity'
                ], 400);
            }

            // Check if room can accommodate additional guests
            if (!$room->canAccommodate($validated['number_of_guests'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Room does not have enough available beds for the requested number of guests'
                ], 400);
            }

            // Calculate total amount
            $numberOfNights = \Carbon\Carbon::parse($validated['check_in_date'])
                ->diffInDays(\Carbon\Carbon::parse($validated['check_out_date']));
            $totalAmount = $numberOfNights * $room->price;

            // Create guest
            $guest = Guest::create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'nationality' => $validated['nationality'],
                'date_of_birth' => $validated['date_of_birth'],
                'id_type' => $validated['id_type'],
                'id_number' => $validated['id_number'],
                'address' => $validated['address'],
                'emergency_contact_name' => $validated['emergency_contact_name'],
                'emergency_contact_phone' => $validated['emergency_contact_phone'],
            ]);

            // Create booking
            $booking = Booking::create([
                'booking_reference' => 'BK' . strtoupper(Str::random(8)),
                'guest_id' => $guest->id,
                'room_id' => $validated['room_id'],
                'check_in_date' => $validated['check_in_date'],
                'check_out_date' => $validated['check_out_date'],
                'number_of_guests' => $validated['number_of_guests'],
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'special_requests' => $validated['special_requests'],
            ]);

            // Update room occupancy and status when booking is created
            $room->increment('occupied', $validated['number_of_guests']);
            $room->fresh()->updateStatusBasedOnOccupancy();

            // Send Telegram notification for new booking
            try {
                $telegramService = new TelegramService();
                $telegramService->sendBookingNotification($booking->load(['guest', 'room']));
            } catch (\Exception $e) {
                // Log error but don't fail the booking creation
                \Log::error('Failed to send Telegram notification: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Booking request submitted successfully',
                'data' => [
                    'booking' => $booking->load(['guest', 'room']),
                    'booking_reference' => $booking->booking_reference
                ]
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create booking: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $booking = Booking::with(['guest', 'room'])->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $booking
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $booking = Booking::findOrFail($id);

            $validated = $request->validate([
                'status' => 'required|in:pending,confirmed,checked_in,checked_out,cancelled',
            ]);

            $updateData = ['status' => $validated['status']];

            // Set timestamps and update room status based on booking status
            if ($validated['status'] === 'confirmed' && $booking->status === 'pending') {
                $updateData['confirmed_at'] = now();
                // Room status already updated when booking was created
                $booking->room->fresh()->updateStatusBasedOnOccupancy();
            } elseif ($validated['status'] === 'checked_in' && $booking->status === 'confirmed') {
                $updateData['checked_in_at'] = now();
                // Occupancy already counted when booking was created
                $booking->room->fresh()->updateStatusBasedOnOccupancy();
            } elseif ($validated['status'] === 'checked_out' && $booking->status === 'checked_in') {
                $updateData['checked_out_at'] = now();
                // Decrease occupancy when guest checks out
                $booking->room->decrement('occupied', $booking->number_of_guests);
                // Update room status based on new occupancy
                $booking->room->fresh()->updateStatusBasedOnOccupancy();
            } elseif ($validated['status'] === 'cancelled') {
                // If booking is cancelled, decrease occupancy and update status
                $booking->room->decrement('occupied', $booking->number_of_guests);
                $booking->room->fresh()->updateStatusBasedOnOccupancy();
            }

            $booking->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Booking updated successfully',
                'data' => $booking->load(['guest', 'room'])
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update booking: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $booking = Booking::findOrFail($id);
            $room = $booking->room;
            
            // Decrement room occupancy for any active booking
            if (in_array($booking->status, ['pending', 'confirmed', 'checked_in'])) {
                $room->decrement('occupied', $booking->number_of_guests);
            }
            
            // Delete the booking
            $booking->delete();
            
            // Update room status based on current occupancy
            $room->fresh()->updateStatusBasedOnOccupancy();

            return response()->json([
                'success' => true,
                'message' => 'Booking deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete booking: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available rooms for booking
     */
    public function getAvailableRooms(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'check_in_date' => 'required|date|after_or_equal:today',
                'check_out_date' => 'required|date|after:check_in_date',
                'number_of_guests' => 'required|integer|min:1',
            ]);

            // Get rooms that meet basic criteria
            $rooms = Room::where('capacity', '>=', $validated['number_of_guests'])
                ->get()
                ->filter(function ($room) {
                    return $room->isAvailableForBooking();
                });

            // Filter out rooms with conflicting bookings
            $availableRooms = $rooms->filter(function ($room) use ($validated) {
                $conflictingBookings = Booking::where('room_id', $room->id)
                    ->where('status', '!=', 'cancelled')
                    ->where(function ($query) use ($validated) {
                        $query->whereBetween('check_in_date', [$validated['check_in_date'], $validated['check_out_date']])
                              ->orWhereBetween('check_out_date', [$validated['check_in_date'], $validated['check_out_date']])
                              ->orWhere(function ($q) use ($validated) {
                                  $q->where('check_in_date', '<=', $validated['check_in_date'])
                                    ->where('check_out_date', '>=', $validated['check_out_date']);
                              });
                    })
                    ->exists();

                return !$conflictingBookings;
            });

            return response()->json([
                'success' => true,
                'data' => $availableRooms->values()
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch available rooms: ' . $e->getMessage()
            ], 500);
        }
    }
}
