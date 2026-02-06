<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('restaurants', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('name', 100);
            $table->string('location', 100);
            $table->string('cuisine', 50);
            $table->timestamps();

            // Indexes for filtering and searching
            $table->index('name');
            $table->index('location');
            $table->index('cuisine');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restaurants');
    }
};
