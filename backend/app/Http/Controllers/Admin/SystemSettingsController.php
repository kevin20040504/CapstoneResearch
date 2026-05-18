<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\AuthorizesRole;
use App\Http\Requests\UpdateSystemSettingsRequest;
use App\Models\AcademicYear;
use App\Models\SystemSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * System settings (admin only): institution, academic year, record types, notifications.
 */
class SystemSettingsController extends Controller
{
    use AuthorizesRole;

    private const KEYS = [
        'institution_name',
        'institution_short_name',
        'institution_address',
        'academic_year',
        'semester',
        'record_types',
        'email_notifications_enabled',
    ];

    /**
     * Get all system settings (admin only).
     */
    public function show(Request $request): JsonResponse
    {
        if ($err = $this->requireAuth()) {
            return $err;
        }
        if ($err = $this->requireRoles($request->user(), ['admin'])) {
            return $err;
        }

        $settings = [];
        foreach (self::KEYS as $key) {
            $value = SystemSetting::getValue($key);
            if ($key === 'record_types' && is_string($value)) {
                $value = json_decode($value, true) ?? [];
            }
            if ($key === 'email_notifications_enabled') {
                $value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
            }
            $settings[$key] = $value;
        }

        return response()->json(['settings' => $settings]);
    }

    /**
     * Current term labels for headers (staff, admin, student).
     */
    public function current(Request $request): JsonResponse
    {
        if ($err = $this->requireAuth()) {
            return $err;
        }
        if ($err = $this->requireRoles($request->user(), ['admin', 'staff', 'student'])) {
            return $err;
        }

        $y = (int) date('Y');
        $academicYear = SystemSetting::getValue('academic_year') ?: $y.'-'.($y + 1);
        $semester = SystemSetting::getValue('semester') ?: '2nd Semester';
        $institutionName = SystemSetting::getValue('institution_name') ?: 'Trece Martires City College';

        return response()->json([
            'academic_year' => $academicYear,
            'semester' => $semester,
            'institution_name' => $institutionName,
        ]);
    }

    /**
     * Update system settings (admin only).
     */
    public function update(UpdateSystemSettingsRequest $request): JsonResponse
    {
        Log::info("Admin " , $request->all());
        if ($err = $this->requireAuth()) {
            return $err;
        }

        if ($err = $this->requireRoles($request->user(), ['admin'])) {
            return $err;
        }

        $validated = $request->validated();
        foreach (self::KEYS as $key) {
            if (!array_key_exists($key, $validated)) {
                continue;
            }

            $value = $validated[$key];

            if ($key === 'record_types' && is_array($value)) {
                $value = json_encode($value);
            }

            if ($key === 'email_notifications_enabled') {
                $value = $value ? '1' : '0';
            }

            $academicYear = null;

                if ($key === 'academic_year') {

                    if ($value === 'new') {
                        AcademicYear::query()->update(['is_active' => 0]);
                        $academicYear = AcademicYear::generateNextAcademicYearAndSemester();
                    } else {
                        AcademicYear::query()->update(['is_active' => 0]);

                        $academicYear = AcademicYear::find($value);

                        if ($academicYear) {
                            $academicYear->update(['is_active' => 1]);
                        }
                    }
                }
            Log::info("Updating setting: $key = $value");
            if($key === 'academic_year' || $key === 'semester'){
                SystemSetting::setValue('academic_year', $academicYear->name);
                SystemSetting::setValue('semester', $academicYear->semester);
            }else{
                SystemSetting::setValue($key, $value);
            }
        }

        return response()->json([
            'message' => 'Settings updated successfully.',
            'settings' => $this->getSettingsArray(),
        ]);
    }

    private function getSettingsArray(): array
    {
        $settings = [];
        foreach (self::KEYS as $key) {
            $value = SystemSetting::getValue($key);
            if ($key === 'record_types' && is_string($value)) {
                $value = json_decode($value, true) ?? [];
            }
            if ($key === 'email_notifications_enabled') {
                $value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
            }
            $settings[$key] = $value;
        }
        return $settings;
    }
}
