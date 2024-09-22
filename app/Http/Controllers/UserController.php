<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    
    public function index()
    {
        return response()->json(User::all());
    }

    
    public function edit(User $user)
    {
        return response()->json($user);
    }

    
    public function update(Request $request, User $user)
    {
      
        $request->validate([
            'name' => 'required|string|max:255',
            'cpf' => 'required|string|max:14',
            'email' => 'required|string|email|max:255',
        ]);

       
        $user->update([
            'name' => $request->name,
            'cpf' => $request->cpf,
            'email' => $request->email,
        ]);

      
        return response()->json(['message' => 'Usuário atualizado com sucesso!']);
    }

    public function destroy(User $user){
        $user->delete();
        return response()->json(['message' => 'Usuário Deletado com sucesso!']);
    }
}
