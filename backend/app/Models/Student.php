<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $primaryKey = 'student_id';

    public $incrementing = true;

    protected $fillable = [
        'user_id',
        'student_number',
        'first_name',
        'last_name',
        'date_of_birth',
        'email',
        'contact_number',
        'address',
        'enrollment_date',
        'graduation_date',
        'GPA',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'enrollment_date' => 'date',
        'graduation_date' => 'date',
        'GPA' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
