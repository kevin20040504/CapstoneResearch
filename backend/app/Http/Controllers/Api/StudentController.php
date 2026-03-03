<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    /**
     */
    private const MOCK_PASSWORD = 'password123';

    /**
     * Store a newly created student and their login account (staff/admin only).
     */
    public function store(StoreStudentRequest $request): JsonResponse
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $role = $user->roles->first()?->name ?? $user->role ?? null;
        if (! in_array($role, ['staff', 'admin'], true)) {
            return response()->json(['message' => 'Forbidden. Staff or Admin only.'], 403);
        }

        $validated = $request->validated();
        $validated['GPA'] = isset($validated['GPA']) ? round((float) $validated['GPA'], 2) : null;

        $studentNumber = $validated['student_number'];
        $name = trim($validated['first_name'] . ' ' . $validated['last_name']);
        $email = $validated['email'];

        $student = DB::transaction(function () use ($validated, $studentNumber, $name, $email) {
            $account = User::create([
                'name' => $name,
                'email' => $email,
                'username' => $studentNumber,
                'password' => self::MOCK_PASSWORD,
                'role' => 'student',
            ]);
            $account->assignRole('student');

            $studentData = $validated;
            $studentData['user_id'] = $account->id;

            return Student::create($studentData);
        });

        return response()->json([
            'message' => 'Student and account created successfully.',
            'student' => $student,
            'account' => [
                'username' => $studentNumber,
                'password' => self::MOCK_PASSWORD,
            ],
        ], 201);
    }

    /**
     * Display the specified student (staff/admin only).
     */
    public function show(int $id): JsonResponse
    {
        $user = request()->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $role = $user->roles->first()?->name ?? $user->role ?? null;
        if (! in_array($role, ['staff', 'admin'], true)) {
            return response()->json(['message' => 'Forbidden. Staff or Admin only.'], 403);
        }

        $student = Student::find($id);
        if (! $student) {
            return response()->json(['message' => 'Student not found.'], 404);
        }

        return response()->json(['student' => $student]);
    }

    /**
     * Update the specified student (staff/admin only).
     */
    public function update(UpdateStudentRequest $request, int $id): JsonResponse
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $role = $user->roles->first()?->name ?? $user->role ?? null;
        if (! in_array($role, ['staff', 'admin'], true)) {
            return response()->json(['message' => 'Forbidden. Staff or Admin only.'], 403);
        }

        $student = Student::find($id);
        if (! $student) {
            return response()->json(['message' => 'Student not found.'], 404);
        }

        $validated = $request->validated();
        $validated['GPA'] = isset($validated['GPA']) ? round((float) $validated['GPA'], 2) : null;

        $studentNumber = $validated['student_number'];
        $name = trim($validated['first_name'] . ' ' . $validated['last_name']);
        $email = $validated['email'];

        DB::transaction(function () use ($student, $validated, $studentNumber, $name, $email) {
            $student->update($validated);

            if ($student->user) {
                $student->user->update([
                    'name' => $name,
                    'email' => $email,
                    'username' => $studentNumber,
                ]);
            }
        });

        $student->refresh();

        return response()->json([
            'message' => 'Student updated successfully.',
            'student' => $student,
        ]);
    }
}
