<?php

use App\Http\Controllers\SearchHistoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('search-history', [SearchHistoryController::class, 'store'])->name('api.search-history')->middleware('throttle:10,1');

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
