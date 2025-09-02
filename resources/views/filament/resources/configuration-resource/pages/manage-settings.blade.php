<x-filament-panels::page>
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Groups Sidebar -->
        <div class="lg:col-span-1">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Settings Groups</h3>
                <nav class="space-y-2">
                    @foreach($this->getGroups() as $group)
                        <button
                            wire:click="selectGroup('{{ $group['key'] }}')"
                            class="w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 {{ $selectedGroup === $group['key'] ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700' }}"
                        >
                            <div class="flex items-center justify-between">
                                <span>{{ $group['label'] }}</span>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                    {{ $group['count'] }}
                                </span>
                            </div>
                        </button>
                    @endforeach
                </nav>
            </div>
        </div>

        <!-- Settings Form -->
        <div class="lg:col-span-3">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
                {{ $this->form }}
            </div>
        </div>
    </div>
</x-filament-panels::page>