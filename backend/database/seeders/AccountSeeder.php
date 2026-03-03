<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin',
                'username' => 'admin',
                'email' => 'admin@example.com',
                'password' => 'password123', 
                'role' => 'admin',
            ],
            [
                'name' => 'Staff',
                'username' => 'staff',
                'email' => 'staff@example.com',
                'password' => 'password123', 
                'role' => 'staff',
            ],
            [
                'name' => 'Student User',
                'username' => 'student',
                'email' => 'student@example.com',
                'password' => 'password123', 
                'role' => 'student',
            ],
        ];
        foreach ($users as $userData) {
            $user = User::create($userData);
            $user->assignRole($userData['role']);
        }
        echo "Accounts created successfully\n";
        foreach ($users as $userData) {
            echo "Username: " . $userData['username'] . " | Password: password123 | Role: " . $userData['role'] . "\n";
        }
    }
}
