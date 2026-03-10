<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\AuthorizesRole;
use App\Http\Requests\RejectRecordRequestRequest;
use App\Models\RecordRequest;
use App\Models\RecordTransaction;
use App\Models\Staff;
use App\Services\StaffService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Pending record requests (approve/reject) and document release.
 */
class RequestController extends Controller
{
    use AuthorizesRole;

    public function __construct(
        private StaffService $staffService
    ) {}

    /**
     * List pending record requests (staff + admin).
     */
    public function indexPending(Request $request): JsonResponse
    {
        if ($err = $this->requireAuth()) {
            return $err;
        }
        if ($err = $this->requireRoles($request->user(), ['staff', 'admin'])) {
            return $err;
        }

        $query = RecordRequest::with('student:id,student_id,student_number,first_name,last_name,email')
            ->where('status', RecordRequest::STATUS_PENDING);

        if ($search = $request->input('search')) {
            $search = preg_replace('/\s+/', ' ', trim($search));
            $query->whereHas('student', function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('student_number', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($recordType = $request->input('record_type')) {
            $query->where('record_type', $recordType);
        }

        $sortKey = $request->input('sort', 'requested_at');
        $sortDir = $request->input('dir', 'desc') === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortKey, $sortDir);

        $perPage = min(max((int) $request->input('per_page', 15), 5), 100);
        $items = $query->paginate($perPage);

        $items->getCollection()->transform(function (RecordRequest $req) {
            $s = $req->student;
            $req->setAttribute('student_name', $s ? trim($s->first_name . ' ' . $s->last_name) : null);
            return $req;
        });

        return response()->json($items);
    }

    /**
     * Approve a pending request (staff + admin).
     */
    public function approve(Request $request, int $id): JsonResponse
    {
        if ($err = $this->requireAuth()) {
            return $err;
        }
        if ($err = $this->requireRoles($request->user(), ['staff', 'admin'])) {
            return $err;
        }

        $recordRequest = RecordRequest::find($id);
        if (! $recordRequest) {
            return response()->json(['message' => 'Record request not found.'], 404);
        }
        if ($recordRequest->status !== RecordRequest::STATUS_PENDING) {
            return response()->json(['message' => 'Request is not pending.'], 422);
        }

        $staff = $this->staffService->getOrCreateStaffForUser($request->user());
        if (! $staff) {
            return response()->json(['message' => 'Staff record not available.'], 403);
        }

        $recordRequest->update([
            'status' => RecordRequest::STATUS_APPROVED,
            'processed_by' => $staff->staff_id,
            'processed_at' => now(),
            'rejection_reason' => null,
        ]);

        return response()->json([
            'message' => 'Request approved successfully.',
            'record_request' => $recordRequest->load('student'),
        ]);
    }

    /**
     * Reject a pending request (staff + admin).
     */
    public function reject(RejectRecordRequestRequest $request, int $id): JsonResponse
    {
        if ($err = $this->requireAuth()) {
            return $err;
        }
        if ($err = $this->requireRoles($request->user(), ['staff', 'admin'])) {
            return $err;
        }

        $recordRequest = RecordRequest::find($id);
        if (! $recordRequest) {
            return response()->json(['message' => 'Record request not found.'], 404);
        }
        if ($recordRequest->status !== RecordRequest::STATUS_PENDING) {
            return response()->json(['message' => 'Request is not pending.'], 422);
        }

        $staff = $this->staffService->getOrCreateStaffForUser($request->user());
        if (! $staff) {
            return response()->json(['message' => 'Staff record not available.'], 403);
        }

        $recordRequest->update([
            'status' => RecordRequest::STATUS_REJECTED,
            'processed_by' => $staff->staff_id,
            'processed_at' => now(),
            'rejection_reason' => $request->validated('rejection_reason'),
        ]);

        return response()->json([
            'message' => 'Request rejected.',
            'record_request' => $recordRequest->load('student'),
        ]);
    }

    /**
     * List approved requests (for document release tab) (staff + admin).
     */
    public function indexApproved(Request $request): JsonResponse
    {
        if ($err = $this->requireAuth()) {
            return $err;
        }
        if ($err = $this->requireRoles($request->user(), ['staff', 'admin'])) {
            return $err;
        }

        $query = RecordRequest::with('student:id,student_id,student_number,first_name,last_name,email')
            ->where('status', RecordRequest::STATUS_APPROVED);

        $sortKey = $request->input('sort', 'processed_at');
        $sortDir = $request->input('dir', 'desc') === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortKey, $sortDir);

        $perPage = min(max((int) $request->input('per_page', 15), 5), 100);
        $items = $query->paginate($perPage);

        $items->getCollection()->transform(function (RecordRequest $req) {
            $s = $req->student;
            $req->setAttribute('student_name', $s ? trim($s->first_name . ' ' . $s->last_name) : null);
            return $req;
        });

        return response()->json($items);
    }

    /**
     * Release document (approved → released) and log transaction (staff + admin).
     */
    public function release(Request $request, int $id): JsonResponse
    {
        if ($err = $this->requireAuth()) {
            return $err;
        }
        if ($err = $this->requireRoles($request->user(), ['staff', 'admin'])) {
            return $err;
        }

        $recordRequest = RecordRequest::find($id);
        if (! $recordRequest) {
            return response()->json(['message' => 'Record request not found.'], 404);
        }

        $staff = $this->staffService->getOrCreateStaffForUser($request->user());
        if (! $staff) {
            return response()->json(['message' => 'Staff record not available.'], 403);
        }

        return $this->doRelease($recordRequest, $staff);
    }

    /**
     * Create a transaction (e.g. document release)
     */
    public function storeTransaction(Request $request): JsonResponse
    {
        if ($err = $this->requireAuth()) {
            return $err;
        }
        if ($err = $this->requireRoles($request->user(), ['staff', 'admin'])) {
            return $err;
        }

        $validated = $request->validate([
            'request_id' => ['required', 'integer', 'exists:record_requests,id'],
            'transaction_type' => ['required', 'string', 'in:release'],
        ]);

        $recordRequest = RecordRequest::find($validated['request_id']);
        if (! $recordRequest) {
            return response()->json(['message' => 'Record request not found.'], 404);
        }

        $staff = $this->staffService->getOrCreateStaffForUser($request->user());
        if (! $staff) {
            return response()->json(['message' => 'Staff record not available.'], 403);
        }

        return $this->doRelease($recordRequest, $staff);
    }

    private function doRelease(RecordRequest $recordRequest, Staff $staff): JsonResponse
    {
        if ($recordRequest->status !== RecordRequest::STATUS_APPROVED) {
            return response()->json(['message' => 'Only approved requests can be released.'], 422);
        }

        $recordRequest->update([
            'status' => RecordRequest::STATUS_RELEASED,
            'released_at' => now(),
        ]);

        RecordTransaction::create([
            'student_id' => $recordRequest->student_id,
            'staff_id' => $staff->staff_id,
            'transaction_type' => 'document_release',
            'transaction_date' => now(),
            'status' => 'completed',
        ]);

        return response()->json([
            'message' => 'Document released successfully.',
            'record_request' => $recordRequest->load('student'),
        ]);
    }
}
