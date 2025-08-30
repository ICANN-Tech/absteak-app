<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestController extends Controller
{
    public function check($date)
    {
        $appName = env('APP_NAME');   // Ambil dari .env
        $dbHost  = env('DB_HOST');

        return response()->json([
            'app_name' => $appName,
            'db_host'  => $dbHost,
        ]);
    }
}
