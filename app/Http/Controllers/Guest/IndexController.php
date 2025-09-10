<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IndexController extends Controller
{
    /**
     * @var ConfigurationRepository
     */
    protected $repository;

    public function __construct(\App\Repositories\General\ConfigurationRepository $repository){
        $this->repository = $repository;
    }

    public function index()
    {
        return Inertia::render('Guest');
    }
}
