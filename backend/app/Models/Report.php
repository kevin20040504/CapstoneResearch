<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $primaryKey = 'report_id';

    public $incrementing = true;

    protected $fillable = [
        'report_type',
        'generated_date',
        'content',
    ];

    protected $casts = [
        'generated_date' => 'datetime',
        'content' => 'array',
    ];
}
