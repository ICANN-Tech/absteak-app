<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Scroll Lock Test - {{ config('app.name', 'Laravel') }}</title>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap" rel="stylesheet">

    @vite(['resources/css/app.css', 'resources/css/styles/global.scss', 'resources/js/app.js'])
</head>
<body class="antialiased">
    <div id="scroll-lock-test-app"></div>
    
    <script type="module">
        import ScrollLockTest from '@Components/Test/ScrollLockTest.svelte';
        
        new ScrollLockTest({
            target: document.getElementById('scroll-lock-test-app')
        });
    </script>
</body>
</html>