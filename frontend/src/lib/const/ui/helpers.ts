// UI Helper Functions
// Helper functions untuk menggabungkan kelas styling

import { UI_SIZES, UI_VARIANTS, UI_STATES, UI_INTERACTIONS, UI_TRANSITIONS, UI_COMPONENT_VARIANTS } from './base';

export function getInputClasses(
  size: keyof typeof UI_SIZES,
  variant: keyof typeof UI_VARIANTS,
  options: {
    error?: boolean;
    success?: boolean;
    disabled?: boolean;
    readonly?: boolean;
  } = {}
): string {
  const baseClasses = [
    'w-full rounded-lg',
    UI_TRANSITIONS.base,
    UI_SIZES[size],
    UI_VARIANTS[variant].base,
    UI_VARIANTS[variant].focus,
    UI_VARIANTS[variant].placeholder,
    UI_INTERACTIONS.focus,
    UI_INTERACTIONS.shadow,
    UI_INTERACTIONS.ring
  ];

  if (options.error) {
    baseClasses.push(UI_STATES.error);
  } else if (options.success) {
    baseClasses.push(UI_STATES.success);
  }

  if (options.disabled) {
    baseClasses.push(UI_STATES.disabled);
  } else {
    baseClasses.push(UI_INTERACTIONS.hover, UI_INTERACTIONS.active);
  }

  if (options.readonly) {
    baseClasses.push(UI_STATES.readonly);
  }

  return baseClasses.join(' ');
}

export function getDropdownClasses(
  size: keyof typeof UI_SIZES,
  variant: keyof typeof UI_VARIANTS,
  options: {
    error?: boolean;
    success?: boolean;
    disabled?: boolean;
  } = {}
): string {
  return getInputClasses(size, variant, options) + ' ' + UI_COMPONENT_VARIANTS.dropdown.button.base;
}

export function getLabelClasses(variant: keyof typeof UI_VARIANTS): string {
  const baseClasses: string[] = [UI_COMPONENT_VARIANTS.labels.base, UI_TRANSITIONS.colors];
  
  baseClasses.push(UI_COMPONENT_VARIANTS.labels[variant]);

  return baseClasses.join(' ');
}

export function getDatepickerClasses(variant: keyof typeof UI_VARIANTS): string {
  return `${UI_COMPONENT_VARIANTS.datepicker.container.base} ${UI_COMPONENT_VARIANTS.datepicker.container[variant]}`;
}

export function getDatepickerVariantClasses(variant: keyof typeof UI_VARIANTS) {
  return UI_COMPONENT_VARIANTS.datepicker.classes[variant];
}

export function getTimepickerContainerClasses(variant: keyof typeof UI_VARIANTS, columns: number = 4): string {
  const gridClass = columns === 1 ? 'grid-cols-1' :
                   columns === 2 ? 'grid-cols-2' :
                   columns === 3 ? 'grid-cols-3' :
                   columns === 4 ? 'grid-cols-4' :
                   columns === 5 ? 'grid-cols-5' :
                   columns === 6 ? 'grid-cols-6' :
                   'grid-cols-4'; // default fallback
  
  return `${UI_COMPONENT_VARIANTS.timepicker.container.base} ${UI_COMPONENT_VARIANTS.timepicker.container[variant]} ${gridClass}`;
}

export function getTimepickerSlotClasses(
  variant: keyof typeof UI_VARIANTS,
  state: 'available' | 'selected' | 'unavailable'
): string {
  return `${UI_COMPONENT_VARIANTS.timepicker.slot.base} ${UI_COMPONENT_VARIANTS.timepicker.slot[state][variant]}`;
}

export function getStepperContainerClasses(
  variant: keyof typeof UI_VARIANTS,
  orientation: 'horizontal' | 'vertical' = 'horizontal'
): string {
  const baseClasses = orientation === 'horizontal' 
    ? 'inline-flex items-center gap-4'
    : 'flex flex-col space-y-4';
  
  return `${baseClasses} ${UI_COMPONENT_VARIANTS.stepper.container.base} ${UI_COMPONENT_VARIANTS.stepper.container[variant]}`;
}

export function getStepperIndicatorClasses(
  variant: keyof typeof UI_VARIANTS,
  state: 'completed' | 'active' | 'inactive'
): string {
  return `${UI_COMPONENT_VARIANTS.stepper.step.indicator.base} ${UI_COMPONENT_VARIANTS.stepper.step.indicator[variant][state]}`;
}

export function getStepperConnectorClasses(
  variant: keyof typeof UI_VARIANTS,
  orientation: 'horizontal' | 'vertical' = 'horizontal',
  isCompleted: boolean = false
): string {
  const orientationClass = orientation === 'horizontal' 
    ? UI_COMPONENT_VARIANTS.stepper.step.connector.horizontal
    : UI_COMPONENT_VARIANTS.stepper.step.connector.vertical;

  const colorClass = isCompleted ? UI_VARIANTS[variant].accent : UI_VARIANTS[variant].textMuted;

  return `${UI_COMPONENT_VARIANTS.stepper.step.connector.base} ${orientationClass} ${colorClass}`;
}

export function getReservationSummaryClasses(variant: keyof typeof UI_VARIANTS) {
  return {
    container: `${UI_COMPONENT_VARIANTS.reservation.container.base} ${UI_COMPONENT_VARIANTS.reservation.container[variant]}`,
    header: `${UI_COMPONENT_VARIANTS.reservation.header.base} ${UI_COMPONENT_VARIANTS.reservation.header[variant]}`,
    grid: UI_COMPONENT_VARIANTS.reservation.grid.base,
    item: UI_COMPONENT_VARIANTS.reservation.item.base,
    icon: `${UI_COMPONENT_VARIANTS.reservation.icon.base} ${UI_COMPONENT_VARIANTS.reservation.icon[variant]}`,
    text: `${UI_COMPONENT_VARIANTS.reservation.text.base} ${UI_COMPONENT_VARIANTS.reservation.text[variant]}`,
    contact: {
      container: UI_COMPONENT_VARIANTS.reservation.contact.container,
      label: `${UI_COMPONENT_VARIANTS.reservation.contact.label.base} ${UI_COMPONENT_VARIANTS.reservation.contact.label[variant]}`,
      value: `${UI_COMPONENT_VARIANTS.reservation.contact.value.base} ${UI_COMPONENT_VARIANTS.reservation.contact.value[variant]}`
    }
  };
}