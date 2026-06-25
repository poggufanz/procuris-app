<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Position extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'level', 'division', 'parent_position_id', 'branch_id'];
    protected $casts = ['level' => 'integer'];

    public function parent() { return $this->belongsTo(self::class, 'parent_position_id'); }
    public function children() { return $this->hasMany(self::class, 'parent_position_id'); }
    public function employees() { return $this->hasMany(Employee::class); }
}
