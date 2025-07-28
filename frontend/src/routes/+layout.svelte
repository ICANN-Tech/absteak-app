<script lang="ts">
  import '../app.css';
  import {HeaderLayout as Header} from '$lib/components/organisms';
  import Login from '$lib/components/Login.svelte';
  import Schedule from '$lib/components/Schedule.svelte';
  import ChatBotFAB from '$lib/components/ChatBotFAB.svelte';
  import SwitchLanguage from '$lib/components/SwitchLanguage.svelte';
  import Indicator from '$lib/components/atoms/indicator/Index.svelte';
  
  import { modalStore } from '$lib/stores/modal';
  import { viewportStore } from '$lib/stores/viewport';
  import { useIndicatorSystem } from '$lib/utils/viewport';
  import { anchors } from "$lib/const/anchors";
  import { navigationConfig, getAllSections, getIndicatorSections } from "$lib/const/navigation-config";
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  // Import komponen secara langsung untuk menghindari loading issues
  import Menu from '$lib/components/organisms/section/menu/Index.svelte';

  // Override the Menu component to avoid circular dependency
  const allSections = anchors.map(anchor => {
    if (anchor.id === 'menu') {
      return { ...anchor, component: Menu };
    }
    return anchor;
  });

  // Get filtered sections based on configuration
  const sectionsForScrolling = getAllSections(allSections); // All sections for scrolling
  const sectionsForIndicator = getIndicatorSections(allSections); // Only specific sections for indicator

  // Setup sections in viewport store (all sections for scrolling)
  viewportStore.setSections(sectionsForScrolling.map(s => ({ id: s.id, path: '' })));

  // Setup indicator system
  const indicator = useIndicatorSystem({
    hideDelay: 3000,
    mouseAreaPercentage: 0.8,
    indicatorAreaRadius: 100
  });

  // Destructure indicator visible store dan mouse detector
  const { 
    visible: indicatorVisible,
    startMouseDetector
  } = indicator;

  // Start mouse detector on mount
  onMount(() => {
    if (browser) {
      startMouseDetector();
    }
  });

  // Integration dengan modal store
  modalStore.subscribe(modal => {
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
      const actualIndex = sectionsForScrolling.findIndex(s => s.id === indicatorSection.id);
      if (actualIndex !== -1) {
        viewportStore.setCurrentSection(actualIndex);
        indicator.showAndStartTimer();
      }
    }
  };

  // Get current section index for indicator display
  $: currentIndicatorIndex = (() => {
    const currentSection = sectionsForScrolling[$viewportStore.currentSectionIndex];
    if (currentSection) {
      return sectionsForIndicator.findIndex(s => s.id === currentSection.id);
    }
    return -1;
  })();
</script>

<Header />
<!-- <Login /> -->
<Schedule />
<SwitchLanguage />

<slot />

<ChatBotFAB />

<!-- Section indicator menggunakan komponen terpisah -->
<Indicator 
  sections={sectionsForIndicator?.map((s: any) => ({ id: s.id, path: '' })) || []}
  currentSectionIndex={currentIndicatorIndex >= 0 ? currentIndicatorIndex : 0}
  visible={$indicatorVisible}
  onSectionClick={jumpToSection}
/>
