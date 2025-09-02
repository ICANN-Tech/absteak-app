<?php

namespace Database\Factories;

use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Transaction::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
{
    $types = ['purchase', 'refund', 'subscription', 'donation'];
    $statuses = ['pending', 'paid', 'unpaid', 'cancelled', 'refunded'];
    $currencies = ['USD', 'EUR', 'GBP', 'IDR', 'SGD'];
    $paymentMethods = ['credit_card', 'debit_card', 'bank_transfer', 'paypal', 'stripe', 'xendit'];

    $firstName = $this->faker->firstName();
    $lastName = $this->faker->lastName();
    $customerName = $firstName . ' ' . $lastName;
    $customerEmail = strtolower($firstName . '.' . $lastName . '@' . $this->faker->freeEmailDomain());

    $amount = $this->faker->randomFloat(2, 10, 5000);
    $paymentFee = $this->faker->randomFloat(2, 0.5, 50);
    $netAmount = $amount - $paymentFee;

    return [
        'transaction_id' => 'TXN-' . strtoupper(Str::random(12)),
        'type' => $this->faker->randomElement($types),
        'status' => $this->faker->randomElement($statuses),
        'amount' => $amount,
        'currency' => $this->faker->randomElement($currencies),
        'payment_method' => $this->faker->randomElement($paymentMethods),
        'customer_name' => $customerName,
        'customer_email' => $customerEmail,
        'transaction_details' => [
            'product_name' => $this->faker->randomElement([
                'Premium Wagyu Steak',
                'Ribeye Steak Dinner',
                'Filet Mignon Special',
                'T-Bone Steak Combo',
                'Sirloin Steak Meal',
                'Porterhouse Steak',
                'New York Strip Steak'
            ]),
            'quantity' => $this->faker->numberBetween(1, 5),
            'description' => $this->faker->sentence(6),
            'order_id' => 'ORD-' . strtoupper(Str::random(8)),
            'restaurant_location' => $this->faker->randomElement([
                'Downtown Branch',
                'Mall Location',
                'Airport Terminal',
                'City Center',
                'Waterfront'
            ])
        ],
        'payment_details' => [
            'gateway' => $this->faker->randomElement(['stripe', 'xendit', 'paypal']),
            'gateway_transaction_id' => 'TXN-' . strtoupper(Str::random(12)),
            'payment_fee' => $paymentFee,
            'net_amount' => $netAmount,
            'card_last_four' => $this->faker->optional(0.7)->numerify('####'),
            'card_brand' => $this->faker->optional(0.7)->randomElement(['visa', 'mastercard', 'amex']),
            'bank_name' => $this->faker->optional(0.3)->company() . ' Bank'
        ]
    ];
}


    /**
     * Indicate that the transaction is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Indicate that the transaction is paid.
     */
    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'paid',
            'payment_details' => array_merge($attributes['payment_details'] ?? [], [
                'paid_at' => $this->faker->dateTimeBetween('-1 month', 'now')->format('Y-m-d H:i:s'),
                'confirmation_number' => 'CONF-' . strtoupper(Str::random(10))
            ])
        ]);
    }

    /**
     * Indicate that the transaction is unpaid/declined.
     */
    public function unpaid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'unpaid',
            'payment_details' => array_merge($attributes['payment_details'] ?? [], [
                'decline_reason' => $this->faker->randomElement([
                    'Insufficient funds',
                    'Card expired',
                    'Invalid card number',
                    'Payment declined by bank',
                    'Security check failed'
                ]),
                'retry_attempts' => $this->faker->numberBetween(0, 3),
                'declined_at' => $this->faker->dateTimeBetween('-1 week', 'now')->format('Y-m-d H:i:s')
            ])
        ]);
    }

    /**
     * Indicate that the transaction is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
            'payment_details' => array_merge($attributes['payment_details'] ?? [], [
                'cancelled_at' => $this->faker->dateTimeBetween('-1 week', 'now')->format('Y-m-d H:i:s'),
                'cancellation_reason' => $this->faker->randomElement([
                    'Customer request',
                    'Fraud detection',
                    'System error',
                    'Timeout'
                ])
            ])
        ]);
    }

    /**
     * Indicate that the transaction is a purchase type.
     */
    public function purchase(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'purchase',
        ]);
    }

    /**
     * Indicate that the transaction is a refund type.
     */
    public function refund(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'refund',
            'amount' => -abs($attributes['amount']), // Negative amount for refunds
        ]);
    }

    /**
     * Create a high-value transaction.
     */
    public function highValue(): static
    {
        return $this->state(fn (array $attributes) => [
            'amount' => $this->faker->randomFloat(2, 1000, 10000),
            'transaction_details' => array_merge($attributes['transaction_details'] ?? [], [
                'product_name' => 'Premium Wagyu Tasting Menu',
                'quantity' => $this->faker->numberBetween(2, 8),
                'description' => 'Exclusive multi-course wagyu beef experience with wine pairing'
            ])
        ]);
    }
}