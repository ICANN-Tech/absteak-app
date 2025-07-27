// Dropdown UI Constants
// Konstanta khusus untuk styling dropdown menu, option, search, dan button
// Menggunakan centralized variants dari base.ts

import { UI_COMPONENT_VARIANTS, UI_VARIANTS } from './base';

export const DROPDOWN_MENU = {
  ...UI_COMPONENT_VARIANTS.dropdown.menu,
  // Backward compatibility aliases
  elegant: UI_COMPONENT_VARIANTS.dropdown.menu.elegant,
  default: UI_COMPONENT_VARIANTS.dropdown.menu.default,
  minimal: UI_COMPONENT_VARIANTS.dropdown.menu.minimal
} as const;

export const DROPDOWN_OPTION = {
  ...UI_COMPONENT_VARIANTS.dropdown.option,
  hover: {
    elegant: UI_VARIANTS.elegant.hover + ' focus:bg-white/20',
    default: UI_VARIANTS.default.hover + ' focus:bg-amber-50',
    minimal: UI_VARIANTS.minimal.hover + ' focus:bg-primary-600/30'
  },
  selected: {
    elegant: UI_VARIANTS.elegant.selected,
    default: UI_VARIANTS.default.selected,
    minimal: UI_VARIANTS.minimal.selected
  },
  text: {
    elegant: UI_VARIANTS.elegant.text,
    default: UI_VARIANTS.default.text,
    minimal: UI_VARIANTS.minimal.text
  },
  disabled: UI_COMPONENT_VARIANTS.dropdown.option.disabled
} as const;

export const DROPDOWN_SEARCH = {
  ...UI_COMPONENT_VARIANTS.dropdown.search,
  elegant: UI_VARIANTS.elegant.base,
  default: UI_VARIANTS.default.base,
  minimal: UI_VARIANTS.minimal.base
} as const;

export const DROPDOWN_BUTTON = {
  ...UI_COMPONENT_VARIANTS.dropdown.button,
  arrow: UI_COMPONENT_VARIANTS.dropdown.button.arrow + ' ' + UI_VARIANTS.elegant.textMuted,
  clear: UI_VARIANTS.elegant.textMuted + ' ' + UI_COMPONENT_VARIANTS.dropdown.button.clear
} as const;