<script context="module" lang="ts">
	import SocialMedia from './SocialMedia.svelte';

</script>

<script lang="ts">
	import { Button, Input, SocialMediaContact, Toast } from '$lib/components';
	import { CONTAINER_SECTION } from '$lib/const';
	import { createTranslationStore } from '$lib/utils/translation';
	import { NewsletterService } from '../../services/newsletter.service';
	import { newsletterStore } from '../../stores/newsletter';

	const t = createTranslationStore('footer');


	// Email binding menggunakan service
	let emailInput = NewsletterService.getEmailValue(newsletterStore);

	// Sinkronisasi email menggunakan service
	$: emailInput = NewsletterService.getEmailValue(newsletterStore);
	$: NewsletterService.setEmailValue(newsletterStore, emailInput);

	// Reactive state for toast
	$: showToast = $newsletterStore.success;
	$: toastMessage = $newsletterStore.success ? 'Successfully subscribed to our newsletter!' : '';

	// Handle toast close menggunakan service
	const handleToastClose = () => NewsletterService.clearSuccess(newsletterStore);
</script>

<div class={CONTAINER_SECTION.footer.main.newsletter.base}>
	<div>
		<h3 class={CONTAINER_SECTION.footer.main.newsletter.title}>{$t('newsletter.title')}</h3>
		<p class={CONTAINER_SECTION.footer.main.newsletter.description}>
			{$t('newsletter.description')}
		</p>
	</div>

	<form
		on:submit={(e) => NewsletterService.handleSubmit(e, newsletterStore)}
		class={CONTAINER_SECTION.footer.main.newsletter.form}
	>
		<Input
			type="email"
			placeholder={$t('newsletter.forms.email.placeholder') || 'Enter your email'}
			bind:value={emailInput}
			variant="elegant"
			size="md"
			required
			disabled={$newsletterStore.isSubscribing}
			error={$newsletterStore.error || undefined}
			class={CONTAINER_SECTION.footer.main.newsletter.input}
		/>

		<Button
			type="submit"
			variant="primary"
			size="md"
			disabled={$newsletterStore.isSubscribing || !$newsletterStore.isFormValid}
			className={CONTAINER_SECTION.footer.main.newsletter.button}
		>
			{$newsletterStore.isSubscribing
				? $t('newsletter.forms.submit.loadingLabel') || 'Subscribing...'
				: $t('newsletter.forms.submit.label') || 'Subscribe'}
		</Button>
	</form>

	<!-- Social Media Links -->
	<SocialMedia />
</div>

<!-- Toast for success messages -->
{#if showToast}
	<Toast
		message={toastMessage}
		type="success"
		dismissible={true}
		autohide={true}
		timeout={4000}
		position="bottom-right"
		onclose={handleToastClose}
	/>
{/if}
