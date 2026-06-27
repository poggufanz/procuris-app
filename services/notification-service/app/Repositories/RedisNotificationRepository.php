<?php

namespace App\Repositories;

use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;

class RedisNotificationRepository implements NotificationRepository
{
    private int $ttl;

    public function __construct()
    {
        $this->ttl = (int) config('app.notification_ttl_days', 90) * 86400;
        if ($this->ttl <= 0) {
            $this->ttl = 90 * 86400;
        }
    }

    public function push(int $userId, string $type, string $title, string $body, ?int $referenceId = null): string
    {
        $id = Str::uuid()->toString();
        $now = now();

        $payload = json_encode([
            'id' => $id,
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'reference_id' => $referenceId,
            'is_read' => false,
            'created_at' => $now->toISOString(),
        ]);

        Redis::setex("notification:{$id}", $this->ttl, $payload);
        Redis::zadd("inbox:{$userId}", $now->timestamp, $id);
        Redis::zadd("inbox:{$userId}:unread", $now->timestamp, $id);

        return $id;
    }

    public function forUser(int $userId, int $page = 1, int $perPage = 15): array
    {
        $total = (int) Redis::zcard("inbox:{$userId}");
        $offset = ($page - 1) * $perPage;
        $ids = Redis::zrevrange("inbox:{$userId}", $offset, $offset + $perPage - 1);

        $items = [];
        foreach ($ids as $id) {
            $raw = Redis::get("notification:{$id}");
            if ($raw) {
                $items[] = json_decode($raw, true);
            }
        }

        return [
            'items' => $items,
            'total' => $total,
            'page' => $page,
            'per_page' => $perPage,
        ];
    }

    public function unreadCount(int $userId): int
    {
        return (int) Redis::zcard("inbox:{$userId}:unread");
    }

    public function markRead(int $userId, string $id): bool
    {
        $raw = Redis::get("notification:{$id}");
        if (! $raw) {
            return false;
        }

        $notification = json_decode($raw, true);
        if ((int) ($notification['user_id'] ?? 0) !== $userId) {
            return false;
        }

        $notification['is_read'] = true;
        Redis::setex("notification:{$id}", $this->ttl, json_encode($notification));
        Redis::zrem("inbox:{$userId}:unread", $id);

        return true;
    }

    public function markAllRead(int $userId): void
    {
        $ids = Redis::zrange("inbox:{$userId}:unread", 0, -1);
        foreach ($ids as $id) {
            $raw = Redis::get("notification:{$id}");
            if ($raw) {
                $notification = json_decode($raw, true);
                $notification['is_read'] = true;
                Redis::setex("notification:{$id}", $this->ttl, json_encode($notification));
            }
        }
        Redis::del("inbox:{$userId}:unread");
    }
}
