<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Program extends Model
{
    protected $table = 'programs';

    protected $fillable = ['code', 'name', 'description'];

    public function students(): HasMany
    {
        return $this->hasMany(Student::class, 'program_id');
    }

    public function curriculum(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Curriculum::class);
    }
}
