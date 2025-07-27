<script lang="ts">
	import { UI_CONTAINER, UI_VARIANTS, UI_TRANSITIONS } from '$lib/const/ui/base';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		variant?: 'default' | 'elegant' | 'minimal' | 'liquid';
		size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
		padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
		shadow?: boolean;
		rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
		border?: boolean;
		backdrop?: boolean;
		class?: string;
	}

	let {
		children,
		variant = 'liquid',
		size = 'md',
		padding = 'lg',
		shadow = true,
		rounded = '2xl',
		border = true,
		backdrop = true,
		class: className = ''
	}: Props = $props();

	// Size configurations
	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		full: 'w-full'
	};

	// Padding configurations
	const paddingClasses = {
		none: 'p-0',
		sm: 'p-4',
		md: 'p-6',
		lg: 'p-8',
		xl: 'p-10'
	};

	// Rounded configurations
	const roundedClasses = {
		none: 'rounded-none',
		sm: 'rounded-sm',
		md: 'rounded-md',
		lg: 'rounded-lg',
		xl: 'rounded-xl',
		'2xl': 'rounded-2xl',
		full: 'rounded-full'
	};

	// Build container classes
	const containerClasses = $derived([
		// Base container styles
		'relative overflow-hidden',
		roundedClasses[rounded],
		paddingClasses[padding],
		sizeClasses[size],
		
		// Variant-specific styles
		variant === 'elegant' && 'bg-black/10',
		variant === 'default' && 'bg-white',
		variant === 'minimal' && 'bg-primary-700/20',
		variant === 'liquid' && 'bg-white/[0.08]',
		
		// Backdrop blur - enhanced for liquid variant
		backdrop && variant === 'liquid' && 'backdrop-blur-xl backdrop-saturate-150',
		backdrop && variant !== 'liquid' && 'backdrop-blur-md',
		
		// Border - enhanced for liquid variant
		border && variant === 'elegant' && 'border border-white/20',
		border && variant === 'default' && 'border border-gray-300',
		border && variant === 'minimal' && 'border border-primary-600',
		border && variant === 'liquid' && 'border border-white/[0.15]',
		
		// Shadow - enhanced for liquid variant
		shadow && variant === 'liquid' && 'shadow-2xl shadow-black/10',
		shadow && variant !== 'liquid' && 'shadow-2xl',
		
		// Transitions - enhanced for liquid variant
		variant === 'liquid' && 'transition-all duration-500 ease-out hover:bg-white/[0.12] hover:border-white/[0.25] hover:shadow-3xl hover:shadow-black/20',
		variant !== 'liquid' && UI_TRANSITIONS.base,
		
		// Custom classes
		className
	].filter(Boolean).join(' '));
</script>

<div class={containerClasses}>
	{#if variant === 'liquid'}
		<!-- Liquid background with animated gradient orbs -->
		<div class="absolute inset-0 -z-10">
			<!-- Primary gradient orb -->
			<div class="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/30 via-purple-400/20 to-pink-400/30 rounded-full blur-xl animate-pulse" 
				 style="animation-duration: 4s; animation-delay: 0s;"></div>
			
			<!-- Secondary gradient orb -->
			<div class="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-cyan-400/25 via-blue-400/15 to-indigo-400/25 rounded-full blur-lg animate-pulse" 
				 style="animation-duration: 6s; animation-delay: 2s;"></div>
			
			<!-- Tertiary gradient orb -->
			<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-violet-400/20 via-fuchsia-400/15 to-pink-400/20 rounded-full blur-md animate-pulse" 
				 style="animation-duration: 8s; animation-delay: 4s;"></div>
			
			<!-- Floating particles -->
			<div class="absolute top-1/4 right-1/4 w-2 h-2 bg-white/40 rounded-full animate-bounce" 
				 style="animation-duration: 3s; animation-delay: 1s;"></div>
			<div class="absolute bottom-1/4 left-1/4 w-1 h-1 bg-blue-300/50 rounded-full animate-bounce" 
				 style="animation-duration: 4s; animation-delay: 2.5s;"></div>
		</div>
		
		<!-- Subtle inner glow -->
		<div class="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] pointer-events-none"></div>
	{/if}
	
	<!-- Content -->
	<div class="relative z-10">
		{@render children()}
	</div>
</div>

<style>
	@keyframes liquid-float {
		0%, 100% { transform: translateY(0px) rotate(0deg); }
		33% { transform: translateY(-10px) rotate(1deg); }
		66% { transform: translateY(5px) rotate(-1deg); }
	}
	
	@keyframes liquid-pulse {
		0%, 100% { opacity: 0.3; transform: scale(1); }
		50% { opacity: 0.6; transform: scale(1.1); }
	}
	
	/* Enhanced liquid animations */
	.liquid-orb-1 {
		animation: liquid-float 8s ease-in-out infinite, liquid-pulse 4s ease-in-out infinite;
	}
	
	.liquid-orb-2 {
		animation: liquid-float 10s ease-in-out infinite reverse, liquid-pulse 6s ease-in-out infinite 2s;
	}
	
	.liquid-orb-3 {
		animation: liquid-float 12s ease-in-out infinite, liquid-pulse 8s ease-in-out infinite 4s;
	}
</style>