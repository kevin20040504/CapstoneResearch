<?php

use App\Http\Controllers\RequestController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/appointment/form/{id}', [RequestController::class, 'publicAppointmentForm'])
    ->name('appointment.public.form');
