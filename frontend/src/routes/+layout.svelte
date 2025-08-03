<script lang="ts">
	import '../app.css';
	import { NavBarLayout, ScheduleLayout } from '$lib/components/organisms';
	import { ChatBot } from '$lib/components/organisms';

	import { modalStore } from '$lib/stores/modal';
	import { viewportStore, viewportState } from '$lib/stores/viewport/viewport';
	import { useIndicatorSystem } from '$lib/utils/viewport';
	import { anchors } from '$lib/const/anchors';
	import {
		getAllSections,
		getIndicatorSections
	} from '$lib/const/navigation-config';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { SectionId } from '$lib/enums';

	// Import komponen secara langsung untuk menghindari loading issues
	import Menu from '$lib/modules/menu/Index.svelte';

	// Override the Menu component to avoid circular dependency
	const allSections = anchors.map((anchor) => {
		if (anchor.id === 'menu') {
			return { ...anchor, component: Menu };
		}
		return anchor;
	});

	// Get filtered sections based on configuration
	const sectionsForScrolling = getAllSections(allSections); // All sections for scrolling
	const sectionsForIndicator = getIndicatorSections(allSections); // Only specific sections for indicator

	// Setup sections in viewport store (all sections for scrolling)
	viewportStore.setSections(sectionsForScrolling);

	// Setup indicator system
	const indicator = useIndicatorSystem({
		hideDelay: 3000,
		mouseAreaPercentage: 0.8,
		indicatorAreaRadius: 100
	});

	// Destructure indicator visible store dan mouse detector
	const { visible: indicatorVisible, startMouseDetector } = indicator;

	// Start mouse detector on mount
	onMount(() => {
		if (browser) {
			startMouseDetector();
		}
	});

	// Integration dengan modal store
	modalStore.subscribe((modal) => {
		if (modal.isOpen) {
			viewportStore.disableScroll();
			indicator.hide();
		} else {
			viewportStore.enableScroll();
			indicator.showAndStartTimer();
		}
	});

	// Function to jump to section
	const jumpToSection = (index: number) => {
		// Convert indicator section index to actual section index
		const indicatorSection = sectionsForIndicator[index];
		if (indicatorSection) {
			const actualIndex = sectionsForScrolling.findIndex((s) => s.id === indicatorSection.id);
			if (actualIndex !== -1) {
				viewportStore.setCurrentSection(actualIndex);
				indicator.showAndStartTimer();
			}
		}
	};

	// Helper to get current section index from SectionId
	$: currentSectionIndex = (() => {
		const currentSectionId = $viewportState.section.currentSection;
		return sectionsForScrolling.findIndex((s) => s.id === currentSectionId);
	})();

	// Get current section index for indicator display
	$: currentIndicatorIndex = (() => {
		const currentSectionId = $viewportState.section.currentSection;
		return sectionsForIndicator.findIndex((s) => s.id === currentSectionId);
	})();

	import { HighlightLayout, LanguageSwitcherLayout } from '$lib/components/organisms';
	import ScrollIndicator from '$lib/components/organisms/layout/ScrollIndicator.svelte';
	import BackToTop from '$lib/components/organisms/layout/BackToTop.svelte';
	import ChatBotFab from '$lib/components/ChatBotFAB.svelte';
</script>

<NavBarLayout />
<!-- <Login /> -->
<ScheduleLayout />
<LanguageSwitcherLayout />

<slot />

<ChatBotFab />

<HighlightLayout />

<!-- Scroll Indicators -->
<!-- Down arrow for hero section -->
<!-- <ScrollIndicator direction="down" /> -->
<!-- Up arrow for footer section -->
<ScrollIndicator direction="up" targetSection="hero" />

<!-- Back to Top Button -->
<BackToTop />

<!-- Global styles are imported in app.css -->


<style lang="scss">
  // Import your global SCSS file here
  // The path is relative to the +layout.svelte file.
  @import '../lib/styles/global.scss';
</style>