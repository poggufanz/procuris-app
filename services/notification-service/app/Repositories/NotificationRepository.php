<?php

namespace App\Repositories;

interface NotificationRepository
{
    public function push(int $userId, string $type, string $title, string $body, ?int $referenceId = null): string;

    /** @return array{items: array, total: int, page: int, per_page: int} */
    public function forUser(int $userId, int $page = 1, int $perPage = 15): array;

    public function unreadCount(int $userId): int;

    public function markRead(int $userId, string $id): bool;

    public function markAllRead(int $userId): void;
}
