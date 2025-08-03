<script lang="ts">
	import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from '$lib/components/atoms';

	export let platform: 'facebook' | 'twitter' | 'instagram' | 'youtube' = 'facebook';
	export let url = 'https://www.facebook.com/absteak';
</script>

<div class="flex space-x-4">
	<a
		href={url}
		target="_blank"
		rel="noopener noreferrer"
		class="flex items-center justify-center rounded-full bg-gray-800 text-gray-300 transition-all duration-300 hover:scale-110 hover:bg-blue-400 hover:text-white p-2"
	>
		{#if platform === 'facebook'}
			<FacebookIcon className="w-6 h-6" />
		{:else if platform === 'twitter'}
			<TwitterIcon className="w-6 h-6" />
		{:else if platform === 'instagram'}
			<InstagramIcon className="w-6 h-6" />
		{:else if platform === 'youtube'}
			<YoutubeIcon className="w-6 h-6" />
		{/if}
	</a>
</div>
