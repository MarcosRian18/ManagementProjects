<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjetoController;
use App\Http\Controllers\TasksController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/users', [UserController::class, 'index'])->middleware('auth');

    Route::get('/projetos', [ProjetoController::class, 'index'])->name('projetos.index');
    Route::get('/projetos/create', [ProjetoController::class, 'create'])->name('projetos.create');
    Route::post('/projetos', [ProjetoController::class, 'store'])->name('projetos.store');
    Route::get('/projetos/{projeto}', [ProjetoController::class, 'show'])->name('projetos.show');
    Route::get('/projetos/{projeto}/edit', [ProjetoController::class, 'edit'])->name('projetos.edit');
    Route::put('/projetos/{projeto}', [ProjetoController::class, 'update'])->name('projetos.update');
    Route::delete('/projetos/{projeto}', [ProjetoController::class, 'destroy'])->name('projetos.destroy');

    // Rotas de Tarefas
    Route::get('/tasks', [TasksController::class, 'index'])->name('tasks.index');
    Route::post('/tasks', [TasksController::class, 'store'])->name('tasks.store');
    Route::get('/projetos/{projeto}/tasks/create', [TasksController::class, 'create'])->name('tasks.create');
    Route::get('/tasks/{tarefa}/edit', [TasksController::class, 'edit'])->name('tasks.edit');
    Route::put('/tasks/{tarefa}', [TasksController::class, 'update'])->name('tasks.update');
    Route::delete('/tasks/{tarefa}', [TasksController::class, 'destroy'])->name('tasks.destroy');
});

Route::post('/tasks/{tarefa}/add-user', [TasksController::class, 'addUser'])->name('tasks.addUser');
Route::put('/tasks/{id}/assign', [TasksController::class, 'assignUser']);
Route::get('/tasks/{task}/users', [TasksController::class, 'getTaskUsers']);





require __DIR__.'/auth.php';
