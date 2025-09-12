<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Aktifkan extension vector (sekali saja, aman kalau sudah ada)
        DB::statement('CREATE EXTENSION IF NOT EXISTS vector');

        Schema::create('dine_out_sources', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');  // Gojek, Grab, ShopeeFood
            $table->string('code')->unique();
            $table->string('url')->nullable();

            // kolom AI-related
            $table->jsonb('metadata')->nullable();       // simpan info tambahan
            $table->addColumn('vector', 'embedding', ['dimensions' => 1024])->nullable(); // untuk similarity

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dine_out_sources');
    }
};
