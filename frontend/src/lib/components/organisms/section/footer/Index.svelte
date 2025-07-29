<script lang="ts">
	import { layout } from '$lib/const';
	import AnimateOnScroll from '$lib/components/AnimateOnScroll.svelte';
	import { Input, Button } from '$lib/components/atoms';
	import { createEventDispatcher } from 'svelte';
	import { LogoIcon } from '$lib/components/atoms';
	import { createTranslationStore } from '$lib/utils/translation';

	const t = createTranslationStore('footer');

	// Props untuk kustomisasi konten dengan fallback dari translasi
	export let restaurantName: string = 'AB STEAK';
	export let tagline: string = '';
	export let description: string = '';
	
	// Props untuk kontak dengan fallback dari translasi
	export let address: string = '';
	export let phone: string = '';
	export let email: string = '';
	
	// Props untuk social media
	export let socialLinks = {
		instagram: 'https://instagram.com/absteak',
		facebook: 'https://facebook.com/absteak',
		twitter: 'https://twitter.com/absteak',
		youtube: 'https://youtube.com/absteak'
	};

	// Props untuk newsletter dengan fallback dari translasi
	export let newsletterTitle: string = '';
	export let newsletterDescription: string = '';

	// Props untuk map dengan fallback dari translasi
	export let mapTitle: string = '';
	export let mapDescription: string = '';
	export let latitude: number = -6.2088;
	export let longitude: number = 106.8456;

	// Reactive statements untuk menggunakan translasi dengan fallback
	$: finalTagline = tagline || $t('tagline') || 'Experience Culinary Excellence';
	$: finalDescription = description || $t('description') || 'Join us for an unforgettable dining experience where passion meets perfection. From our signature steaks to innovative culinary creations, every dish tells a story.';
	$: finalAddress = address || $t('address') || 'Senayan City Mall, Jakarta';
	$: finalPhone = phone || $t('phone') || '+62 21 5555 0123';
	$: finalEmail = email || $t('email') || 'info@absteak.com';
	$: finalNewsletterTitle = newsletterTitle || $t('newsletterTitle') || 'Stay Updated';
	$: finalNewsletterDescription = newsletterDescription || $t('newsletterDescription') || 'Subscribe to our newsletter for exclusive offers, new menu updates, and special events.';
	$: finalMapTitle = mapTitle || $t('mapTitle') || 'Find Us';
	$: finalMapDescription = mapDescription || $t('mapDescription') || 'Located in the heart of Jakarta, we\'re easily accessible and ready to serve you.';

	// Newsletter state
	let email_subscription = '';
	let isSubscribing = false;
	let subscriptionSuccess = false;
	let subscriptionError = '';

	const dispatch = createEventDispatcher();

	// Handle newsletter subscription
	async function handleNewsletterSubmit(event: Event) {
		event.preventDefault();
		
		if (!email_subscription) {
			subscriptionError = $t('emailRequired') || 'Please enter your email address';
			return;
		}

		isSubscribing = true;
		subscriptionError = '';

		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1500));
			
			subscriptionSuccess = true;
			email_subscription = '';
			
			dispatch('newsletter-subscribed', {
				email: email_subscription
			});

			// Reset success message after 3 seconds
			setTimeout(() => {
				subscriptionSuccess = false;
			}, 3000);
		} catch (error) {
			subscriptionError = $t('subscriptionError') || 'Failed to subscribe. Please try again.';
		} finally {
			isSubscribing = false;
		}
	}

	// Current year for copyright
	const currentYear = new Date().getFullYear();
</script>

