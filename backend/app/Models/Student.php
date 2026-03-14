<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    use HasFactory;

    protected $primaryKey = 'student_id';

    public $incrementing = true;

    protected $fillable = [
        'user_id',
        'program_id',
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class, 'student_id', 'student_id');
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class, 'student_id', 'student_id');
    }

    public function recordRequests(): HasMany
    {
        return $this->hasMany(RecordRequest::class, 'student_id', 'student_id');
    }
}
