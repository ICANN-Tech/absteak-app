<script lang="ts">
	import Button from '../../../../../Components/Guest/Atoms/Button.svelte';
	import { CONTAINER_SECTION } from '../../../../../Const/Guest/UI/Container';
	import { createTranslationStore } from '../../../../../Utils/Global/Translation';

	const t = createTranslationStore();
</script>

<div class={CONTAINER_SECTION.hero.buttons.container}>
	<Button href="#menu" variant="warning" pill>{$t('hero.menuButton', 'Menu')}</Button>
	<Button href="#reservation" variant="warning" pill>{$t('hero.bookButton', 'Book')}</Button>
</div>
