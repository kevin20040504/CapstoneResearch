<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('middle_name', 50)->nullable()->after('first_name');
            $table->string('place_of_birth', 120)->nullable()->after('address');
            $table->string('sex', 10)->nullable()->after('place_of_birth');
            $table->string('guardian_name', 120)->nullable()->after('sex');
            $table->string('citizenship', 60)->nullable()->after('guardian_name');

            $table->string('elementary_school', 150)->nullable()->after('citizenship');
            $table->unsignedSmallInteger('elementary_year')->nullable()->after('elementary_school');
            $table->string('high_school', 150)->nullable()->after('elementary_year');
            $table->unsignedSmallInteger('high_school_year')->nullable()->after('high_school');
            $table->string('previous_school', 150)->nullable()->after('high_school_year');
            $table->string('previous_course', 150)->nullable()->after('previous_school');
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'middle_name',
                'place_of_birth',
                'sex',
                'guardian_name',
                'citizenship',
                'elementary_school',
                'elementary_year',
                'high_school',
                'high_school_year',
                'previous_school',
                'previous_course',
            ]);
        });
    }
};

