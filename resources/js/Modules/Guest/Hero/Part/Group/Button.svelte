<script lang="ts">
	import {Button} from '@Components/Guest/Atoms/Index';
	import { CONTAINER_SECTION } from '../../../../../Const/Guest/UI/Container';
	import { createTranslationStore } from '../../../../../Utils/Global/Translation';
	import { jumpToSection } from '../../../../../Utils/Guest/Viewport/Section';
	import { SectionEnum } from '../../../../../Enums/Guest/Section';

	const t = createTranslationStore();

	// Navigation handlers for smooth scrolling to sections
	const scrollToElementById = (elementId: string) => {
		const element = document.getElementById(elementId);
		if (element) {
			// Calculate offset for header (assuming 80px header height)
			const headerOffset = 80;
			const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
			const offsetPosition = elementPosition - headerOffset;

			window.scrollTo({
				top: offsetPosition,
				behavior: 'smooth'
			});
			return true;
		}
		return false;
	};

	const handleMenuClick = async () => {
		try {
			// First try the section navigation system
			await jumpToSection(SectionEnum.Menu, {
				scrollConfig: {
					behavior: 'smooth',
					offsetForHeader: true
				}
			});
		} catch (error) {
			console.error('Section navigation failed, trying fallback scroll:', error);
			// Fallback: direct scroll to element by ID
			if (!scrollToElementById(SectionEnum.Menu)) {
				console.error('Failed to find menu section element');
			}
		}
	};

	const handleBookClick = async () => {
		try {
			// First try the section navigation system
			await jumpToSection(SectionEnum.Booking, {
				scrollConfig: {
					behavior: 'smooth',
					offsetForHeader: true
				}
			});
		} catch (error) {
			console.error('Section navigation failed, trying fallback scroll:', error);
			// Fallback: direct scroll to element by ID
			if (!scrollToElementById(SectionEnum.Booking)) {
				console.error('Failed to find booking section element');
			}
		}
	};
</script>

<div class={CONTAINER_SECTION.hero.buttons.container}>
	<Button onclick={handleMenuClick} variant="warning" pill>{$t('hero.menuButton', 'Menu')}</Button>
	<Button onclick={handleBookClick} variant="warning" pill>{$t('hero.bookButton', 'Book')}</Button>
</div>
