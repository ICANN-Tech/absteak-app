<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Temporary File Uploads
    |--------------------------------------------------------------------------
    |
    | Livewire handles file uploads by storing uploads in a temporary directory
    | before they're stored permanently. All file uploads are directed to a
    | global endpoint for temporary storage. The configuration below
    | allows you to customize how these temporary uploads are handled.
    |
    */

    'temporary_file_upload' => [
        'disk' => 'local',        // Use local disk for temporary uploads
        'rules' => null,          // Global validation rules for temp files
        'directory' => null,      // Directory for temp files (default: livewire-tmp)
        'middleware' => null,     // Middleware for temp upload endpoint
        'preview_mimes' => [      // File types that support preview
            'png', 'gif', 'bmp', 'svg', 'wav', 'mp4',
            'mov', 'avi', 'wmv', 'mp3', 'm4a',
            'jpg', 'jpeg', 'mpga', 'webp', 'wma',
        ],
        'max_upload_time' => 5,   // Max time for upload in minutes
    ],

    /*
    |--------------------------------------------------------------------------
    | Render On Redirect
    |--------------------------------------------------------------------------
    |
    | This value determines if Livewire will run a component's `render()`
    | method after a redirect has been triggered using something like
    | `redirect(...)` or `$this->redirect(...)`. If this is disabled,
    | the render method will only run before the redirect.
    |
    */

    'render_on_redirect' => false,

    /*
    |--------------------------------------------------------------------------
    | Eloquent Model Binding
    |--------------------------------------------------------------------------
    |
    | Previous versions of Livewire supported binding directly to eloquent model
    | properties using wire:model on any property. However, this approach
    | never worked well. This feature is disabled by default, but can
    | be enabled using the configuration option below.
    |
    */

    'legacy_model_binding' => false,

    /*
    |--------------------------------------------------------------------------
    | Auto-inject Frontend Assets
    |--------------------------------------------------------------------------
    |
    | By default, Livewire automatically injects its JavaScript and CSS into the
    | <head> and before the closing </body> tag of pages containing Livewire
    | components. By disabling this, you need to manually include the assets.
    |
    | Livewire will always try to inject the assets in the HTML, unless it can't
    | find a <head> tag or a closing </body> tag in the response.
    |
    */

    'inject_assets' => true,

    /*
    |--------------------------------------------------------------------------
    | Navigate (SPA mode)
    |--------------------------------------------------------------------------
    |
    | By default, Livewire will prevent the default link behavior and instead
    | request those pages via AJAX and replace the current page with the new
    | page's content. This creates an SPA-like experience.
    |
    */

    'navigate' => [
        'show_progress_bar' => true,
        'progress_bar_color' => '#2299dd',
    ],

    /*
    |--------------------------------------------------------------------------
    | HTML Morphing
    |--------------------------------------------------------------------------
    |
    | Livewire uses the Alpine.js Morph plugin to morph the new HTML into
    | the existing DOM. This allows Livewire to update the page without
    | losing browser focus, scroll position, or component state.
    |
    */

    'morph' => [
        'updating' => [],
        'updated' => [],
    ],

];