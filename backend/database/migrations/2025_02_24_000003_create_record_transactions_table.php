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
        Schema::create('record_transactions', function (Blueprint $table) {
            $table->id('transaction_id');
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('staff_id');
            $table->string('transaction_type', 50);
            $table->dateTime('transaction_date');
            $table->string('status', 20);
            $table->timestamps();

            $table->foreign('student_id')->references('student_id')->on('students');
            $table->foreign('staff_id')->references('staff_id')->on('staff');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('record_transactions');
    }
};
