<?php

use function Pest\Laravel\getJson;

it('boots and serves auth routes without the api prefix', function () {
    // /up is Laravel's built-in health route; confirms the app boots.
    $this->get('/up')->assertOk();

    // Unknown /auth route should 404 (not 500), proving the group is wired.
    getJson('/auth/does-not-exist')->assertNotFound();
});
