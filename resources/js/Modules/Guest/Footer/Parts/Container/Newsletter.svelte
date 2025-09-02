<script lang="ts">
	import { CONTAINER_SECTION } from '../../../../../Const/Guest/UI/Container';
	import Button from '../../../../../Components/Guest/Atoms/Button.svelte';
	import { newsletterStore } from '../../Stores/Newsletter.store';
	import SocialMedia from './SocialMedia.svelte';

	// Simple translation fallback
	const translations = {
		'newsletter.title': 'Subscribe to Our Newsletter',
		'newsletter.description': 'Get the latest updates and offers',
		'newsletter.forms.email.placeholder': 'Enter your email',
		'newsletter.forms.submit.label': 'Subscribe',
		'newsletter.forms.submit.loadingLabel': 'Subscribing...'
	};
	const t = (key: string) => translations[key as keyof typeof translations] || key;

	// Email binding with proper reactivity
	let emailInput = '';

	// Subscribe to store changes
	$: emailInput = $newsletterStore.email;

	// Handle email input changes
	const handleEmailInput = (event: any) => {
		newsletterStore.setEmail(event.target.value);
	};

	// Handle form submission
	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		await newsletterStore.subscribeToNewsletter();
	};

	// Reactive state for toast
	$: showToast = $newsletterStore.success;
	$: toastMessage = $newsletterStore.success ? 'Successfully subscribed to our newsletter!' : '';

	// Handle toast close
	const handleToastClose = () => newsletterStore.clearSuccess();
</script>

<div class={CONTAINER_SECTION.footer.main.newsletter.base}>
	<div>
		<h3 class={CONTAINER_SECTION.footer.main.newsletter.title}>{t('newsletter.title')}</h3>
		<p class={CONTAINER_SECTION.footer.main.newsletter.description}>
			{t('newsletter.description')}
		</p>
	</div>

	<form
		on:submit={handleSubmit}
		class={CONTAINER_SECTION.footer.main.newsletter.form}
	>
		<input
			type="email"
			placeholder={t('newsletter.forms.email.placeholder') || 'Enter your email'}
			value={emailInput}
			on:input={handleEmailInput}
			required
			disabled={$newsletterStore.isSubscribing}
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
				? t('newsletter.forms.submit.loadingLabel') || 'Subscribing...'
				: t('newsletter.forms.submit.label') || 'Subscribe'}
		</Button>
	</form>

	<!-- Social Media Links -->
	<SocialMedia />
</div>

<!-- Success message -->
{#if showToast}
	<div class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
		<span>{toastMessage}</span>
		<button on:click={handleToastClose} class="ml-2 text-white hover:text-gray-200">×</button>
	</div>
{/if}
