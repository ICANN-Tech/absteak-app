<script lang="ts">
import { Button } from "$lib/components/atoms";
import { PlayOutline } from "flowbite-svelte-icons";

// Props untuk customization
export let size: 'sm' | 'md' | 'lg' | 'xl' = 'lg';
export let color: 'primary' | 'secondary' | 'red' | 'blue' | 'green' = 'primary';
export let overlayOpacity: string = 'bg-black/20';
export let hoverOverlayOpacity: string = 'bg-black/30';
export let buttonClass: string = '';
export let overlayClass: string = '';
export let ariaLabel: string = 'Play video';
export let showOverlay: boolean = true;
export let showPingAnimation: boolean = true;
export let pingDelay1: number = 0; // delay untuk ping pertama (dalam detik)
export let pingDelay2: number = 1; // delay untuk ping kedua (dalam detik)
export let pingOpacity: number = 0.6; // opacity untuk ping animation

// Size mappings
const sizeClasses = {
	sm: 'h-10 w-10',
	md: 'h-12 w-12', 
	lg: 'h-16 w-16',
	xl: 'h-20 w-20'
};

// Ping size mappings (sedikit lebih besar dari button untuk efek lingkaran)
const pingSizeClasses = {
	sm: 'h-14 w-14',
	md: 'h-16 w-16', 
	lg: 'h-20 w-20',
	xl: 'h-28 w-28'
};

// Color mappings untuk background dan hover
const colorClasses = {
	primary: 'bg-primary-600 hover:bg-primary-700',
	secondary: 'bg-secondary-600 hover:bg-secondary-700',
	red: 'bg-red-600 hover:bg-red-700',
	blue: 'bg-blue-600 hover:bg-blue-700',
	green: 'bg-green-600 hover:bg-green-700'
};

// Ping color mappings (lebih terang untuk efek yang lebih terlihat)
const pingColorClasses = {
	primary: 'bg-primary-500',
	secondary: 'bg-secondary-500',
	red: 'bg-red-500',
	blue: 'bg-blue-500',
	green: 'bg-green-500'
};

// Dynamic classes
$: buttonSizeClass = sizeClasses[size];
$: pingSizeClass = pingSizeClasses[size];
$: buttonColorClass = colorClasses[color];
$: pingColorClass = pingColorClasses[color];
$: overlayClasses = showOverlay 
	? `absolute inset-0 flex items-center justify-center ${overlayOpacity} transition-all duration-300 group-hover:${hoverOverlayOpacity} ${overlayClass}`
	: 'flex items-center justify-center';
$: buttonClasses = `${buttonSizeClass} ${buttonColorClass} transform cursor-pointer border-0 shadow-lg transition-all duration-300 hover:scale-110 relative z-10 ${buttonClass}`;
</script>

<div class={overlayClasses}>
	<div class="relative flex items-center justify-center">
		<!-- Ping animation rings - lingkaran yang terus menerus -->
		{#if showPingAnimation}
			<span 
				class={`absolute ${pingSizeClass} ${pingColorClass} rounded-full animate-ping`} 
				style="animation-delay: {pingDelay1}s; opacity: {pingOpacity}; animation-duration: 2s;"
			></span>
			<span 
				class={`absolute ${pingSizeClass} ${pingColorClass} rounded-full animate-ping`} 
				style="animation-delay: {pingDelay2}s; opacity: {pingOpacity}; animation-duration: 2s;"
			></span>
		{/if}
		
		<!-- Main button -->
		<Button
			{color}
			pill
			class={buttonClasses}
			aria-label={ariaLabel}
			on:click
		>
			<PlayOutline />
		</Button>
	</div>
</div>
