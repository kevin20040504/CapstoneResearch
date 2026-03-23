<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('record_requests', function (Blueprint $table) {
            $table->timestamp('appointment_at')->nullable()->after('processed_at');
        });
    }

    public function down(): void
    {
        Schema::table('record_requests', function (Blueprint $table) {
            $table->dropColumn('appointment_at');
        });
    }
};
