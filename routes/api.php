<?php

use App\Http\Controllers\ProjetoController;
use App\Models\ProjetoModel;
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/projetos/list', [ProjetoController::class, 'apiIndex'])->name('api.projetos.index');
Route::get('/projetos/{projeto}/tasks', function (ProjetoModel $projeto) {
    return response()->json($projeto->tasks);
});
