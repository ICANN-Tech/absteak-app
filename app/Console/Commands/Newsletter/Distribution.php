<?php

namespace App\Console\Commands\Newsletter;

use App\Jobs\SendNewsletterJob;
use App\Models\Newsletter;
use App\Models\NewsletterSubscriber;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class Distribution extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'newsletter:distribute
                            {--dry-run : Run without actually sending emails}
                            {--limit=100 : Maximum number of emails to process per run}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process newsletter distribution for published newsletters';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $dryRun = $this->option('dry-run');
        $limit = (int) $this->option('limit');

        $this->info('Starting newsletter distribution process...');

        // Find newsletters that are published but not yet distributed
        $newsletters = Newsletter::where('is_published', true)
            ->where('is_distributed', false)
            ->where('published_at', '<=', now())
            ->get();

        if ($newsletters->isEmpty()) {
            $this->info('No newsletters found for distribution.');
            return self::SUCCESS;
        }

        $this->info("Found {$newsletters->count()} newsletter(s) for distribution.");

        foreach ($newsletters as $newsletter) {
            $this->processNewsletter($newsletter, $dryRun, $limit);
        }

        $this->info('Newsletter distribution process completed.');
        return self::SUCCESS;
    }

    /**
     * Process a single newsletter for distribution.
     */
    private function processNewsletter(Newsletter $newsletter, bool $dryRun, int $limit): void
    {
        $this->info("Processing newsletter: {$newsletter->title}");

        // Get active subscribers
        $subscribers = NewsletterSubscriber::where('is_active', true)
            ->whereNotNull('email_verified_at')
            ->limit($limit)
            ->get();

        if ($subscribers->isEmpty()) {
            $this->warn('No active subscribers found.');
            return;
        }

        $this->info("Found {$subscribers->count()} active subscriber(s).");

        if ($dryRun) {
            $this->info('[DRY RUN] Would dispatch newsletter jobs for subscribers.');
            return;
        }

        // Dispatch jobs for each subscriber
        $jobsDispatched = 0;
        foreach ($subscribers as $subscriber) {
            try {
                SendNewsletterJob::dispatch($newsletter, $subscriber);
                $jobsDispatched++;
            } catch (\Exception $e) {
                $this->error("Failed to dispatch job for subscriber {$subscriber->email}: {$e->getMessage()}");
                Log::error('Newsletter job dispatch failed', [
                    'newsletter_id' => $newsletter->id,
                    'subscriber_id' => $subscriber->id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        $this->info("Dispatched {$jobsDispatched} newsletter jobs.");

        // Mark newsletter as distributed
        $newsletter->update([
            'is_distributed' => true,
            'distributed_at' => now()
        ]);

        $this->info("Newsletter '{$newsletter->title}' marked as distributed.");
    }
}