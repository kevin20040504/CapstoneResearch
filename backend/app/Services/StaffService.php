<?php

namespace App\Services;

use App\Models\Staff;
use App\Models\User;

class StaffService
{
    /**
     * Get or create Staff record for a user with role staff or admin (for transaction logging).
     */
    public function getOrCreateStaffForUser(User $user): ?Staff
    {
        $role = $user->roles->first()?->name ?? $user->role ?? null;
        if (! in_array($role, ['staff', 'admin'], true)) {
            return null;
        }

        $staff = Staff::where('user_id', $user->id)->first();

        if ($staff) {
            return $staff;
        }

        $name = explode(' ', $user->name, 2);

        return Staff::create([
            'user_id' => $user->id,
            'first_name' => $name[0] ?? $user->name,
            'last_name' => $name[1] ?? '',
            'role' => $role,
            'email' => $user->email,
        ]);
    }
}
