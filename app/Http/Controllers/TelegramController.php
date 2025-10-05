<?php

namespace App\Http\Controllers;

use App\Services\TelegramService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TelegramController extends Controller
{
    protected $telegramService;

    public function __construct(TelegramService $telegramService)
    {
        $this->telegramService = $telegramService;
    }

    /**
     * Get Telegram configuration status
     */
    public function status(): JsonResponse
    {
        try {
            $isConfigured = $this->telegramService->isConfigured();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'configured' => $isConfigured,
                    'enabled' => config('services.telegram.enabled'),
                    'bot_token_set' => !empty(config('services.telegram.bot_token')),
                    'chat_id_set' => !empty(config('services.telegram.chat_id')),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get Telegram status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send test message
     */
    public function sendTest(): JsonResponse
    {
        try {
            // Debug configuration
            $botToken = config('services.telegram.bot_token');
            $chatId = config('services.telegram.chat_id');
            $enabled = config('services.telegram.enabled');
            
            \Log::info('Telegram Test Debug', [
                'bot_token_set' => !empty($botToken),
                'chat_id_set' => !empty($chatId),
                'enabled' => $enabled,
                'bot_token_length' => $botToken ? strlen($botToken) : 0,
                'chat_id' => $chatId
            ]);
            
            if (!$enabled) {
                return response()->json([
                    'success' => false,
                    'message' => 'Telegram notifications are disabled. Please enable them first.'
                ], 400);
            }
            
            if (!$botToken) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bot token is not configured. Please add your bot token.'
                ], 400);
            }
            
            if (!$chatId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chat ID is not configured. Please add your chat ID.'
                ], 400);
            }
            
            $result = $this->telegramService->sendTestMessage();
            
            if ($result) {
                return response()->json([
                    'success' => true,
                    'message' => 'Test message sent successfully! Check your Telegram.'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to send test message. Please check the logs for details.'
                ], 400);
            }
        } catch (\Exception $e) {
            \Log::error('Telegram test error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to send test message: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update Telegram settings
     */
    public function updateSettings(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'bot_token' => 'nullable|string',
                'chat_id' => 'nullable|string',
                'enabled' => 'boolean',
            ]);

            // Update .env file (in a real application, you might want to use a settings table)
            $envFile = base_path('.env');
            $envContent = file_get_contents($envFile);

            // Update or add Telegram settings
            $settings = [
                'TELEGRAM_BOT_TOKEN' => $validated['bot_token'] ?? '',
                'TELEGRAM_CHAT_ID' => $validated['chat_id'] ?? '',
                'TELEGRAM_NOTIFICATIONS_ENABLED' => $validated['enabled'] ? 'true' : 'false',
            ];

            foreach ($settings as $key => $value) {
                if (strpos($envContent, $key) !== false) {
                    // Update existing setting
                    $envContent = preg_replace(
                        "/^{$key}=.*/m",
                        "{$key}={$value}",
                        $envContent
                    );
                } else {
                    // Add new setting
                    $envContent .= "\n{$key}={$value}";
                }
            }

            file_put_contents($envFile, $envContent);

            return response()->json([
                'success' => true,
                'message' => 'Telegram settings updated successfully!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings: ' . $e->getMessage()
            ], 500);
        }
    }
}
