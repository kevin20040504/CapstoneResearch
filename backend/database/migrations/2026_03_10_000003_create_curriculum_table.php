<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('curriculum', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->constrained('programs')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->unsignedTinyInteger('year_level');
            $table->string('semester', 20); // e.g. 1st, 2nd
            $table->timestamps();

            $table->unique(['program_id', 'subject_id', 'year_level', 'semester']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('curriculum');
    }
};
