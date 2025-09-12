<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Aktifkan extension pgvector (sekali saja, aman kalau sudah ada)
        DB::statement('CREATE EXTENSION IF NOT EXISTS vector');

        // Hapus kolom embedding lama (json)
        DB::statement('ALTER TABLE menus DROP COLUMN IF EXISTS embedding');

        // Tambahkan kolom embedding baru dengan tipe vector 1536 dimensi
                DB::statement('ALTER TABLE menus ADD COLUMN embedding vector(1536)');

        // Tambahkan kolom metadata dengan tipe jsonb
        Schema::table('menus', function ($table) {
            $table->jsonb('metadata')->nullable();
        });
    }

    public function down(): void
    {
        // Hapus kolom embedding vector
        DB::statement('ALTER TABLE menus DROP COLUMN IF EXISTS embedding');

        // Hapus kolom metadata
        Schema::table('menus', function ($table) {
            $table->dropColumn('metadata');
        });
    }
};
