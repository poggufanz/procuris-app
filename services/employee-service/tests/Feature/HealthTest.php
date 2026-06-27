<?php

it('serves the health route with no api prefix', function () {
    $this->get('/up')->assertOk();
});
