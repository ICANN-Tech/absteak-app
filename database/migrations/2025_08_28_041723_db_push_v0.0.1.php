<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('configurations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('key');
            $table->string('group');
            $table->text('value');
            $table->enum('type', ['string', 'integer', 'float', 'boolean', 'array', 'object']);
            $table->timestamps();
        });

        Schema::create('reservations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->date('reservation_date');
            $table->time('reservation_time');
            $table->integer('number_of_people');
            $table->text('special_requests')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
        Schema::dropIfExists('configurations');
    }
};
