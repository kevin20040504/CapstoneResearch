<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\AuthorizesRole;
use App\Http\Controllers\Controller;
use App\Models\SystemLog;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class SystemLogController extends Controller
{
    use AuthorizesRole;

    //
    public function index(Request $request) : JsonResponse
    {
        try {
            if($err = $this->requireAuth()) {
                return $err;
            }
            if($err = $this->requireRoles($request->user(), ['admin'])) {
                return $err;
            }
            $query = SystemLog::query();

            $perPage = min(max((int) $request->input('per_page', 15), 5), 100);
            $logs = $query->paginate($perPage);

           
            return response()->json($logs);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to get system logs', 'error' => $e->getMessage()], 500);
        }
    }
}