<AnimateOnScroll animation="fade" y={20} duration={800}>
	<footer class="relative w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">
		<!-- Background decorative elements -->
		<div class="absolute inset-0">
			<div class="absolute top-0 left-0 h-96 w-96 rounded-full bg-gradient-to-br from-amber-400/10 to-orange-400/10 blur-3xl"></div>
			<div class="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-gradient-to-tl from-orange-400/10 to-amber-400/10 blur-3xl"></div>
		</div>

		<!-- Map Section -->
		<div class="relative z-10 border-b border-gray-700/50 {layout.padding.base} {layout.padding.md} {layout.padding.lg} {layout.padding.xl} py-8 md:py-10">
			<div class="mx-auto {layout.maxWidth.content}">
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					<!-- Map Info -->
					<div class="space-y-6">
						<div>
							<h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
								{finalMapTitle}
							</h2>
							<p class="text-gray-300 text-lg leading-relaxed mb-6">
								{finalMapDescription}
							</p>
						</div>

						<!-- Location Details -->
						<div class="space-y-4">
							<div class="flex items-start space-x-4">
								<div class="w-6 h-6 text-amber-400 mt-1 flex-shrink-0">
									<svg fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
									</svg>
								</div>
								<div>
									<h3 class="text-white font-semibold mb-1">{$t('addressLabel') || 'Address'}</h3>
									<p class="text-gray-300">{finalAddress}</p>
								</div>
							</div>

							<div class="flex items-start space-x-4">
								<div class="w-6 h-6 text-amber-400 mt-1 flex-shrink-0">
									<svg fill="currentColor" viewBox="0 0 20 20">
										<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
									</svg>
								</div>
								<div>
									<h3 class="text-white font-semibold mb-1">{$t('reservationsLabel') || 'Reservations'}</h3>
									<p class="text-gray-300">{finalPhone}</p>
									<p class="text-amber-400 text-sm mt-1">{$t('callForReservations') || 'Call for reservations'}</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Interactive Map -->
					<div class="relative">
						<div class="bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
							<!-- Map placeholder with interactive elements -->
							<div class="relative h-72 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
								<!-- Map background pattern -->
								<div class="absolute inset-0 opacity-20">
									<svg class="w-full h-full" viewBox="0 0 400 320" fill="none">
										<!-- Grid pattern -->
										<defs>
											<pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
												<path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" stroke-width="0.5"/>
											</pattern>
										</defs>
										<rect width="100%" height="100%" fill="url(#grid)" />
										
										<!-- Street lines -->
										<path d="M0 100 L400 120" stroke="currentColor" stroke-width="2" opacity="0.6"/>
										<path d="M0 200 L400 180" stroke="currentColor" stroke-width="2" opacity="0.6"/>
										<path d="M100 0 L120 320" stroke="currentColor" stroke-width="2" opacity="0.6"/>
										<path d="M300 0 L280 320" stroke="currentColor" stroke-width="2" opacity="0.6"/>
									</svg>
								</div>

								<!-- Restaurant marker -->
								<div class="relative z-10 flex flex-col items-center">
									<div class="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
										<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
										</svg>
									</div>
									<div class="mt-2 bg-black/80 px-3 py-1 rounded-lg">
										<p class="text-white text-sm font-semibold">{restaurantName}</p>
									</div>
								</div>

								<!-- Nearby landmarks -->
								<div class="absolute top-4 left-4 w-3 h-3 bg-blue-400 rounded-full opacity-60"></div>
								<div class="absolute top-12 right-8 w-3 h-3 bg-green-400 rounded-full opacity-60"></div>
								<div class="absolute bottom-8 left-12 w-3 h-3 bg-purple-400 rounded-full opacity-60"></div>
								<div class="absolute bottom-4 right-4 w-3 h-3 bg-red-400 rounded-full opacity-60"></div>
							</div>

							<!-- Map controls -->
							<div class="p-4 bg-gray-800/80 border-t border-gray-700/50">
								<div class="flex justify-between items-center">
									<div class="text-sm text-gray-300">
										<span class="text-amber-400">📍</span> {finalAddress}
									</div>
									<div class="flex space-x-2">
										<button class="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-sm rounded-lg transition-colors duration-300">
											{$t('getDirections') || 'Get Directions'}
										</button>
										<button class="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors duration-300">
											{$t('viewLarger') || 'View Larger'}
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="relative z-10 {layout.padding.base} {layout.padding.md} {layout.padding.lg} {layout.padding.xl} py-8 md:py-10">
			<div class="mx-auto {layout.maxWidth.content}">
				<!-- Main Footer Content -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">
					<!-- Restaurant Info -->
					<div class="lg:col-span-2 space-y-6">
						<div>
							<LogoIcon size="lg" />
							<p class="text-amber-400 text-lg font-semibold mb-4">
								{finalTagline}
							</p>
							<p class="text-gray-300 text-base leading-relaxed">
								{finalDescription}
							</p>
						</div>

						<!-- Contact Info -->
						<div class="space-y-3">
							<div class="flex items-center space-x-3">
								<div class="w-5 h-5 text-amber-400">
									<svg fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
									</svg>
								</div>
								<span class="text-gray-300">{finalAddress}</span>
							</div>
							<div class="flex items-center space-x-3">
								<div class="w-5 h-5 text-amber-400">
									<svg fill="currentColor" viewBox="0 0 20 20">
										<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
									</svg>
								</div>
								<span class="text-gray-300">{finalPhone}</span>
							</div>
							<div class="flex items-center space-x-3">
								<div class="w-5 h-5 text-amber-400">
									<svg fill="currentColor" viewBox="0 0 20 20">
										<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
										<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
									</svg>
								</div>
								<span class="text-gray-300">{finalEmail}</span>
							</div>
						</div>
					</div>

					<!-- Quick Links -->
					<div class="space-y-4">
							<h3 class="text-xl font-bold text-white">{$t('quickLinks') || 'Quick Links'}</h3>
							<div class="space-y-2">
								<a href="#hero" class="block text-gray-300 hover:text-amber-400 transition-colors duration-300">{$t('home') || 'Home'}</a>
								<a href="#video-highlight" class="block text-gray-300 hover:text-amber-400 transition-colors duration-300">{$t('about') || 'About'}</a>
								<a href="#experience" class="block text-gray-300 hover:text-amber-400 transition-colors duration-300">{$t('experience') || 'Experience'}</a>
								<a href="#chef" class="block text-gray-300 hover:text-amber-400 transition-colors duration-300">{$t('ourChef') || 'Our Chef'}</a>
								<a href="#menu" class="block text-gray-300 hover:text-amber-400 transition-colors duration-300">{$t('menu') || 'Menu'}</a>
								<a href="#booking" class="block text-gray-300 hover:text-amber-400 transition-colors duration-300">{$t('reservations') || 'Reservations'}</a>
							</div>
						</div>

					<!-- Newsletter Subscription -->
					<div class="space-y-6">
						<div>
							<h3 class="text-xl font-bold text-white mb-2">{finalNewsletterTitle}</h3>
							<p class="text-gray-300 text-sm leading-relaxed">
								{finalNewsletterDescription}
							</p>
						</div>

						<form on:submit={handleNewsletterSubmit} class="space-y-4">
							<Input
								type="email"
								placeholder={$t('enterEmail') || 'Enter your email'}
								bind:value={email_subscription}
								variant="elegant"
								size="md"
								required
								disabled={isSubscribing}
								error={subscriptionError}
								success={subscriptionSuccess ? ($t('subscriptionSuccess') || 'Successfully subscribed!') : ''}
								class="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-amber-400"
							/>
							
							<Button
								type="submit"
								variant="primary"
								size="md"
								disabled={isSubscribing || !email_subscription}
								className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-0 font-semibold transition-all duration-300 hover:scale-105"
							>
								{isSubscribing ? ($t('subscribing') || 'Subscribing...') : ($t('subscribe') || 'Subscribe')}
							</Button>
						</form>

						<!-- Social Media Links -->
						<div class="space-y-4">
							<h4 class="text-lg font-semibold text-white">{$t('followUs') || 'Follow Us'}</h4>
							<div class="flex space-x-4">
								<a 
									href={socialLinks.instagram} 
									target="_blank" 
									rel="noopener noreferrer"
									class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-110"
								>
									<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
										<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
									</svg>
								</a>
								<a 
									href={socialLinks.facebook} 
									target="_blank" 
									rel="noopener noreferrer"
									class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-blue-600 transition-all duration-300 hover:scale-110"
								>
									<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
										<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
									</svg>
								</a>
								<a 
									href={socialLinks.twitter} 
									target="_blank" 
									rel="noopener noreferrer"
									class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-blue-400 transition-all duration-300 hover:scale-110"
								>
									<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
										<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
									</svg>
								</a>
								<a 
									href={socialLinks.youtube} 
									target="_blank" 
									rel="noopener noreferrer"
									class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-red-600 transition-all duration-300 hover:scale-110"
								>
									<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
										<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
									</svg>
								</a>
							</div>
						</div>
					</div>
				</div>

				<!-- Bottom Footer -->
				<div class="border-t h-full border-gray-700 pt-8">
					<div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
						<div class="text-gray-400 text-sm">
							{$t('copyright', { year: currentYear, name: restaurantName }) || `© ${currentYear} ${restaurantName}. All rights reserved.`}
						</div>
						<div class="flex space-x-6 text-sm">
							<a href="/privacy" class="text-gray-400 hover:text-amber-400 transition-colors duration-300">{$t('privacyPolicy') || 'Privacy Policy'}</a>
							<a href="/terms" class="text-gray-400 hover:text-amber-400 transition-colors duration-300">{$t('termsOfService') || 'Terms of Service'}</a>
							<a href="/contact" class="text-gray-400 hover:text-amber-400 transition-colors duration-300">{$t('contact') || 'Contact'}</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</footer>
</AnimateOnScroll>

<style>
	/* Custom scrollbar for any scrollable content */
	:global(.footer-scrollable::-webkit-scrollbar) {
		width: 4px;
	}

	:global(.footer-scrollable::-webkit-scrollbar-track) {
		background: rgba(0, 0, 0, 0.1);
	}

	:global(.footer-scrollable::-webkit-scrollbar-thumb) {
		background: rgba(245, 158, 11, 0.5);
		border-radius: 2px;
	}

	:global(.footer-scrollable::-webkit-scrollbar-thumb:hover) {
		background: rgba(245, 158, 11, 0.7);
	}
</style>