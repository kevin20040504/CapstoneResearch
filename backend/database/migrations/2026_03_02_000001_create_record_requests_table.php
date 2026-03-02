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
        Schema::create('record_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id');
            $table->string('record_type', 50);
            $table->string('purpose', 255)->nullable();
            $table->unsignedTinyInteger('copies')->default(1);
            $table->string('status', 20)->default('pending'); // pending, approved, rejected, released
            $table->timestamp('requested_at');
            $table->unsignedBigInteger('processed_by')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('released_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamps();

            $table->foreign('student_id')->references('student_id')->on('students')->onDelete('cascade');
            $table->foreign('processed_by')->references('staff_id')->on('staff')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('record_requests');
    }
};
