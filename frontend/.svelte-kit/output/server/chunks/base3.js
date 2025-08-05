import { C as ComponentId } from "./initialize.js";
import { hideComponent, showComponent } from "./visibility.js";
const interactingComponents = /* @__PURE__ */ new Set();
function isComponentInteracting(componentId) {
  return interactingComponents.has(componentId);
}
function hideComponentRespectingInteraction(componentId) {
  if (!isComponentInteracting(componentId)) {
    hideComponent(componentId);
  }
}
const DEFAULT_MANUAL_COMPONENTS = [
  ComponentId.Navigation,
  ComponentId.Schedule,
  ComponentId.Highlight,
  ComponentId.LanguageSwitch,
  ComponentId.VideoPromotion,
  ComponentId.ChatBot,
  ComponentId.Operation
];
const DEFAULT_SECTION_CONFIG = {
  hideOnCall: [
    ComponentId.ScrollIndicator,
    ComponentId.BackToTop
  ],
  showOnCall: [
    ComponentId.Navigation,
    ComponentId.Schedule,
    ComponentId.Highlight,
    ComponentId.LanguageSwitch,
    ComponentId.VideoPromotion,
    ComponentId.ChatBot,
    ComponentId.Operation
  ],
  showOnExit: [],
  hideOnExit: [
    ComponentId.ScrollIndicator,
    ComponentId.BackToTop
  ],
  manualComponents: DEFAULT_MANUAL_COMPONENTS
};
({
  // Don't hide any components when section is called
  showOnCall: [
    ComponentId.Navigation,
    ComponentId.Schedule,
    ComponentId.Highlight,
    ComponentId.LanguageSwitch,
    ComponentId.VideoPromotion,
    ComponentId.ChatBot,
    ComponentId.Operation
  ],
  // Don't show any components when section exits
  hideOnExit: [
    ComponentId.Navigation,
    ComponentId.Schedule,
    ComponentId.Highlight,
    ComponentId.LanguageSwitch,
    ComponentId.VideoPromotion,
    ComponentId.ChatBot,
    ComponentId.Operation
  ],
  manualComponents: [
    ComponentId.Navigation,
    ComponentId.LanguageSwitch,
    ComponentId.Schedule
  ]
});
function showAllComponents(componentIds) {
  componentIds.forEach((componentId) => {
    showComponent(componentId);
  });
}
function hideAllComponents(componentIds) {
  componentIds.forEach((componentId) => {
    hideComponentRespectingInteraction(componentId);
  });
}
function handleSectionCall(config = DEFAULT_SECTION_CONFIG, trackingStore) {
  if (config.hideOnCall && config.hideOnCall.length > 0) {
    hideAllComponents(config.hideOnCall);
    if (trackingStore) {
      trackingStore.update((store) => {
        const newStore = new Map(store);
        config.hideOnCall.forEach((componentId) => {
          newStore.set(componentId, false);
        });
        return newStore;
      });
    }
  }
  if (config.showOnCall && config.showOnCall.length > 0) {
    showAllComponents(config.showOnCall);
    if (trackingStore) {
      trackingStore.update((store) => {
        const newStore = new Map(store);
        config.showOnCall.forEach((componentId) => {
          newStore.set(componentId, true);
        });
        return newStore;
      });
    }
  }
}
function handleSectionExit(config = DEFAULT_SECTION_CONFIG, trackingStore) {
  if (config.showOnExit && config.showOnExit.length > 0) {
    showAllComponents(config.showOnExit);
    if (trackingStore) {
      trackingStore.update((store) => {
        const newStore = new Map(store);
        config.showOnExit.forEach((componentId) => {
          newStore.set(componentId, true);
        });
        return newStore;
      });
    }
  }
  if (config.hideOnExit && config.hideOnExit.length > 0) {
    hideAllComponents(config.hideOnExit);
    if (trackingStore) {
      trackingStore.update((store) => {
        const newStore = new Map(store);
        config.hideOnExit.forEach((componentId) => {
          newStore.set(componentId, false);
        });
        return newStore;
      });
    }
  }
}
export {
  DEFAULT_MANUAL_COMPONENTS as D,
  DEFAULT_SECTION_CONFIG as a,
  handleSectionCall as b,
  handleSectionExit as h
};
