<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $newsletter->title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #ffffff;
            padding: 30px;
            border: 1px solid #e9ecef;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 8px 8px;
            font-size: 12px;
            color: #6c757d;
        }
        .newsletter-image {
            max-width: 100%;
            height: auto;
            margin: 20px 0;
        }
        .unsubscribe-link {
            color: #6c757d;
            text-decoration: none;
        }
        .unsubscribe-link:hover {
            text-decoration: underline;
        }
        .view-online {
            margin-bottom: 20px;
            text-align: center;
            font-size: 12px;
        }
        .view-online a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="view-online">
        <a href="{{ $viewOnlineUrl }}">View this email in your browser</a>
    </div>

    <div class="header">
        <h1>{{ $newsletter->title }}</h1>
        @if($newsletter->subtitle)
            <p style="margin: 10px 0 0 0; color: #6c757d;">{{ $newsletter->subtitle }}</p>
        @endif
    </div>

    <div class="content">
        @if($newsletter->featured_image)
            <img src="{{ asset('storage/' . $newsletter->featured_image) }}" alt="{{ $newsletter->title }}" class="newsletter-image">
        @endif

        @if($newsletter->excerpt)
            <p style="font-size: 18px; color: #495057; margin-bottom: 20px;">{{ $newsletter->excerpt }}</p>
        @endif

        <div class="newsletter-content">
            {!! $newsletter->content !!}
        </div>

        @if($newsletter->tags && count($newsletter->tags) > 0)
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                <p style="margin-bottom: 10px; font-weight: bold;">Tags:</p>
                @foreach($newsletter->tags as $tag)
                    <span style="background-color: #e9ecef; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 5px;">{{ $tag }}</span>
                @endforeach
            </div>
        @endif
    </div>

    <div class="footer">
        <p>Hello {{ $subscriber->first_name ?? 'Subscriber' }},</p>
        <p>You received this email because you subscribed to our newsletter.</p>
        <p>
            <a href="{{ $unsubscribeUrl }}" class="unsubscribe-link">Unsubscribe</a> |
            <a href="{{ $viewOnlineUrl }}" class="unsubscribe-link">View Online</a>
        </p>
        <p style="margin-top: 20px;">
            © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </p>
    </div>
</body>
</html>