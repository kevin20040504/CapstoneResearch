<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecordTransaction extends Model
{
    protected $primaryKey = 'transaction_id';

    public $incrementing = true;

    protected $fillable = [
        'student_id',
        'staff_id',
        'transaction_type',
        'transaction_date',
        'status',
    ];

    protected $casts = [
        'transaction_date' => 'datetime',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'staff_id', 'staff_id');
    }
}
