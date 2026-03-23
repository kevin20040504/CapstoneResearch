<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Staff extends Model
{
    protected $primaryKey = 'staff_id';

    public $incrementing = true;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'role',
        'email',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function recordTransactions(): HasMany
    {
        return $this->hasMany(RecordTransaction::class, 'staff_id', 'staff_id');
    }

    public function processedRequests(): HasMany
    {
        return $this->hasMany(RecordRequest::class, 'processed_by', 'staff_id');
    }
}
