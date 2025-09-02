<script lang="ts">
	import { CHATBOT_CONFIG, CSS_CLASSES } from '../Const/Chatbot.const';

	// Props
	export let customMenuItems: string[] = [...CHATBOT_CONFIG.DEFAULT_MENU_ITEMS];
	export let activeMenu = 'CS';
	export let loading = false;
	export let disabled = false;
	export let onSelectMenu: (menu: string) => void;

	// Reactive classes
	$: baseClasses = `${CSS_CLASSES.MENU_BUTTON_BASE} ${loading || disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

	// Get button classes for each menu item
	function getButtonClasses(menuItem: string): string {
		const isActive = activeMenu === menuItem;
		return `${baseClasses} ${
			isActive
				? 'bg-primary-500 text-white shadow-md'
				: 'bg-white text-primary-600 border border-primary-200'
		}`;
	}
</script>

{#if customMenuItems.length > 0}
	<div class="bg-primary-50 border-primary-100 border-b px-4 py-3">
		<div class="grid grid-cols-{customMenuItems.length} gap-2">
			{#each customMenuItems as menuItem}
				<button
					class={getButtonClasses(menuItem)}
					on:click={() => onSelectMenu(menuItem)}
					disabled={loading || disabled}
					aria-pressed={activeMenu === menuItem}
				>
					{menuItem}
				</button>
			{/each}
		</div>
	</div>
{/if}

<style>
	/* Enhanced smooth transitions */
	.transition-all {
		transition-property: all;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Menu button hover effects */
	button:hover:not(:disabled) {
		transform: translateY(-1px);
	}

	/* Enhanced focus states */
	button:focus {
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}
</style>