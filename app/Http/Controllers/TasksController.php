<?php

namespace App\Http\Controllers;

use App\Models\ProjetoModel;
use App\Models\TaskModel;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TasksController extends Controller
{
    public function getTaskUsers(TaskModel $task)
    {
        // Eager load 'users' relationship if defined in Task model
        $task->load('users');

        return response()->json($task->users);
    }
    public function index()
    {
        // Carregar tarefas com o projeto associado
        $tasks = TaskModel::with('projeto')->get(); 
        return Inertia::render('Tasks/Task', ['tasks' => $tasks]);
    }

    public function create()
    {
        // Obter todos os projetos e usuários para o formulário de criação
        $projetos = ProjetoModel::all(); 
        $usuarios = User::all(); 

        return Inertia::render('Tasks/Create', [
            'projetos' => $projetos,
            'usuarios' => $usuarios,
        ]);
    }

    public function assignUser(Request $request, $taskId)
{
    $task = TaskModel::findOrFail($taskId);
    $userId = $request->input('user_id');

    // Verifique se o usuário existe
    $user = User::findOrFail($userId);

    // Adiciona o usuário à tarefa
    $task->users()->attach($userId);

    return response()->json(['message' => 'Usuário atribuído com sucesso']);
}

    public function store(Request $request)
    {
        // Validação dos campos
        $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'status' => 'required|in:pendente,em progresso,concluída',
            'projeto_id' => 'required|exists:projetos,id',
        ]);

        // Criar a tarefa
        $tarefa = TaskModel::create([
            'nome' => $request->nome,
            'descricao' => $request->descricao,
            'status' => $request->status,
            'projeto_id' => $request->projeto_id,
        ]);

        // Anexar usuários se forem fornecidos
        if ($request->has('usuarios')) {
            $tarefa->usuarios()->attach($request->usuarios);
        }

        return response()->json(['message' => 'Tarefa criada com sucesso!']);
    }

    public function edit(TaskModel $tarefa)
    {
        // Obter todos os projetos e usuários para edição
        $projetos = ProjetoModel::all(); 
        $usuarios = User::all(); 

        return Inertia::render('Tasks/Edit', [
            'tarefa' => $tarefa->load('projeto', 'usuarios'),
            'projetos' => $projetos,
            'usuarios' => $usuarios,
        ]);
    }

    public function update(Request $request, TaskModel $tarefa)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'status' => 'required|in:pendente,em progresso,concluída',
            'projeto_id' => 'required|exists:projetos,id',
        ]);


        $tarefa->update([
            'nome' => $request->nome,
            'descricao' => $request->descricao,
            'status' => $request->status,
            'projeto_id' => $request->projeto_id,
        ]);

       
        if ($request->has('usuarios')) {
            $tarefa->usuarios()->sync($request->usuarios);
        }

        return response()->json(['message' => 'Tarefa atualizada com sucesso!']);
    }

    public function destroy(TaskModel $tarefa)
    {
         
        $tarefa->delete();

        return response()->json(['message' => 'Tarefa excluída com sucesso!']);
    }

    
}
