<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('projetos', function (Blueprint $table) {
            $table->dropColumn('qtd_task');
        });
    }

    public function down(): void {
        Schema::table('projetos', function (Blueprint $table) {
            $table->bigInteger('qtd_task')->nullable();
        });
    }
};
