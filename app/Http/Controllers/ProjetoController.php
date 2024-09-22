<?php

namespace App\Http\Controllers;

use App\Models\ProjetoModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjetoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projetos = ProjetoModel::all();
        return Inertia::render('Projetos/Projeto', ['projetos' => $projetos]);// ['projetos' => $projetos]
    }

    public function apiIndex()
{
    return response()->json(ProjetoModel::all());
    
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Projetos/CreateProject');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'dt_entrega' => 'date|nullable',
        ]);

        ProjetoModel::create($request->all());

        return redirect()->route('projetos.index')->with('success', 'Projeto Criado com sucesso');
    }

    /**
     * Display the specified resource.
     */
    public function show(ProjetoModel $projeto)
{
    return Inertia::render('Projetos/Show', [
        'projeto' => $projeto->load('tasks')
    ]);
}



    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProjetoModel $projeto)
    {
        return Inertia::render('Projetos/Edit', [
            'projeto' => $projeto,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProjetoModel $projeto)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'dt_entrega' => 'date|nullable',
        ]);

        $projeto->update($request->all());

        return redirect()->route('projetos.index')->with('success', 'Projeto atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProjetoModel $projeto)
    {
        $projeto->delete();

        return redirect()->route('projetos.index')->with('success', 'Projeto Removido com sucesso');
    }
}
