<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $rooms = Room::orderBy('room_number')->get();
            return response()->json([
                'success' => true,
                'data' => $rooms
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch rooms: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a public listing of rooms for visitors with availability information.
     */
    public function publicIndex(): JsonResponse
    {
        try {
            // Sync occupancy for all rooms first
            $rooms = Room::where('status', '!=', 'maintenance')
                ->orderBy('room_number')
                ->get();
            
            // Sync occupancy for each room
            foreach ($rooms as $room) {
                $room->syncOccupancy();
            }
            
            $rooms = $rooms->map(function ($room) {
                // Calculate availability status
                $availableSpaces = $room->getAvailableSpaces();
                $publicStatus = 'available';
                
                if ($room->status === 'maintenance') {
                    $publicStatus = 'maintenance';
                } elseif ($availableSpaces === 0) {
                    $publicStatus = 'full';
                } elseif ($room->occupied > 0) {
                    $publicStatus = 'occupied';
                } else {
                    $publicStatus = 'available';
                }
                
                return [
                    'id' => $room->id,
                    'room_number' => $room->room_number,
                    'name' => $room->name,
                    'type' => $room->type,
                    'capacity' => $room->capacity,
                    'floor' => $room->floor,
                    'price' => $room->price,
                    'status' => $publicStatus,
                    'description' => $room->description,
                    'amenities' => $room->amenities,
                    'is_available_for_booking' => $room->isAvailableForBooking(),
                    'can_accommodate_more' => $availableSpaces > 0,
                    'created_at' => $room->created_at,
                    'updated_at' => $room->updated_at,
                ];
            });
            
            return response()->json([
                'success' => true,
                'data' => $rooms
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch rooms: ' . $e->getMessage()
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
                'room_number' => 'required|string|unique:rooms,room_number',
                'name' => 'required|string|max:255',
                'type' => 'required|string|max:255',
                'capacity' => 'required|integer|min:1',
                'floor' => 'required|integer|min:1',
                'price' => 'required|numeric|min:0',
                'status' => 'required|in:available,occupied,full,maintenance',
                'description' => 'nullable|string',
                'amenities' => 'nullable|array',
                'amenities.*' => 'string',
            ]);

            $room = Room::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Room created successfully',
                'data' => $room
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
                'message' => 'Failed to create room: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $room = Room::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $room
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Room not found'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $room = Room::findOrFail($id);

            $validated = $request->validate([
                'room_number' => 'required|string|unique:rooms,room_number,' . $id,
                'name' => 'required|string|max:255',
                'type' => 'required|string|max:255',
                'capacity' => 'required|integer|min:1',
                'occupied' => 'integer|min:0',
                'floor' => 'required|integer|min:1',
                'price' => 'required|numeric|min:0',
                'status' => 'required|in:available,occupied,full,maintenance',
                'description' => 'nullable|string',
                'amenities' => 'nullable|array',
                'amenities.*' => 'string',
            ]);

            $room->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Room updated successfully',
                'data' => $room
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
                'message' => 'Failed to update room: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $room = Room::findOrFail($id);
            $room->delete();

            return response()->json([
                'success' => true,
                'message' => 'Room deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete room: ' . $e->getMessage()
            ], 500);
        }
    }
}
