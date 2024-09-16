<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TaskModel extends Model
{
    use HasFactory;

    protected $fillable = ['nome','descricao','status','projeto_id'];
    protected $table = 'tasks';

    public function projeto(): BelongsTo {
        return $this->belongsTo(ProjetoModel::class);
    }

    public function users() : BelongsToMany {
        return $this->belongsToMany(User::class, 'task_user')->withTimestamps();
    }

    public static function getStatusOptions(): array
    {
        return ['pendente', 'em progresso', 'concluída'];
    }

    public function setStatusAttribute($value)
    {
        if (!in_array($value, self::getStatusOptions())) {
            throw new \InvalidArgumentException("Status inválido: {$value}");
        }

        $this->attributes['status'] = $value;
    }
}
