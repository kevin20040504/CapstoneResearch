<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AcademicYearController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $academicYears = AcademicYear::orderBy('name', 'desc')
                ->orderByRaw("
                        FIELD(
                            semester,
                            '1st Semester',
                            '2nd Semester'
                        ) DESC
                    ")
                ->get();
            // generate academic years if empty
            if ($academicYears->isEmpty()) {
                $nextAcademicYearAndSemester = AcademicYear::generateNextAcademicYearAndSemester();
                $academicYears->push((object) $nextAcademicYearAndSemester);
                SystemSetting::create([
                    'key' => 'academic_year',
                    'value' => $nextAcademicYearAndSemester->name
                ]);
                SystemSetting::create([
                    'key' => 'semester',
                    'value' => $nextAcademicYearAndSemester->semester
                ]);
            }
            return response()->json($academicYears);
        } catch (\Exception $e) {
            Log::alert("Error fetching academic years: " . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch academic years.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            $nextAcademicYearAndSemester = AcademicYear::generateNextAcademicYearAndSemester();
            return response()->json($nextAcademicYearAndSemester);
        } catch (\Exception $e) {
            Log::alert("Error generating next academic year and semester: " . $e->getMessage());
            return response()->json([
                'message' => 'Failed to generate next academic year and semester.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $nextAcademicYearAndSemester = AcademicYear::generateNextAcademicYearAndSemester();
            return response()->json($nextAcademicYearAndSemester);
        } catch (\Exception $e) {
            Log::alert("Error generating next academic year and semester: " . $e->getMessage());
            return response()->json([
                'message' => 'Failed to generate next academic year and semester.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
