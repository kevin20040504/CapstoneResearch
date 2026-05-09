<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    protected $fillable = ['code', 'title', 'units', 'description','prerequisite'];

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class);
    }

    public function curriculum(): HasMany
    {
        return $this->hasMany(Curriculum::class);
    }

    public function prerequisite(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'prerequisite');
    }
}
