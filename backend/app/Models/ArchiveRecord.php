<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArchiveRecord extends Model
{
    //
    protected $primaryKey = 'archive_id';

    public $incrementing = true;

    protected $fillable = [
        'student_id',
        'record_type',
        'cabinet_no',
        'shelf_no',
        'folder_code',
        'document_status',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }
}
