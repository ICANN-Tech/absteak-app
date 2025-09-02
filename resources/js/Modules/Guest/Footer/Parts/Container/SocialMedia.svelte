<script context="module" lang="ts">
	import SocialMediaContact from '@Components/Guest/Molecules/Contact/SocialMedia.svelte';
	import { CONTAINER_SECTION } from '@Const/Guest/UI/Container';

	const socialLinks = {
		instagram: 'https://instagram.com/absteak',
		facebook: 'https://facebook.com/absteak',
		twitter: 'https://twitter.com/absteak',
		youtube: 'https://youtube.com/absteak'
	};
</script>

<div class={CONTAINER_SECTION.footer.main.newsletter.social}>
	<SocialMediaContact platform="facebook" url={socialLinks.facebook} />
	<SocialMediaContact platform="twitter" url={socialLinks.twitter} />
	<SocialMediaContact platform="instagram" url={socialLinks.instagram} />
	<SocialMediaContact platform="youtube" url={socialLinks.youtube} />
</div>
