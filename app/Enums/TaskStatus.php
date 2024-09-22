<?php

namespace App\Enums;

class TaskStatus
{
    const PENDENTE = 'pendente';
    const EM_PROGRESSO = 'em progresso';
    const CONCLUIDA = 'concluída';

    public static function getStatusOptions(): array
    {
        return [
            self::PENDENTE,
            self::EM_PROGRESSO,
            self::CONCLUIDA,
        ];
    }
}