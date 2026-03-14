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

        // Support role:staff,admin (single string) or role:staff,admin (multiple args)
        $allowed = collect($roles)->flatMap(fn (string $r) => explode(',', $r))->map(fn (string $r) => trim($r))->filter()->values()->all();
        $userRole = $request->user()->roles->first()?->name ?? $request->user()->role ?? null;

        if (! $userRole || ! in_array($userRole, $allowed, true)) {
            return response()->json(['message' => 'Forbidden. Insufficient role.'], 403);
        }

        return $next($request);
    }
}
