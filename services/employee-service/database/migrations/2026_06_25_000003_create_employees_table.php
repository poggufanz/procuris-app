<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->unique();
            $table->string('nama_lengkap', 150);
            $table->string('nomor_induk_karyawan', 30)->unique();
            $table->text('alamat');
            $table->unsignedBigInteger('branch_id')->index();
            $table->unsignedBigInteger('position_id')->index();
            $table->date('tanggal_gabung');
            $table->date('tanggal_mulai_kontrak');
            $table->date('tanggal_akhir_kontrak')->nullable()->index();
            $table->enum('status', ['aktif', 'nonaktif', 'kontrak_berakhir'])->default('aktif');
            $table->softDeletes();
            $table->timestamps();
            $table->index(['branch_id', 'status']);
        });
    }

    public function down(): void { Schema::dropIfExists('employees'); }
};
