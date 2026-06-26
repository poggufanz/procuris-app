<?php

namespace Tests;

use App\Repositories\ArrayNotificationRepository;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        ArrayNotificationRepository::flush();
    }
}
