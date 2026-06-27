<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('code', 30)->unique();
            $table->string('contact_person', 100);
            $table->string('phone', 30);
            $table->string('email', 150)->nullable();
            $table->text('address');
            $table->string('npwp', 30)->nullable();
            $table->unsignedSmallInteger('payment_term_days');
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('vendors'); }
};
