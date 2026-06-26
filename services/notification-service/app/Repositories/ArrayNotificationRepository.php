<?php

namespace App\Repositories;

use Illuminate\Support\Str;

class ArrayNotificationRepository implements NotificationRepository
{
    private static array $store = [];
    private static array $inbox = [];
    private static array $unread = [];

    public static function flush(): void
    {
        self::$store = [];
        self::$inbox = [];
        self::$unread = [];
    }

    public function push(int $userId, string $type, string $title, string $body, ?int $referenceId = null): string
    {
        $id = Str::uuid()->toString();
        self::$store[$id] = [
            'id' => $id,
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'reference_id' => $referenceId,
            'is_read' => false,
            'created_at' => now()->toISOString(),
        ];
        self::$inbox[$userId][] = $id;
        self::$unread[$userId][] = $id;
        return $id;
    }

    public function forUser(int $userId, int $page = 1, int $perPage = 15): array
    {
        $all = array_reverse(self::$inbox[$userId] ?? []);
        $total = count($all);
        $offset = ($page - 1) * $perPage;
        $slice = array_slice($all, $offset, $perPage);
        $items = array_values(array_filter(array_map(fn ($id) => self::$store[$id] ?? null, $slice)));
        return ['items' => $items, 'total' => $total, 'page' => $page, 'per_page' => $perPage];
    }

    public function unreadCount(int $userId): int
    {
        return count(self::$unread[$userId] ?? []);
    }

    public function markRead(int $userId, string $id): bool
    {
        if (! isset(self::$store[$id])) {
            return false;
        }
        if ((int) self::$store[$id]['user_id'] !== $userId) {
            return false;
        }
        self::$store[$id]['is_read'] = true;
        self::$unread[$userId] = array_values(array_filter(self::$unread[$userId] ?? [], fn ($u) => $u !== $id));
        return true;
    }

    public function markAllRead(int $userId): void
    {
        foreach (self::$unread[$userId] ?? [] as $id) {
            if (isset(self::$store[$id])) {
                self::$store[$id]['is_read'] = true;
            }
        }
        self::$unread[$userId] = [];
    }
}
