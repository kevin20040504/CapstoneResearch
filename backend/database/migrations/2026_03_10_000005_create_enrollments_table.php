<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id');
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->string('academic_year', 20); // e.g. 2025-2026
            $table->string('semester', 20); // e.g. 1st, 2nd
            $table->string('status', 20)->default('enrolled'); // enrolled, completed, dropped
            $table->timestamps();

            $table->foreign('student_id')->references('student_id')->on('students')->onDelete('cascade');
            $table->unique(['student_id', 'subject_id', 'academic_year', 'semester']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
