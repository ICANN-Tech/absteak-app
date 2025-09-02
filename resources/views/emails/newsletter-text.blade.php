{{ $newsletter->title }}
@if($newsletter->subtitle)
{{ $newsletter->subtitle }}
@endif

=====================================

Hello {{ $subscriber->first_name ?? 'Subscriber' }},

@if($newsletter->excerpt)
{{ $newsletter->excerpt }}

@endif
{{ strip_tags($newsletter->content) }}

@if($newsletter->tags && count($newsletter->tags) > 0)
Tags: {{ implode(', ', $newsletter->tags) }}

@endif
=====================================

You received this email because you subscribed to our newsletter.

To unsubscribe, visit: {{ $unsubscribeUrl }}
To view this email online, visit: {{ $viewOnlineUrl }}

© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.