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
        Schema::create('configurations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('key');
            $table->string('group');
            $table->text('value');
            $table->enum('type', ['string', 'integer', 'float', 'boolean', 'array', 'object']);
            $table->timestamps();
        });

        Schema::create('reservations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->date('reservation_date');
            $table->time('reservation_time');
            $table->integer('number_of_people');
            $table->text('special_requests')->nullable();
            $table->timestamps();
        });

        Schema::create('newsletters', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->longText('content');
            $table->text('excerpt')->nullable();
            $table->string('slug')->unique();
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('featured_image')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('is_distributed')->default(false)->after('published_at');
            $table->timestamp('distributed_at')->nullable()->after('is_distributed');
            $table->timestamps();
        });

        Schema::create('newsletter_subscribers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email')->unique();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('email_verified_at')->nullable();
            $table->string('verification_token')->nullable();
            $table->string('unsubscribe_token')->nullable();
            $table->json('preferences')->nullable();
            $table->string('source')->nullable();
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
        });

        Schema::create('newsletter_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('newsletter_id');
            $table->foreign('newsletter_id')->references('id')->on('newsletters');
            $table->uuid('newsletter_subscriber_id');
            $table->foreign('newsletter_subscriber_id')->references('id')->on('newsletter_subscribers');
            $table->string('action');
            $table->string('status')->nullable();
            $table->json('details')->nullable();
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('slug')->unique();
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('menus', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('slug')->unique();
            $table->string('image')->nullable();
            $table->decimal('price', 10, 2);
            $table->boolean('is_available')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->integer('sort_order')->default(0);
            $table->uuid('category_id');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            $table->json('ingredients')->nullable();
            $table->json('allergens')->nullable();
            $table->string('preparation_time')->nullable();
            $table->integer('calories')->nullable();
            $table->timestamps();
        });


        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('transaction_id')->unique();
            $table->string('type')->default('reservation'); // reservation, order, etc.
            $table->string('status')->default('pending'); // pending, paid, unpaid, cancelled, refunded
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('IDR');
            $table->string('payment_method')->nullable(); // xendit, bank_transfer, cash, etc.
            $table->string('payment_reference')->nullable(); // external payment reference
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone')->nullable();
            $table->json('transaction_details')->nullable(); // reservation details, order items, etc.
            $table->json('payment_details')->nullable(); // payment gateway response, etc.
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->text('notes')->nullable();
            $table->string('payment_url')->nullable(); // Xendit payment link URL
            $table->string('xendit_invoice_id')->nullable(); // Xendit invoice ID
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['status', 'created_at']);
            $table->index(['customer_email', 'created_at']);
            $table->index(['type', 'status']);
            $table->index('expires_at');
        });

        Schema::create('customer_services', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('department')->default('general'); // general, technical, billing, etc.
            $table->enum('status', ['available', 'busy', 'offline'])->default('offline');
            $table->boolean('is_active')->default(true);
            $table->integer('max_concurrent_tickets')->default(5);
            $table->integer('current_ticket_count')->default(0);
            $table->json('skills')->nullable(); // Array of skills/specializations
            $table->json('working_hours')->nullable(); // Working schedule
            $table->timestamp('last_activity_at')->nullable();
            $table->text('bio')->nullable();
            $table->string('avatar')->nullable();
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['status', 'is_active']);
            $table->index(['department', 'status']);
            $table->index('last_activity_at');
        });

        Schema::create('tickets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('ticket_number')->unique();
            $table->string('subject');
            $table->text('description');
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->enum('status', ['open', 'in_progress', 'pending_customer', 'resolved', 'closed'])->default('open');
            $table->string('category')->default('general'); // general, technical, billing, complaint, etc.
            $table->uuid('customer_id')->nullable(); // For registered users
            $table->foreign('customer_id')->references('id')->on('users')->onDelete('set null');
            $table->string('customer_name'); // For guest users or backup
            $table->string('customer_email');
            $table->string('customer_phone')->nullable();
            $table->uuid('assigned_cs_id')->nullable();
            $table->foreign('assigned_cs_id')->references('id')->on('customer_services')->onDelete('set null');
            $table->timestamp('assigned_at')->nullable();
            $table->timestamp('first_response_at')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->json('chat_session_data')->nullable(); // Store chat session info
            $table->json('metadata')->nullable(); // Additional data like browser info, etc.
            $table->text('internal_notes')->nullable(); // CS internal notes
            $table->integer('satisfaction_rating')->nullable(); // 1-5 rating
            $table->text('satisfaction_feedback')->nullable();
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['status', 'created_at']);
            $table->index(['assigned_cs_id', 'status']);
            $table->index(['customer_email', 'created_at']);
            $table->index(['category', 'status']);
            $table->index(['priority', 'status']);
            $table->index('ticket_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
        Schema::dropIfExists('customer_services');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('menus');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('newsletter_logs');
        Schema::dropIfExists('newsletter_subscribers');
        Schema::dropIfExists('newsletters');
        Schema::dropIfExists('reservations');
        Schema::dropIfExists('configurations');
    }
};
