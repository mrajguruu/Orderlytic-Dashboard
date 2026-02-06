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
        Schema::create('orders', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->unsignedBigInteger('restaurant_id');
            $table->decimal('order_amount', 10, 2);
            $table->datetime('order_time');
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('restaurant_id')
                  ->references('id')
                  ->on('restaurants')
                  ->onDelete('cascade');

            // Indexes for performance
            $table->index('restaurant_id');
            $table->index('order_time');
            $table->index(['restaurant_id', 'order_time']);
            $table->index('order_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
