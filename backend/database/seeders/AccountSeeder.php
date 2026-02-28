<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

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
                'email' => 'admin@example.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ],
            [
                'name' => 'Staff',
                'email' => 'staff@example.com',
                'password' => Hash::make('password123'),
                'role' => 'staff',
            ]
            ];
        foreach ($users as $user) {

            $user = User::create($user);
            $user->assignRole($user['role']);
        }
        echo "Accounts created successfully\n";
        foreach ($users as $user) {
            echo "Email: " . $user['email'] . "\n";
            echo "Password: password123 \n";
            echo "Role: " . $user['role'] . "\n";
            echo "--------------------------------\n";  
        }
    }
}
