<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        // create roles
        echo "Creating roles...\n";
        Role::create(['name' => 'admin', 'guard_name' => 'api']);
        Role::create(['name' => 'staff', 'guard_name' => 'api']);
        Role::create(['name' => 'student', 'guard_name' => 'api']);
        echo "Roles created successfully\n";

        // create permissions
        echo "Creating permissions...\n";
        Permission::create(['name' => 'create-user']);
        Permission::create(['name' => 'edit-user']);
        Permission::create(['name' => 'delete-user']);
        echo "Permissions created successfully\n";
    }
}
