<?php

namespace App\Http\Controllers;

use App\Models\ProjetoModel;
use App\Models\TaskModel;
use App\Models\User;
use App\Enums\TaskStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TasksController extends Controller
{
    public function getTaskUsers(TaskModel $task)
    {
        $task->load('users');
        return response()->json($task->users);
    }

    public function index()
{
    $tasks = TaskModel::with(['projeto', 'users'])->get(); // Carrega os usuários relacionados
    return Inertia::render('Tasks/Task', ['tasks' => $tasks]);
}

    public function create()
    {
        $projetos = ProjetoModel::all();
        $usuarios = User::all();

        return Inertia::render('Tasks/Create', [
            'projetos' => $projetos,
            'usuarios' => $usuarios,
            'statusOptions' => TaskStatus::getStatusOptions(),
        ]);
    }

    public function assignUser(Request $request, $taskId)
    {
        $task = TaskModel::findOrFail($taskId);
        $user = User::findOrFail($request->input('user_id'));

        $task->users()->attach($user->id);

        return response()->json(['message' => 'Usuário atribuído com sucesso']);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nome' => 'required',
            'descricao' => 'required',
            'status' => 'required',
            'projeto_id' => 'nullable|exists:projetos,id',
            'user_ids' => 'array|nullable|exists:users,id',  // Validação para user_ids
        ]);
    
       
        $task = TaskModel::create($validatedData);
    
        
        if (isset($validatedData['user_ids'])) {
            $task->users()->sync($validatedData['user_ids']);
        }
    
        return redirect()->route('tasks.index')->with('success', 'Tarefa criada com sucesso!');
    }
    

    public function edit(TaskModel $tarefa)
    {
        $projetos = ProjetoModel::all();
        $usuarios = User::all();

        return Inertia::render('Tasks/Edit', [
            'tarefa' => $tarefa->load('projeto', 'users'),
            'projetos' => $projetos,
            'usuarios' => $usuarios,
            'statusOptions' => TaskStatus::getStatusOptions(),
        ]);
    }

    public function update(Request $request, TaskModel $task)
    {
        $validatedData = $request->validate([
            'nome' => 'required',
            'descricao' => 'required',
            'status' => 'required',
            'projeto_id' => 'nullable|exists:projetos,id',
            'user_id' => 'array|nullable|exists:users,id',
        ]);
    
        
        $task->update($validatedData);
    
     
        if (isset($validatedData['user_ids'])) {
            
            $task->users()->sync($validatedData['user_ids']);
        }
    
        return redirect()->route('tasks.index')->with('success', 'Tarefa atualizada com sucesso!');
    }
    

    

    public function destroy(TaskModel $tarefa)
    {
        $tarefa->delete();

        return response()->json(['message' => 'Tarefa excluída com sucesso!']);
    }
}
