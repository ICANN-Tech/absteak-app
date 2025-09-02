<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Console\Commands;
use App\Console\Commands\Newsletter\Distribution;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Register newsletter distribution command
Artisan::command('newsletter:distribute', function () {
    $this->call(Distribution::class);
})->purpose('Process newsletter distribution to subscribers');
