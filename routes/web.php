<?php

use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('login');
});

Route::post('/login', function () {
    return view('search');
});

//these routes call specific functions from PageController
//named routes allow to use route('name') in Blade
Route::get('/search', [PageController::class, 'search'])->name('search');

Route::get('/profile', [PageController::class, 'profile'])->name('profile');

Route::get('/add', [PageController::class, 'add'])->name('add');

Route::get('/allfiles', [PageController::class, 'allFiles'])->name('allfiles');