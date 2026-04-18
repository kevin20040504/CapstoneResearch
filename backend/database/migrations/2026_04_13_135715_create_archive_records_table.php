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
        Schema::create('archive_records', function (Blueprint $table) {
            $table->id('archive_id');
            $table->unsignedBigInteger('student_id');
            $table->string('record_type');
            $table->string('cabinet_no');
            $table->string('shelf_no');
            $table->string('folder_code');
            $table->string('document_status');
            $table->timestamps();

            $table->foreign('student_id')->references('student_id')->on('students');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('archive_records');
    }
};
