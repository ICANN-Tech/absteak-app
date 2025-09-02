<script lang="ts">
	import { MapPinSolid, PhoneSolid, CheckCircleSolid } from 'flowbite-svelte-icons';

	export interface Branch {
		id: string;
		name: string;
		address: string;
		phone?: string;
		available: boolean;
	}

	interface Props {
		branch: Branch;
		selected?: boolean;
		disabled?: boolean;
		onclick?: ((branch: Branch) => void) | null;
	}

	let {
		branch,
		selected = false,
		disabled = false,
		onclick = null
	}: Props = $props();

	const getBranchClasses = (): string => {
		const baseClasses =
			'relative p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer group w-full text-left';

		if (!branch.available) {
			return `${baseClasses} border-gray-600 bg-gray-800/50 opacity-50 cursor-not-allowed`;
		}

		if (disabled) {
			return `${baseClasses} border-gray-600 bg-gray-800/50 opacity-50 cursor-not-allowed`;
		}

		if (selected) {
			return `${baseClasses} border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20 scale-[1.02]`;
		}

		return `${baseClasses} border-gray-700 bg-white/5 hover:border-orange-400 hover:bg-orange-400/5 hover:scale-[1.01] hover:shadow-lg hover:shadow-orange-400/10`;
	};

	const handleClick = () => {
		if (disabled || !branch.available || !onclick) return;
		onclick(branch);
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleClick();
		}
	};
</script>

<button
	type="button"
	class={getBranchClasses()}
	onclick={handleClick}
	onkeydown={handleKeydown}
	tabindex={disabled || !branch.available ? -1 : 0}
>
	<!-- Selection Indicator -->
	{#if selected}
		<div class="absolute right-3 top-3 sm:right-4 sm:top-4">
			<CheckCircleSolid class="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
		</div>
	{/if}

	<!-- Branch Info -->
	<div class="space-y-3">
		<!-- Branch Name -->
		<h4
			class="text-lg sm:text-xl font-semibold text-white transition-colors group-hover:text-orange-400 pr-8"
		>
			{branch.name}
		</h4>

		<!-- Address -->
		<div class="flex items-start gap-2 sm:gap-3 text-gray-300">
			<MapPinSolid class="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
			<span class="text-xs sm:text-sm leading-relaxed">{branch.address}</span>
		</div>

		<!-- Phone -->
		{#if branch.phone}
			<div class="flex items-center gap-2 sm:gap-3 text-gray-300">
				<PhoneSolid class="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
				<span class="text-xs sm:text-sm">{branch.phone}</span>
			</div>
		{/if}

		<!-- Availability Status -->
		<div class="mt-3 sm:mt-4 flex items-center gap-2">
			<div
				class="h-2 w-2 rounded-full {branch.available ? 'bg-green-500' : 'bg-red-500'}"
			></div>
			<span
				class="text-xs font-medium {branch.available ? 'text-green-400' : 'text-red-400'}"
			>
				{branch.available ? 'Tersedia' : 'Tidak Tersedia'}
			</span>
		</div>
	</div>

	<!-- Hover Effect Overlay -->
	{#if branch.available && !disabled}
		<div
			class="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 to-orange-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
		></div>
	{/if}
</button>