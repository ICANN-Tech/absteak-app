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
		scrollable?: boolean;
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
		scrollable = false,
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
		'relative',
		scrollable ? 'overflow-y-auto' : 'overflow-hidden',
		roundedClasses[rounded],
		paddingClasses[padding],
		sizeClasses[size],
		
		// Scrollable styles
		scrollable && 'enhanced-scrollbar',
		scrollable && variant === 'elegant' && 'elegant-variant',
		
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

	/* Glass effect animations for scrollbar */
	@keyframes scrollbar-glow {
		0%, 100% { 
			box-shadow: 
				0 2px 8px rgba(0, 0, 0, 0.05),
				inset 0 1px 0 rgba(255, 255, 255, 0.25),
				0 0 20px rgba(255, 255, 255, 0.08);
		}
		50% { 
			box-shadow: 
				0 4px 16px rgba(0, 0, 0, 0.08),
				inset 0 1px 0 rgba(255, 255, 255, 0.35),
				0 0 30px rgba(255, 255, 255, 0.12);
		}
	}

	@keyframes scrollbar-shimmer {
		0% { background-position: -200% 0; }
		100% { background-position: 200% 0; }
	}

	@keyframes scrollbar-pulse {
		0%, 100% { opacity: 0.8; transform: scale(1); }
		50% { opacity: 1; transform: scale(1.02); }
	}

	/* Enhanced scrollbar styles with transparent white glass effect */
	:global(.enhanced-scrollbar) {
		scrollbar-width: thin;
		scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
		scroll-behavior: smooth;
		position: relative;
	}

	:global(.enhanced-scrollbar::-webkit-scrollbar) {
		width: 10px;
		background: transparent;
	}

	:global(.enhanced-scrollbar::-webkit-scrollbar-track) {
		background: linear-gradient(135deg, 
			rgba(255, 255, 255, 0.03), 
			rgba(255, 255, 255, 0.01)
		);
		border-radius: 6px;
		border: 1px solid rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(4px);
		position: relative;
		overflow: hidden;
		margin: 8px 0;
	}

	:global(.enhanced-scrollbar::-webkit-scrollbar-track::before) {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, 
			transparent, 
			rgba(255, 255, 255, 0.08), 
			transparent
		);
		animation: scrollbar-shimmer 3s infinite;
	}

	:global(.enhanced-scrollbar::-webkit-scrollbar-thumb) {
		background: linear-gradient(135deg, 
			rgba(255, 255, 255, 0.12), 
			rgba(255, 255, 255, 0.20),
			rgba(255, 255, 255, 0.08)
		);
		background-size: 200% 200%;
		border-radius: 6px;
		border: 1px solid rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(12px) saturate(150%);
		box-shadow: 
			0 2px 8px rgba(0, 0, 0, 0.05),
			inset 0 1px 0 rgba(255, 255, 255, 0.25),
			inset 0 -1px 0 rgba(255, 255, 255, 0.12),
			0 0 20px rgba(255, 255, 255, 0.08);
		animation: scrollbar-glow 4s ease-in-out infinite, scrollbar-pulse 2s ease-in-out infinite;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
	}

	:global(.enhanced-scrollbar::-webkit-scrollbar-thumb::before) {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, 
			transparent, 
			rgba(255, 255, 255, 0.18), 
			transparent
		);
		animation: scrollbar-shimmer 2s infinite;
	}

	:global(.enhanced-scrollbar::-webkit-scrollbar-thumb:hover) {
		background: linear-gradient(135deg, 
			rgba(255, 255, 255, 0.18), 
			rgba(255, 255, 255, 0.28),
			rgba(255, 255, 255, 0.15)
		);
		border-color: rgba(255, 255, 255, 0.22);
		backdrop-filter: blur(16px) saturate(180%);
		box-shadow: 
			0 4px 16px rgba(0, 0, 0, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.35),
			inset 0 -1px 0 rgba(255, 255, 255, 0.18),
			0 0 30px rgba(255, 255, 255, 0.12),
			0 0 60px rgba(255, 255, 255, 0.06);
		transform: scale(1.05);
		animation-duration: 2s;
	}

	:global(.enhanced-scrollbar::-webkit-scrollbar-thumb:active) {
		background: linear-gradient(135deg, 
			rgba(255, 255, 255, 0.25), 
			rgba(255, 255, 255, 0.35),
			rgba(255, 255, 255, 0.20)
		);
		border-color: rgba(255, 255, 255, 0.28);
		backdrop-filter: blur(20px) saturate(200%);
		box-shadow: 
			0 6px 20px rgba(0, 0, 0, 0.12),
			inset 0 1px 0 rgba(255, 255, 255, 0.45),
			inset 0 -1px 0 rgba(255, 255, 255, 0.25),
			0 0 40px rgba(255, 255, 255, 0.18);
		transform: scale(1.02);
	}

	/* Focus styles for accessibility with transparent white glass effect */
	:global(.enhanced-scrollbar:focus) {
		outline: 2px solid rgba(255, 255, 255, 0.25);
		outline-offset: 2px;
		box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.08);
	}

	/* Elegant variant with transparent white glass effect */
	:global(.enhanced-scrollbar.elegant-variant) {
		scrollbar-color: rgba(255, 255, 255, 0.18) transparent;
	}

	:global(.enhanced-scrollbar.elegant-variant::-webkit-scrollbar-track) {
		background: linear-gradient(135deg, 
			rgba(255, 255, 255, 0.04), 
			rgba(255, 255, 255, 0.02)
		);
		border-color: rgba(255, 255, 255, 0.08);
		margin: 8px 0;
	}

	:global(.enhanced-scrollbar.elegant-variant::-webkit-scrollbar-thumb) {
		background: linear-gradient(135deg, 
			rgba(255, 255, 255, 0.15), 
			rgba(255, 255, 255, 0.25),
			rgba(255, 255, 255, 0.12)
		);
		border-color: rgba(255, 255, 255, 0.18);
		box-shadow: 
			0 2px 8px rgba(0, 0, 0, 0.06),
			inset 0 1px 0 rgba(255, 255, 255, 0.30),
			inset 0 -1px 0 rgba(255, 255, 255, 0.15),
			0 0 20px rgba(255, 255, 255, 0.10);
	}

	:global(.enhanced-scrollbar.elegant-variant::-webkit-scrollbar-thumb:hover) {
		background: linear-gradient(135deg, 
			rgba(255, 255, 255, 0.22), 
			rgba(255, 255, 255, 0.32),
			rgba(255, 255, 255, 0.18)
		);
		border-color: rgba(255, 255, 255, 0.25);
		box-shadow: 
			0 4px 16px rgba(0, 0, 0, 0.10),
			inset 0 1px 0 rgba(255, 255, 255, 0.40),
			inset 0 -1px 0 rgba(255, 255, 255, 0.22),
			0 0 30px rgba(255, 255, 255, 0.15),
			0 0 60px rgba(255, 255, 255, 0.08);
	}

	:global(.enhanced-scrollbar.elegant-variant::-webkit-scrollbar-thumb:active) {
		background: linear-gradient(135deg, 
			rgba(255, 255, 255, 0.28), 
			rgba(255, 255, 255, 0.38),
			rgba(255, 255, 255, 0.25)
		);
		border-color: rgba(255, 255, 255, 0.32);
		box-shadow: 
			0 6px 20px rgba(0, 0, 0, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.50),
			inset 0 -1px 0 rgba(255, 255, 255, 0.28),
			0 0 40px rgba(255, 255, 255, 0.20);
	}
</style>