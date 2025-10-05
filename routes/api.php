<?php

use App\Http\Controllers\RoomController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ActivityBookingController;
use App\Http\Controllers\TelegramController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OfferController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public booking routes (no auth required)
Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/available-rooms', [BookingController::class, 'getAvailableRooms']);
Route::get('/rooms/public', [RoomController::class, 'publicIndex']);

// Public activity routes (no auth required)
Route::get('/activities/public', [ActivityController::class, 'publicIndex']);
Route::get('/activities/{activity}/availability', [ActivityController::class, 'availability']);
Route::post('/activity-bookings', [ActivityBookingController::class, 'store']);

// Room management routes (protected)
Route::middleware(['api-protected', 'auth:sanctum'])->group(function () {
    Route::apiResource('rooms', RoomController::class);
    Route::apiResource('bookings', BookingController::class);
    
    // Activity management routes (Admin only)
    Route::apiResource('activities', ActivityController::class);
    Route::apiResource('activity-bookings', ActivityBookingController::class);
    
    // Offer management routes (Admin only)
    Route::apiResource('offers', OfferController::class);
    Route::get('/offers/statistics', [OfferController::class, 'statistics']);
    
    // Telegram notification routes
    Route::prefix('telegram')->group(function () {
        Route::get('/status', [TelegramController::class, 'status']);
        Route::post('/test', [TelegramController::class, 'sendTest']);
        Route::post('/settings', [TelegramController::class, 'updateSettings']);
    });
    
    // User management routes
    Route::prefix('user')->group(function () {
        Route::get('/profile', [UserController::class, 'profile']);
        Route::put('/profile', [UserController::class, 'updateProfile']);
        Route::post('/update-password', [UserController::class, 'updatePassword']);
    });
    
    Route::get('/user', function (Request $request) {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    });
    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    });
});
