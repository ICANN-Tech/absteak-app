<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Repositories\General\ConfigurationRepository;
use Illuminate\Support\Facades\Storage;

class HandleInertiaRequests extends Middleware
{
    /**
     * @var ConfigurationRepository
     */
    protected $repository;

    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * @param ConfigurationRepository $repository
     */
    public function __construct(ConfigurationRepository $repository){
        $this->repository = $repository;
    }

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        try {
            // Use the model directly since repository might have issues
            $configurations = \App\Entities\General\Configuration::where('group', 'guest')->get();
            
            // Transform configurations to key-value pairs for easier access
            $configData = [];
            foreach ($configurations as $config) {
                $configData[$config->key] = [
                    'type' => $config->type,
                    'value' => $config->value // Already cast to array by model
                ];
            }
            
            // Debug log to check if data is being processed
            \Illuminate\Support\Facades\Log::info('Configurations shared to frontend:', $configData);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error loading configurations: ' . $e->getMessage());
            $configData = [];
        }

        return [
            ...parent::share($request),
            'configurations' => $configData,
            'tagline' => [
                'general' => isset($configData['tagline.general']['value'])
                    ? json_decode($configData['tagline.general']['value'], true)
                    : null,
            ],
            'chef' => [
                'general' => isset($configData['chef.general']['value']) 
                    ? json_decode($configData['chef.general']['value'], true)
                    : null,
                'image' => [
                    'type' => $configData['chef.image']['type'],
                    'value' => $configData['chef.image']['value']
                        ? Storage::url($configData['chef.image']['value'])
                        : null,
                ]
            ],
            'highlight' => [
                'general' => isset($configData['highlight.general']['value'])
                    ? json_decode($configData['highlight.general']['value'], true) // decode ke array
                    : null, 
                'preview' => [
                    'thumbnail' => isset($configData['highlight.preview']['value'])
                            ? (function() use ($configData) {
                                $previewData = json_decode($configData['highlight.preview']['value'], true);
                                return isset($previewData['thumbnail']) ? Storage::url($previewData['thumbnail']) : null;
                            })()
                            : null,
                    'video' => isset($configData['highlight.preview']['value'])
                            ? (function() use ($configData) {
                                $previewData = json_decode($configData['highlight.preview']['value'], true);
                                return isset($previewData['url']) ? Storage::url($previewData['url']) : null;
                            })()
                            : null,
                ]
            ],
            'experience' => [
                'general' => isset($configData['experience.general']['value'])
                    ? json_decode($configData['experience.general']['value'], true) // decode ke array
                    : null, 
            ],
            'menu' => [
                'general' => isset($configData['menu.general']['value'])
                    ? json_decode($configData['menu.general']['value'], true) // decode ke array
                    : null, 
            ],
            'contact' => [
                'general' => isset($configData['contact.general']['value'])
                    ? json_decode($configData['contact.general']['value'], true) // decode ke array
                    : null, 
                'info' => isset($configData['contact.info']['value'])
                    ? json_decode($configData['contact.info']['value'], true) // decode ke array
                    : null, 
                'social' => isset($configData['contact.social']['value'])
                    ? json_decode($configData['contact.social']['value'], true) // decode ke array
                    : null, 
            ]
        ];
    }
}
