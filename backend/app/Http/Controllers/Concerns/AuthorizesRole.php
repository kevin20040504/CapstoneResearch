<?php

namespace App\Http\Controllers\Concerns;

use App\Models\User;
use Illuminate\Http\JsonResponse;

/**
 * RBAC helper for controllers. Use after auth:sanctum.
 */
trait AuthorizesRole
{
    protected function requireAuth(): ?JsonResponse
    {
        $user = request()->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return null;
    }

    protected function requireRoles(User $user, array $roles): ?JsonResponse
    {
        $role = $user->roles->first()?->name ?? $user->role ?? null;
        if (! $role || ! in_array($role, $roles, true)) {
            return response()->json(['message' => 'Forbidden. Insufficient role.'], 403);
        }

        return null;
    }

    protected function userRole(User $user): ?string
    {
        return $user->roles->first()?->name ?? $user->role ?? null;
    }

    protected function isAdmin(User $user): bool
    {
        return $this->userRole($user) === 'admin';
    }

    protected function isStaffOrAdmin(User $user): bool
    {
        return in_array($this->userRole($user), ['staff', 'admin'], true);
    }
}
