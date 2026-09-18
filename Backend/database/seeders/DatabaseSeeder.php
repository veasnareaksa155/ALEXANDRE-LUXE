<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Seed SuperAdmin User
        User::updateOrCreate(
            ['email' => 'admin@alexandreluxe.com'],
            [
                'name' => 'SuperAdmin Alexandre',
                'password' => Hash::make('password123'),
            ]
        );

        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
        ]);
    }
}