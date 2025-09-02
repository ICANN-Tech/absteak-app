<?php

namespace App\Mail;

use App\Models\Newsletter;
use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Newsletter $newsletter,
        public NewsletterSubscriber $subscriber
    ) {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->newsletter->title,
            from: config('mail.from.address', 'noreply@example.com'),
            replyTo: config('mail.from.address', 'noreply@example.com'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            html: 'emails.newsletter',
            text: 'emails.newsletter-text',
            with: [
                'newsletter' => $this->newsletter,
                'subscriber' => $this->subscriber,
                'unsubscribeUrl' => $this->generateUnsubscribeUrl(),
                'viewOnlineUrl' => $this->generateViewOnlineUrl(),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }

    /**
     * Generate unsubscribe URL for the subscriber.
     */
    private function generateUnsubscribeUrl(): string
    {
        return route('newsletter.unsubscribe', [
            'token' => $this->subscriber->unsubscribe_token
        ]);
    }

    /**
     * Generate view online URL for the newsletter.
     */
    private function generateViewOnlineUrl(): string
    {
        return route('newsletter.view', [
            'newsletter' => $this->newsletter->slug ?? $this->newsletter->id
        ]);
    }
}