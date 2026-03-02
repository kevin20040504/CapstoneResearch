<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\AuthorizesRole;
use App\Http\Requests\StoreRecordRequestRequest;
use App\Models\RecordRequest;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Student: submit record request and view own requests.
 */
class RecordRequestController extends Controller
{
    use AuthorizesRole;

    /**
     * List authenticated student's record requests.
     */
    public function index(Request $request): JsonResponse
    {
        if ($err = $this->requireAuth()) {
            return $err;
        }
        if ($err = $this->requireRoles($request->user(), ['student'])) {
            return $err;
        }

        $student = $request->user()->student;
        if (! $student) {
            return response()->json(['message' => 'Student record not found.', 'data' => []], 200);
        }

        $query = RecordRequest::where('student_id', $student->student_id)->orderByDesc('requested_at');

        $perPage = min(max((int) $request->input('per_page', 15), 5), 100);
        $items = $query->paginate($perPage);

        return response()->json($items);
    }

    /**
     * Submit a new record request (student only).
     */
    public function store(StoreRecordRequestRequest $request): JsonResponse
    {
        if ($err = $this->requireAuth()) {
            return $err;
        }
        if ($err = $this->requireRoles($request->user(), ['student'])) {
            return $err;
        }

        $student = $request->user()->student;
        if (! $student) {
            return response()->json(['message' => 'Student record not found. Cannot submit request.'], 403);
        }

        $validated = $request->validated();
        $validated['student_id'] = $student->student_id;
        $validated['status'] = RecordRequest::STATUS_PENDING;
        $validated['requested_at'] = now();
        $validated['copies'] = $validated['copies'] ?? 1;

        $recordRequest = RecordRequest::create($validated);

        return response()->json([
            'message' => 'Record request submitted successfully.',
            'record_request' => $recordRequest,
        ], 201);
    }

    /**
     * Show a single record request (own only).
     */
    public function show(Request $request, int $id): JsonResponse
    {
        if ($err = $this->requireAuth()) {
            return $err;
        }
        if ($err = $this->requireRoles($request->user(), ['student'])) {
            return $err;
        }

        $student = $request->user()->student;
        if (! $student) {
            return response()->json(['message' => 'Student record not found.'], 403);
        }

        $recordRequest = RecordRequest::where('student_id', $student->student_id)->find($id);
        if (! $recordRequest) {
            return response()->json(['message' => 'Record request not found.'], 404);
        }

        return response()->json(['record_request' => $recordRequest]);
    }
}
