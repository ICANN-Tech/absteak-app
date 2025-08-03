<script lang="ts">
	import { Button } from '$lib/components';
	import { CONTAINER_SECTION } from '$lib/const';
	import { createTranslationStore } from '$lib/utils/translation';

	const t = createTranslationStore();
</script>

<div class={CONTAINER_SECTION.hero.buttons.container}>
	<Button href="#menu" color="yellow" pill outline>{$t('hero.menuButton', 'Menu')}</Button>
	<Button href="#reservation" variant="warning" pill outline>{$t('hero.bookButton', 'Book')}</Button>
</div>
