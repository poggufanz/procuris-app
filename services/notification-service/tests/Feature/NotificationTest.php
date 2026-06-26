<?php

use App\Repositories\NotificationRepository;
use App\Repositories\ArrayNotificationRepository;

it('401s without an Authorization header', function () {
    $this->getJson('/notifications')->assertStatus(401);
});

it('403s when notify is called without service secret', function () {
    $this->postJson('/notify', [
        'user_ids' => [1], 'type' => 'x', 'title' => 'T', 'body' => 'B',
    ])->assertStatus(403);
});

it('pushes a notification and returns 201', function () {
    $this->postJson('/notify', [
        'user_ids' => [1, 2],
        'type' => 'po.submitted',
        'title' => 'PO Submitted',
        'body' => 'PO/BDG/2026/0001 has been submitted.',
    ], serviceHeader())->assertStatus(201)->assertJsonPath('created', 2);
});

it('returns the inbox for the authenticated user', function () {
    $headers = actingAsRole('staff_purchasing', 5);
    $repo = app(NotificationRepository::class);
    $repo->push(5, 'po.submitted', 'PO Submitted', 'Body', 1);
    $repo->push(5, 'po.approved', 'PO Approved', 'Body', 1);

    $this->getJson('/notifications', $headers)->assertOk()->assertJsonCount(2, 'items');
});

it('only shows the current user their own notifications', function () {
    $headers = actingAsRole('staff_purchasing', 5);
    $repo = app(NotificationRepository::class);
    $repo->push(99, 'po.submitted', 'Other user notif', 'Body');
    $repo->push(5, 'po.submitted', 'My notif', 'Body');

    $result = $this->getJson('/notifications', $headers)->assertOk()->json('items');
    expect(count($result))->toBe(1)->and($result[0]['title'])->toBe('My notif');
});

it('returns unread count and decrements after marking read', function () {
    $headers = actingAsRole('staff_purchasing', 5);
    $repo = app(NotificationRepository::class);
    $id1 = $repo->push(5, 'po.submitted', 'T1', 'B');
    $repo->push(5, 'po.approved', 'T2', 'B');

    $this->getJson('/notifications/unread-count', $headers)->assertOk()->assertJsonPath('unread_count', 2);

    $this->patchJson("/notifications/{$id1}/read", [], $headers)->assertOk();

    $this->getJson('/notifications/unread-count', $headers)->assertOk()->assertJsonPath('unread_count', 1);
});

it('marks all notifications as read', function () {
    $headers = actingAsRole('staff_purchasing', 5);
    $repo = app(NotificationRepository::class);
    $repo->push(5, 'po.submitted', 'T1', 'B');
    $repo->push(5, 'po.submitted', 'T2', 'B');

    $this->patchJson('/notifications/read-all', [], $headers)->assertOk();
    $this->getJson('/notifications/unread-count', $headers)->assertOk()->assertJsonPath('unread_count', 0);
});

it('404s when marking an unknown notification as read', function () {
    $headers = actingAsRole('staff_purchasing', 5);
    $this->patchJson('/notifications/non-existent-id/read', [], $headers)->assertStatus(404);
});

it('404s when marking another user notification as read', function () {
    $headers = actingAsRole('staff_purchasing', 5);
    $repo = app(NotificationRepository::class);
    $id = $repo->push(99, 'po.submitted', 'Other', 'Body');
    $this->patchJson("/notifications/{$id}/read", [], $headers)->assertStatus(404);
});

it('validates the push payload', function () {
    $h = serviceHeader();
    $this->postJson('/notify', [], $h)->assertStatus(422);
    $this->postJson('/notify', ['user_ids' => [], 'type' => 'x', 'title' => 'T', 'body' => 'B'], $h)->assertStatus(422);
});

it('paginates notifications', function () {
    $headers = actingAsRole('staff_purchasing', 5);
    $repo = app(NotificationRepository::class);
    for ($i = 1; $i <= 20; $i++) {
        $repo->push(5, 'po.submitted', "Notification {$i}", 'B');
    }
    $this->getJson('/notifications?per_page=10&page=1', $headers)->assertOk()
        ->assertJsonPath('total', 20)->assertJsonCount(10, 'items');
    $this->getJson('/notifications?per_page=10&page=2', $headers)->assertOk()
        ->assertJsonCount(10, 'items');
});
