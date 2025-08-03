import { writable, derived } from 'svelte/store';
import type { Highlights } from '$lib/types/highlight.type';
import { HighlightId, SectionId } from '$lib/enums';

// State untuk current highlight index
export const currentHighlightIndex = writable<number>(0);

// State untuk transitioning
export const isHighlightTransitioning = writable<boolean>(false);

// Lazy load highlights data untuk menghindari circular import
export const highlightsData = writable<Highlights>([]);

// Initialize highlights data secara lazy
export const initializeHighlights = async () => {
  try {
    const { highlights } = await import('$lib/const/control/highlight');

    highlightsData.set(highlights);
  } catch (error) {
    console.error('Failed to load highlights:', error);
    // Fallback data
    highlightsData.set([
      {
        id: HighlightId.VideoHighlight,
        name: 'Video Highlight',
        sectionId: SectionId.VideoHighlight
      },
      {
        id: HighlightId.Experience,
        name: 'Experience',
        sectionId: SectionId.Experience
      },
      {
        id: HighlightId.Chef,
        name: 'Chef',
        sectionId: SectionId.Chef
      },
      {
        id: HighlightId.Menu,
        name: 'Menu',
        sectionId: SectionId.Menu
      },
      {
        id: HighlightId.Booking,
        name: 'Reservation',
        sectionId: SectionId.Booking
      }
    ]);
  }
};

// Derived store untuk current highlight
export const currentHighlight = derived(
  [currentHighlightIndex, highlightsData],
  ([$currentIndex, $highlights]) => {
    if ($highlights && $highlights.length > 0 && $currentIndex >= 0 && $currentIndex < $highlights.length) {
      return $highlights[$currentIndex];
    }
    return null;
  }
);

// Utility functions
export const highlightStore = {
  // Jump to specific highlight by index
  jumpToHighlight: (index: number) => {
    highlightsData.subscribe(highlights => {
      if (index >= 0 && index < highlights.length) {
        isHighlightTransitioning.set(true);
        currentHighlightIndex.set(index);
        
        // Get the highlight and trigger section jump
        const highlight = highlights[index];
        if (highlight && highlight.sectionId) {
          // Import navigator dynamically to avoid circular dependency
          import('$lib/utils/viewport/navigator').then(({ useViewportNavigator }) => {
            const navigator = useViewportNavigator();
            navigator.jumpToSectionById(highlight.sectionId);
          });

          // Only reset visibility if component is not locked (to respect footer section hiding)
          import('$lib/stores/viewport/visibility').then(({ resetComponentVisibility, isVisibilityLocked }) => {
            import('$lib/enums').then(({ ComponentId }) => {
              if (!isVisibilityLocked(ComponentId.Highlight)) {
                resetComponentVisibility(ComponentId.Highlight);
              }
            });
          });
        }
        
        // Reset transitioning state after animation
        setTimeout(() => {
          isHighlightTransitioning.set(false);
        }, 300);
      }
    })();
  },

  // Jump to highlight by ID
  jumpToHighlightById: (highlightId: string) => {
    highlightsData.subscribe(highlights => {
      const targetIndex = highlights.findIndex(highlight => highlight.id === highlightId);
      if (targetIndex !== -1) {
        highlightStore.jumpToHighlight(targetIndex);
      }
    })();
  },

  // Jump to highlight by section ID
  jumpToHighlightBySectionId: (sectionId: string) => {
    highlightsData.subscribe(highlights => {
      const targetIndex = highlights.findIndex(highlight => highlight.sectionId === sectionId);
      if (targetIndex !== -1) {
        highlightStore.jumpToHighlight(targetIndex);
      }
    })();
  },

  // Go to next highlight
  nextHighlight: () => {
    currentHighlightIndex.subscribe(currentIndex => {
      highlightsData.subscribe(highlights => {
        const nextIndex = (currentIndex + 1) % highlights.length;
        highlightStore.jumpToHighlight(nextIndex);
      })();
    })();
  },

  // Go to previous highlight
  previousHighlight: () => {
    currentHighlightIndex.subscribe(currentIndex => {
      highlightsData.subscribe(highlights => {
        const prevIndex = currentIndex === 0 ? highlights.length - 1 : currentIndex - 1;
        highlightStore.jumpToHighlight(prevIndex);
      })();
    })();
  },

  // Reset to first highlight
  reset: () => {
    currentHighlightIndex.set(0);
    isHighlightTransitioning.set(false);
  },

  // Update highlights data
  updateHighlights: (newHighlights: Highlights) => {
    highlightsData.set(newHighlights);
    // Reset index if current index is out of bounds
    currentHighlightIndex.subscribe(currentIndex => {
      if (currentIndex >= newHighlights.length) {
        currentHighlightIndex.set(0);
      }
    })();
  },

  // Sync highlight index with section changes (untuk scroll)
  syncWithSectionChange: (sectionId: string) => {
    highlightsData.subscribe(highlights => {
      const targetIndex = highlights.findIndex(highlight => highlight.sectionId === sectionId);
      if (targetIndex !== -1) {
        currentHighlightIndex.subscribe(currentIndex => {
          if (targetIndex !== currentIndex) {
            // Update highlight index tanpa trigger navigation (karena sudah di section yang benar)
            currentHighlightIndex.set(targetIndex);
          }
        })();
      }
    })();
  },

  // Sync highlight index with section index
  syncWithSectionIndex: (sectionIndex: number) => {
    highlightsData.subscribe(highlights => {
      // Cari highlight yang sesuai dengan section index
      // Asumsi: highlights dan sections memiliki urutan yang sama atau mapping yang konsisten
      if (sectionIndex >= 0 && sectionIndex < highlights.length) {
        currentHighlightIndex.set(sectionIndex);
      }
    })();
  }
};