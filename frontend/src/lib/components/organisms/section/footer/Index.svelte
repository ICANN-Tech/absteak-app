<script lang="ts">
	import { CONTAINER_SECTION } from '$lib/const';
	import AnimateOnScroll from '$lib/components/AnimateOnScroll.svelte';
	import { Input, Button } from '$lib/components/atoms';
	import { createEventDispatcher } from 'svelte';
	import { LogoIcon } from '$lib/components/atoms';
	import { createTranslationStore } from '$lib/utils/translation';
	import { MapLocation } from '../../location';
	import { BottomBar, QuickLink, SocialMediaContact } from '$lib/components/molecules';

	const t = createTranslationStore('footer');

	// Props untuk kustomisasi konten dengan fallback dari translasi
	export let restaurantName: string = 'AB STEAK';
	export let tagline: string = '';
	export let description: string = '';
	
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

	// Reactive statements untuk menggunakan translasi dengan fallback
	$: tagline = tagline || $t('tagline') || 'Experience Culinary Excellence';
	$: description = description || $t('description') || 'Join us for an unforgettable dining experience where passion meets perfection. From our signature steaks to innovative culinary creations, every dish tells a story.';
	$: newsletterTitle = newsletterTitle || $t('newsletterTitle') || 'Stay Updated';
	$: newsletterDescription = newsletterDescription || $t('newsletterDescription') || 'Subscribe to our newsletter for exclusive offers, new menu updates, and special events.';

	// Newsletter state
	let email_subscription = '';
	let isSubscribing = false;
	let subscriptionSuccess = false;
	let subscriptionError = '';

	const dispatch = createEventDispatcher<{
		'newsletter-subscribed': { email: string };
	}>();

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
			const emailToDispatch = email_subscription;
			email_subscription = '';
			
			dispatch('newsletter-subscribed', {
				email: emailToDispatch
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
</script>

<AnimateOnScroll animation="fade" y={20} duration={800}>
	<footer class={CONTAINER_SECTION.footer.base}>
		<!-- Background decorative elements -->
		<div class={CONTAINER_SECTION.footer.background.base}>
			<div class={CONTAINER_SECTION.footer.background.first}></div>
			<div class={CONTAINER_SECTION.footer.background.second}></div>
		</div>

		<!-- Map Section -->
		<div class={CONTAINER_SECTION.footer.map.section}>
			<MapLocation />
		</div>

		<div class={CONTAINER_SECTION.footer.main.section}>
			<div class={CONTAINER_SECTION.footer.main.container}>
				<!-- Main Footer Content -->
				<div class={CONTAINER_SECTION.footer.main.grid}>
					<!-- Restaurant Info -->
					<div class={CONTAINER_SECTION.footer.main.info.base}>
						<div>
							<LogoIcon size="lg" />

							<p class={CONTAINER_SECTION.footer.main.info.tagline}>
								{tagline}
							</p>
							<p class={CONTAINER_SECTION.footer.main.info.description}>
								{description}
							</p>
						</div>
					</div>

					<!-- Quick Links -->
					<QuickLink />

					<!-- Newsletter Subscription -->
					<div class={CONTAINER_SECTION.footer.main.newsletter.base}>
						<div>
							<h3 class={CONTAINER_SECTION.footer.main.newsletter.title}>{newsletterTitle}</h3>
							<p class={CONTAINER_SECTION.footer.main.newsletter.description}>
								{newsletterDescription}
							</p>
						</div>

						<form on:submit={handleNewsletterSubmit} class={CONTAINER_SECTION.footer.main.newsletter.form}>
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
								class={CONTAINER_SECTION.footer.main.newsletter.input}
							/>
							
							<Button
								type="submit"
								variant="primary"
								size="md"
								disabled={isSubscribing || !email_subscription}
								className={CONTAINER_SECTION.footer.main.newsletter.button}
							>
								{isSubscribing ? ($t('subscribing') || 'Subscribing...') : ($t('subscribe') || 'Subscribe')}
							</Button>
						</form>

						<!-- Social Media Links -->
						<div class={CONTAINER_SECTION.footer.main.newsletter.social}>
							<SocialMediaContact platform="facebook" url={socialLinks.facebook} />
							<SocialMediaContact platform="twitter" url={socialLinks.twitter} />
							<SocialMediaContact platform="instagram" url={socialLinks.instagram} />
							<SocialMediaContact platform="youtube" url={socialLinks.youtube} />
						</div>
					</div>
				</div>

				<!-- Bottom Footer -->
				<BottomBar />
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