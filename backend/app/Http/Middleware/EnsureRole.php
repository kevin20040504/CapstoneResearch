<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Role-based access control middleware.
 */
class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! $request->user()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $userRole = $request->user()->roles->first()?->name ?? $request->user()->role ?? null;

        if (! $userRole || ! in_array($userRole, $roles, true)) {
            return response()->json(['message' => 'Forbidden. Insufficient role.'], 403);
        }

        return $next($request);
    }
}
