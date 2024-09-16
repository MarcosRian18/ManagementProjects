<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjetoModel extends Model
{
    use HasFactory;

    protected $fillable = ['nome', 'descricao', 'dt_entrega', 'qtd_task'];

    protected $table = 'projetos';

    public function tasks(): HasMany
    {
        return $this->hasMany(TaskModel::class);
    }
}
