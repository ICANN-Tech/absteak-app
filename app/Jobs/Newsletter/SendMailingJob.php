<?php

namespace App\Jobs\Newsletter;

use App\Models\Newsletter;
use App\Models\NewsletterLog;
use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewsletterMail;

class SendMailingJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 120;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Newsletter|string $newsletter,
        public NewsletterSubscriber|null $subscriber = null
    ) {
        $this->onQueue('default');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Handle simple string testing
            if (is_string($this->newsletter)) {
                // Set the working mail configuration
                config([
                    'mail.default' => 'smtp',
                    'mail.mailers.smtp.host' => 'mailpit',
                    'mail.mailers.smtp.port' => 1025,
                    'mail.mailers.smtp.encryption' => null,
                    'mail.mailers.smtp.username' => null,
                    'mail.mailers.smtp.password' => null,
                    'mail.from.address' => 'test@example.com',
                    'mail.from.name' => 'Laravel Test',
                ]);
                
                // Send a test email to verify mail system
                Mail::raw('This is a test email from Beanstalkd queue worker. The queue system is working correctly!', function ($message) {
                    $message->to($this->newsletter)
                            ->subject('Test Email from Beanstalkd Queue');
                });
                
                Log::info('Test queue job executed successfully', [
                    'test_email' => $this->newsletter,
                    'message' => 'Beanstalkd queue is working and test email sent!'
                ]);
                return;
            }

            // Set the working mail configuration for regular newsletters too
            config([
                'mail.default' => 'smtp',
                'mail.mailers.smtp.host' => 'mailpit',
                'mail.mailers.smtp.port' => 1025,
                'mail.mailers.smtp.encryption' => null,
                'mail.mailers.smtp.username' => null,
                'mail.mailers.smtp.password' => null,
                'mail.from.address' => 'test@example.com',
                'mail.from.name' => 'Laravel Test',
            ]);
            
            // Send the newsletter email
            Mail::to($this->subscriber->email)
                ->send(new NewsletterMail($this->newsletter, $this->subscriber));

            // Log successful delivery
            $this->logDelivery('sent', 'Newsletter sent successfully');

            Log::info('Newsletter sent successfully', [
                'newsletter_id' => $this->newsletter->id,
                'subscriber_id' => $this->subscriber->id,
                'subscriber_email' => $this->subscriber->email
            ]);

        } catch (\Exception $e) {
            // Log failed delivery
            if (!is_string($this->newsletter)) {
                $this->logDelivery('failed', 'Failed to send newsletter: ' . $e->getMessage());

                Log::error('Newsletter sending failed', [
                    'newsletter_id' => $this->newsletter->id,
                    'subscriber_id' => $this->subscriber->id,
                    'subscriber_email' => $this->subscriber->email,
                    'error' => $e->getMessage()
                ]);
            } else {
                Log::error('Test job failed', [
                    'test_email' => $this->newsletter,
                    'error' => $e->getMessage()
                ]);
            }

            // Re-throw the exception to trigger job retry
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        if (!is_string($this->newsletter)) {
            $this->logDelivery('failed', 'Newsletter delivery failed after all retries: ' . $exception->getMessage());

            Log::error('Newsletter job failed permanently', [
                'newsletter_id' => $this->newsletter->id,
                'subscriber_id' => $this->subscriber->id,
                'subscriber_email' => $this->subscriber->email,
                'error' => $exception->getMessage()
            ]);
        } else {
            Log::error('Test job failed permanently', [
                'test_email' => $this->newsletter,
                'error' => $exception->getMessage()
            ]);
        }
    }

    /**
     * Log the delivery attempt.
     */
    private function logDelivery(string $status, string $details): void
    {
        // Skip logging for test cases
        if (is_string($this->newsletter)) {
            return;
        }

        NewsletterLog::create([
            'newsletter_id' => $this->newsletter->id,
            'newsletter_subscriber_id' => $this->subscriber->id,
            'action' => 'email_delivery',
            'status' => $status,
            'details' => $details,
            'metadata' => [
                'subscriber_email' => $this->subscriber->email,
                'newsletter_title' => $this->newsletter->title,
                'attempt' => $this->attempts(),
                'queue' => $this->queue
            ]
        ]);
    }
}