<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class OfferController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Offer::query();

            // Search filter
            if ($request->has('search') && $request->search) {
                $query->where(function($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%')
                      ->orWhere('description', 'like', '%' . $request->search . '%')
                      ->orWhere('offer_code', 'like', '%' . $request->search . '%');
                });
            }

            // Status filter
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            // Type filter
            if ($request->has('type') && $request->type !== 'all') {
                $query->where('type', $request->type);
            }

            // Sort by
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            
            switch ($sortBy) {
                case 'usage':
                    $query->orderBy('used_count', $sortOrder);
                    break;
                case 'expiry':
                    $query->orderBy('valid_to', $sortOrder);
                    break;
                case 'discount':
                    $query->orderBy('discount_value', $sortOrder);
                    break;
                default:
                    $query->orderBy('created_at', $sortOrder);
            }

            $offers = $query->get();

            return response()->json([
                'success' => true,
                'data' => $offers,
                'message' => 'Offers retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve offers',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'type' => 'required|in:group-discount,solo-discount,length-discount,student-discount,early-booking,seasonal,loyalty',
                'discount_type' => 'required|in:percentage,fixed_amount,free_night',
                'discount_value' => 'required|numeric|min:0',
                'min_guests' => 'required|integer|min:1',
                'min_nights' => 'nullable|integer|min:1',
                'max_uses' => 'nullable|integer|min:1',
                'valid_from' => 'required|date',
                'valid_to' => 'required|date|after:valid_from',
                'status' => 'in:active,scheduled,expired,paused,cancelled',
                'is_public' => 'boolean',
                'conditions' => 'nullable|array'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $offer = Offer::create([
                'offer_code' => Offer::generateOfferCode(),
                'name' => $request->name,
                'description' => $request->description,
                'type' => $request->type,
                'discount_type' => $request->discount_type,
                'discount_value' => $request->discount_value,
                'min_guests' => $request->min_guests,
                'min_nights' => $request->min_nights,
                'max_uses' => $request->max_uses,
                'valid_from' => $request->valid_from,
                'valid_to' => $request->valid_to,
                'status' => $request->status ?? 'active',
                'is_public' => $request->is_public ?? true,
                'conditions' => $request->conditions
            ]);

            return response()->json([
                'success' => true,
                'data' => $offer,
                'message' => 'Offer created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create offer',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $offer = Offer::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $offer,
                'message' => 'Offer retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Offer not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $offer = Offer::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'type' => 'sometimes|in:group-discount,solo-discount,length-discount,student-discount,early-booking,seasonal,loyalty',
                'discount_type' => 'sometimes|in:percentage,fixed_amount,free_night',
                'discount_value' => 'sometimes|numeric|min:0',
                'min_guests' => 'sometimes|integer|min:1',
                'min_nights' => 'nullable|integer|min:1',
                'max_uses' => 'nullable|integer|min:1',
                'valid_from' => 'sometimes|date',
                'valid_to' => 'sometimes|date|after:valid_from',
                'status' => 'sometimes|in:active,scheduled,expired,paused,cancelled',
                'is_public' => 'sometimes|boolean',
                'conditions' => 'nullable|array'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $offer->update($request->only([
                'name', 'description', 'type', 'discount_type', 'discount_value',
                'min_guests', 'min_nights', 'max_uses', 'valid_from', 'valid_to',
                'status', 'is_public', 'conditions'
            ]));

            return response()->json([
                'success' => true,
                'data' => $offer,
                'message' => 'Offer updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update offer',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $offer = Offer::findOrFail($id);
            $offer->delete();

            return response()->json([
                'success' => true,
                'message' => 'Offer deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete offer',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get offer statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $totalOffers = Offer::count();
            $activeOffers = Offer::where('status', 'active')->count();
            $totalBookings = Offer::sum('used_count');
            $totalRevenue = Offer::where('status', 'active')->sum('discount_value');
            $avgDiscount = Offer::where('status', 'active')->avg('discount_value');

            return response()->json([
                'success' => true,
                'data' => [
                    'total_offers' => $totalOffers,
                    'active_offers' => $activeOffers,
                    'total_bookings' => $totalBookings,
                    'total_revenue' => $totalRevenue,
                    'avg_discount' => round($avgDiscount, 2)
                ],
                'message' => 'Statistics retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
