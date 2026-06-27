<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('notifications:check-contracts')->dailyAt('07:00');
