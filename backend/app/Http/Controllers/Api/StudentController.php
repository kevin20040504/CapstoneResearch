<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\AuthorizesRole;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\ArchiveRecord;
use App\Services\OfficialTranscriptExportService;
use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\Program;
use App\Models\Student;
use App\Models\Subject;
use App\Models\SystemLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StudentController extends Controller
{
    use AuthorizesRole;


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

        $query = Student::query()->with(['user:id,name,username,email', 'program:id,code,name', 'archiveRecords']);
        if ($search = $request->input('search')) {
            $search = preg_replace('/\s+/', ' ', trim($search));
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('student_number', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
                });
        }
        
        if ($program = $request->input('program')) {
            $program = trim((string) $program);
            if ($program !== '') {
                $query->whereHas('program', function ($q) use ($program) {
                    $q->where('code', $program)->orWhere('name', $program);
                });
            }
        }

        $sortKey = $request->input('sort', 'last_name');
        $sortDir = $request->input('dir', 'asc') === 'desc' ? 'desc' : 'asc';

        $allowedColumns = ['student_id', 'student_number', 'first_name', 'last_name', 'email'];
        if ($sortKey === 'name') {
            $query->orderBy('last_name', $sortDir)->orderBy('first_name', $sortDir);
        } elseif ($sortKey === 'course') {
            $query->leftJoin('programs', 'students.program_id', '=', 'programs.id')
                ->select('students.*')
                ->orderBy('programs.code', $sortDir);
        } elseif (in_array($sortKey, $allowedColumns, true)) {
            $query->orderBy($sortKey, $sortDir);
        } elseif ($sortKey === 'status') {
            $query->orderBy('students.student_id', $sortDir);
        } else {
            $query->orderBy('last_name', 'asc');
        }

        $perPage = min(max((int) $request->input('per_page', 15), 5), 100);
        $students = $query->paginate($perPage);
        Log::info(ArchiveRecord::where('student_id', $students->first()->student_id)->get());

        return response()->json($students);
    }

    /**
     * Store a newly created student and their login account (staff/admin only).
     */
    public function store(StoreStudentRequest $request): JsonResponse
    {
        try {
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
        $exactPassword = User::generatePassword();
        $student = DB::transaction(function () use ($validated, $studentNumber, $name, $email, $exactPassword) {
            $account = User::create([
                'name' => $name,
                'email' => $email,
                'username' => $studentNumber,
                'role' => 'student',
                'password' => Hash::make($exactPassword),
            ]);
            $account->assignRole('student');

            $studentData = $validated;
            $studentData['user_id'] = $account->id;

            $student = Student::create($studentData);
            return $student;
        });

        // create archive record
        if($validated['is_archived']) {
            $archiveRecord = ArchiveRecord::create([
                'student_id' => $student->student_id,
                'record_type' => $validated['record_type'],
                'cabinet_no' => $validated['cabinet_no'],
                'shelf_no' => $validated['shelf_no'],
                'folder_code' => $validated['folder_code'],
                'document_status' => $validated['document_status'],
            ]);
    
            if (!$archiveRecord) {
                return response()->json(['message' => 'Failed to create archive record.'], 500);
            }
        }

        SystemLog::create([
            'action' => 'Student created',
            'user_id' => $user->id,
            'role' => $role,
        ]);
        return response()->json([
            'message' => 'Student and account created successfully.',
            'student' => $student,
            'account' => [
                'username' => $studentNumber,
                'password' => $exactPassword,
            ],
        ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to create student and account: ' . $e->getMessage());
           return response()->json(['message' => 'Failed to create student and account.'], 500);
        }
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

        $student = Student::with(['program', 'enrollments.subject', 'grades.subject', 'archiveRecords'])->find($id);
        if (! $student) {
            return response()->json(['message' => 'Student not found.'], 404);
        }
        Log::info($student);
        return response()->json(['student' => $student]);
    }

    /**
     * Download official transcript XLSX for a student (staff/admin only).
     */
    public function downloadTranscript(int $id): StreamedResponse|JsonResponse
    {
        $user = request()->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $role = $user->roles->first()?->name ?? $user->role ?? null;
        if (! in_array($role, ['staff', 'admin'], true)) {
            return response()->json(['message' => 'Forbidden. Staff or Admin only.'], 403);
        }

        $student = Student::with(['program', 'grades.subject'])->find($id);
        if (! $student) {
            return response()->json(['message' => 'Student not found.'], 404);
        }

        $templatePath = public_path('assets/templates/OFFICIAL TRANSCRIPT OF RECORD - template.xlsx');
        if (! file_exists($templatePath)) {
            return response()->json(['message' => 'Transcript template file not found.'], 500);
        }

        return app(OfficialTranscriptExportService::class)->streamForStudent($student);
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
        SystemLog::create([
            'action' => 'Student updated',
            'user_id' => $user->id,
            'role' => $role,
        ]);
        return response()->json([
            'message' => 'Student updated successfully.',
            'student' => $student,
        ]);
    }

    /**
     * List programs for staff filters (course dropdown).
     */
    public function programs(): JsonResponse
    {
        if ($err = $this->requireAuth()) {
            return $err;
        }
        if ($err = $this->requireRoles(request()->user(), ['staff', 'admin'])) {
            return $err;
        }
        $programs = Program::orderBy('code')->get(['id', 'code', 'name']);

        return response()->json(['programs' => $programs]);
    }

    /**
     * List subjects for dropdowns (staff/admin). Per thesis: subject code, title, units.
     */
    public function subjects(): JsonResponse
    {
        if ($err = $this->requireAuth()) {
            return $err;
        }
        if ($err = $this->requireRoles(request()->user(), ['staff', 'admin'])) {
            return $err;
        }
        $subjects = Subject::orderBy('code')->get(['id', 'code', 'title', 'units']);
        return response()->json(['subjects' => $subjects]);
    }

    /**
     * Store enrollment for a student. Required: subject_id, academic_year, semester. Optional: status.
     */
    public function storeEnrollment(Request $request, int $id): JsonResponse
    {
        if ($err = $this->requireAuth()) {
            return $err;
        }
        if ($err = $this->requireRoles($request->user(), ['staff', 'admin'])) {
            return $err;
        }
        $student = Student::find($id);
        if (! $student) {
            return response()->json(['message' => 'Student not found.'], 404);
        }
        $validated = $request->validate([
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],
            'academic_year' => ['required', 'string', 'max:20'],
            'semester' => ['required', 'string', 'max:20'],
            'status' => ['nullable', 'string', 'max:20', 'in:enrolled,completed,dropped'],
        ], [
            'subject_id.required' => 'Subject is required.',
            'academic_year.required' => 'Academic year is required.',
            'semester.required' => 'Semester is required.',
        ]);
        $validated['student_id'] = $student->student_id;
        $validated['status'] = $validated['status'] ?? 'enrolled';
        $exists = Enrollment::where('student_id', $student->student_id)
            ->where('subject_id', $validated['subject_id'])
            ->where('academic_year', $validated['academic_year'])
            ->where('semester', $validated['semester'])
            ->exists();
        if ($exists) {
            return response()->json(['message' => 'This student is already enrolled in this subject for the given academic year and semester.', 'errors' => ['subject_id' => ['Duplicate enrollment.']]], 422);
        }
        $enrollment = Enrollment::create($validated);
        $enrollment->load('subject');
        SystemLog::create([
            'action' => 'Enrollment added',
            'user_id' => $request->user()->id,
            'role' => $request->user()->roles->first()?->name ?? $request->user()->role ?? null,
        ]);
        return response()->json(['message' => 'Enrollment added.', 'enrollment' => $enrollment], 201);
    }

    /**
     * Update an enrollment (staff/admin).
     */
    public function updateEnrollment(Request $request, int $id, int $enrollmentId): JsonResponse
    {
        if ($err = $this->requireAuth()) {
            return $err;
        }
        if ($err = $this->requireRoles($request->user(), ['staff', 'admin'])) {
            return $err;
        }
        $enrollment = Enrollment::where('student_id', $id)->where('id', $enrollmentId)->first();
        if (! $enrollment) {
            return response()->json(['message' => 'Enrollment not found.'], 404);
        }
        $validated = $request->validate([
            'academic_year' => ['sometimes', 'required', 'string', 'max:20'],
            'semester' => ['sometimes', 'required', 'string', 'max:20'],
            'status' => ['nullable', 'string', 'max:20', 'in:enrolled,completed,dropped'],
        ]);
        $enrollment->update($validated);
        $enrollment->load('subject');
        SystemLog::create([
            'action' => 'Enrollment updated',
            'user_id' => $request->user()->id,
            'role' => $request->user()->roles->first()?->name ?? $request->user()->role ?? null,
        ]);
        return response()->json(['message' => 'Enrollment updated.', 'enrollment' => $enrollment]);
    }

    /**
     * Delete an enrollment (staff/admin).
     */
    public function destroyEnrollment(Request $request, int $id, int $enrollmentId): JsonResponse
    {
        if ($err = $this->requireAuth()) {
            return $err;
        }
        if ($err = $this->requireRoles($request->user(), ['staff', 'admin'])) {
            return $err;
        }
        $enrollment = Enrollment::where('student_id', $id)->where('id', $enrollmentId)->first();
        if (! $enrollment) {
            return response()->json(['message' => 'Enrollment not found.'], 404);
        }
        $enrollment->delete();
        SystemLog::create([
            'action' => 'Enrollment removed',
            'user_id' => $request->user()->id,
            'role' => $request->user()->roles->first()?->name ?? $request->user()->role ?? null,
        ]);
        return response()->json(['message' => 'Enrollment removed.']);
    }

    /**
     * Store grade for a student. Required: subject_id, academic_year, semester. Optional: grade_value, remarks.
     */
    public function storeGrade(Request $request, int $id): JsonResponse
    {
        if ($err = $this->requireAuth()) {
            return $err;
        }
        if ($err = $this->requireRoles($request->user(), ['staff', 'admin'])) {
            return $err;
        }
        $student = Student::find($id);
        if (! $student) {
            return response()->json(['message' => 'Student not found.'], 404);
        }
        $validated = $request->validate([
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],
            'academic_year' => ['required', 'string', 'max:20'],
            'semester' => ['required', 'string', 'max:20'],
            'grade_value' => ['nullable', 'numeric', 'min:0', 'max:5.00'],
            'remarks' => ['nullable', 'string', 'max:50'],
        ], [
            'subject_id.required' => 'Subject is required.',
            'academic_year.required' => 'Academic year is required.',
            'semester.required' => 'Semester is required.',
        ]);
        $validated['student_id'] = $student->student_id;
        if (isset($validated['grade_value'])) {
            $validated['grade_value'] = round((float) $validated['grade_value'], 2);
        }
        $exists = Grade::where('student_id', $student->student_id)
            ->where('subject_id', $validated['subject_id'])
            ->where('academic_year', $validated['academic_year'])
            ->where('semester', $validated['semester'])
            ->exists();
        if ($exists) {
            return response()->json(['message' => 'A grade already exists for this subject, academic year, and semester.', 'errors' => ['subject_id' => ['Duplicate grade.']]], 422);
        }
        $grade = Grade::create($validated);
        $grade->load('subject');
        SystemLog::create([
            'action' => 'Grade added',
            'user_id' => $request->user()->id,
            'role' => $request->user()->roles->first()?->name ?? $request->user()->role ?? null,
        ]);
        return response()->json(['message' => 'Grade added.', 'grade' => $grade], 201);
    }

    /**
     * Update a grade (staff/admin).
     */
    public function updateGrade(Request $request, int $id, int $gradeId): JsonResponse
    {
        if ($err = $this->requireAuth()) {
            return $err;
        }
        if ($err = $this->requireRoles($request->user(), ['staff', 'admin'])) {
            return $err;
        }
        $grade = Grade::where('student_id', $id)->where('id', $gradeId)->first();
        if (! $grade) {
            return response()->json(['message' => 'Grade not found.'], 404);
        }
        $validated = $request->validate([
            'academic_year' => ['sometimes', 'required', 'string', 'max:20'],
            'semester' => ['sometimes', 'required', 'string', 'max:20'],
            'grade_value' => ['nullable', 'numeric', 'min:0', 'max:5.00'],
            'remarks' => ['nullable', 'string', 'max:50'],
        ]);
        if (array_key_exists('grade_value', $validated) && $validated['grade_value'] !== null) {
            $validated['grade_value'] = round((float) $validated['grade_value'], 2);
        }
        $grade->update($validated);
        $grade->load('subject');
        SystemLog::create([
            'action' => 'Grade updated',
            'user_id' => $request->user()->id,
            'role' => $request->user()->roles->first()?->name ?? $request->user()->role ?? null,
        ]);
        return response()->json(['message' => 'Grade updated.', 'grade' => $grade]);
    }

    /**
     * Delete a grade (staff/admin).
     */
    public function destroyGrade(Request $request, int $id, int $gradeId): JsonResponse
    {
        if ($err = $this->requireAuth()) {
            return $err;
        }
        if ($err = $this->requireRoles($request->user(), ['staff', 'admin'])) {
            return $err;
        }
        $grade = Grade::where('student_id', $id)->where('id', $gradeId)->first();
        if (! $grade) {
            return response()->json(['message' => 'Grade not found.'], 404);
        }
        $grade->delete();
        SystemLog::create([
            'action' => 'Grade removed',
            'user_id' => $request->user()->id,
            'role' => $request->user()->roles->first()?->name ?? $request->user()->role ?? null,
        ]);
        return response()->json(['message' => 'Grade removed.']);
    }

    /*
     *  Archive a student
    */
    public function archiveStudent(Request $request, int $id): JsonResponse
    {
        try {
            if ($err = $this->requireAuth()) {
                return $err;
            }
            if ($err = $this->requireRoles($request->user(), ['staff', 'admin'])) {
                return $err;
            }
            $student = Student::find($id);
            if (! $student) {
                return response()->json(['message' => 'Student not found.'], 404);
            }
            $archiveRecord = ArchiveRecord::create([
                'student_id' => $student->student_id,
                'record_type' => $request->input('record_type'),
                'cabinet_no' => $request->input('cabinet_no'),
                'shelf_no' => $request->input('shelf_no'),
                'folder_code' => $request->input('folder_code'),
                'document_status' => $request->input('document_status'),
            ]);
            if (!$archiveRecord) {
                return response()->json(['message' => 'Failed to create archive record.'], 500);
            }
            SystemLog::create([
                'action' => 'Student archived',
                'user_id' => $request->user()->id,
                'role' => $request->user()->roles->first()?->name ?? $request->user()->role ?? null,
            ]);
            return response()->json(['message' => 'Student archived successfully.']);
        } catch (\Exception $e) {
            Log::error('Failed to archive student: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to archive student.'], 500);
        }
    }
}
