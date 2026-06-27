<?php

namespace App\Http\Controllers;

use App\Http\Requests\PushNotificationRequest;
use App\Repositories\NotificationRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(private NotificationRepository $repo) {}

    public function push(PushNotificationRequest $request): JsonResponse
    {
        $data = $request->validated();
        $ids = [];
        foreach ($data['user_ids'] as $userId) {
            $ids[] = $this->repo->push(
                (int) $userId,
                $data['type'],
                $data['title'],
                $data['body'],
                $data['reference_id'] ?? null,
            );
        }
        return response()->json(['created' => count($ids)], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $userId = (int) $request->identity()['id'];
        $page = max(1, (int) $request->query('page', 1));
        $perPage = max(1, min(100, (int) $request->query('per_page', 15)));
        return response()->json($this->repo->forUser($userId, $page, $perPage));
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $userId = (int) $request->identity()['id'];
        return response()->json(['unread_count' => $this->repo->unreadCount($userId)]);
    }

    public function markRead(Request $request, string $id): JsonResponse
    {
        $userId = (int) $request->identity()['id'];
        $found = $this->repo->markRead($userId, $id);
        return $found
            ? response()->json(['message' => 'Marked as read'])
            : response()->json(['message' => 'Not found'], 404);
    }

    public function readAll(Request $request): JsonResponse
    {
        $userId = (int) $request->identity()['id'];
        $this->repo->markAllRead($userId);
        return response()->json(['message' => 'All marked as read']);
    }
}
