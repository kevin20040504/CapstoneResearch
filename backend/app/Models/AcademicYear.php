<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'semester',
        'is_active',
    ];

    /**
     * Generate next academic year and semester
     *
     */
    public static function generateNextAcademicYearAndSemester()
    {
        $latest = self::orderBy('name', 'desc')
            ->orderByRaw("
            FIELD(
                semester,
                '1st Semester',
                '2nd Semester'
            ) DESC
        ")
            ->first();

        // Default value if empty
        if (!$latest) {
            return self::create([
                'name' => '2025-2026',
                'semester' => '1st Semester',
                'is_active' => 1,
            ]);
        }

        $currentYear = $latest->name;
        $currentSemester = $latest->semester;

        preg_match('/(\d{4})-(\d{4})/', $currentYear, $matches);

        $startYear = (int) $matches[1];
        $endYear = (int) $matches[2];

        if ($currentSemester === '1st Semester') {

            return self::create([
                'name' => $currentYear,
                'semester' => '2nd Semester',
                'is_active' => 1,
            ]);
        } else {

            return self::create([
                'name' => ($startYear + 1) . '-' . ($endYear + 1),
                'semester' => '1st Semester',
                'is_active' => 1,
            ]);
        }
    }
}
