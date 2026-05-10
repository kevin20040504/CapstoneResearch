<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgramMapping extends Model
{
    //

    protected $fillable = ['program_id', 'student_id','academic_year','semester','status','year_level'];


    public function program()
    {
        return $this->belongsTo(Program::class);
    }
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }
}
