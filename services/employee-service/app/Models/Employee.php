<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'nama_lengkap', 'nomor_induk_karyawan', 'alamat',
        'branch_id', 'position_id', 'tanggal_gabung', 'tanggal_mulai_kontrak',
        'tanggal_akhir_kontrak', 'status',
    ];
    protected $casts = [
        'tanggal_gabung' => 'date',
        'tanggal_mulai_kontrak' => 'date',
        'tanggal_akhir_kontrak' => 'date',
    ];

    protected $appends = ['branch_name', 'position_name'];

    public function branch() { return $this->belongsTo(Branch::class); }
    public function position() { return $this->belongsTo(Position::class); }

    public function getBranchNameAttribute(): ?string { return $this->branch?->name; }
    public function getPositionNameAttribute(): ?string { return $this->position?->name; }
}
