<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\AuthorizesRole;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    use AuthorizesRole;

    private const DEFAULT_STUDENT_PASSWORD = 'password123';

    /**
     * List students with search, filter by course/status, pagination (staff + admin).
     */
    public function index(Request $request): JsonResponse
    {
        if ($err = $this->requireAuth()) {
            return $err;
        }
        if ($err = $this->requireRoles($request->user(), ['staff', 'admin'])) {
            return $err;
        }

        $query = Student::query()->with(['user:id,name,username,email', 'program:id,code,name']);

        if ($search = $request->input('search')) {
            $search = preg_replace('/\s+/', ' ', trim($search));
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('student_number', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $sortKey = $request->input('sort', 'last_name');
        $sortDir = $request->input('dir', 'asc') === 'desc' ? 'desc' : 'asc';
        $query->orderBy($sortKey, $sortDir);

        $perPage = min(max((int) $request->input('per_page', 15), 5), 100);
        $students = $query->paginate($perPage);

        return response()->json($students);
    }

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
                'password' => self::DEFAULT_STUDENT_PASSWORD,
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
                'password' => self::DEFAULT_STUDENT_PASSWORD,
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

        $student = Student::with('program')->find($id);
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
