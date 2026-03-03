<?php

use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\auth\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

Route::get('/user', function (Request $request) {
    return $request->user()?->load('roles');
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->prefix('staff')->group(function () {
    Route::post('/students', [StudentController::class, 'store']);
    Route::get('/students/{id}', [StudentController::class, 'show']);
    Route::put('/students/{id}', [StudentController::class, 'update']);
});
