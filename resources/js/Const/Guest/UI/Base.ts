// Base UI Constants
// Konstanta dasar untuk ukuran, varian, state, interaksi, dan transisi

export const UI_SIZES = {
  sm: 'text-sm px-3 py-2',
  md: 'text-base px-4 py-3',
  lg: 'text-lg px-5 py-4'
} as const;

export const UI_VARIANTS = {
  default: {
    base: 'bg-white border-gray-300 text-gray-900',
    focus: 'focus:border-amber-400 focus:ring-4 focus:ring-amber-400/30',
    placeholder: 'placeholder-gray-500',
    container: 'bg-white border-gray-300',
    backdrop: '',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    textMuted: 'text-gray-500',
    hover: 'hover:bg-gray-50',
    selected: 'bg-amber-100 text-amber-800',
    accent: 'text-amber-600'
  },
  elegant: {
    base: 'bg-black/10 backdrop-blur-md border-white/20 text-white',
    focus: 'focus:border-amber-400 focus:ring-4 focus:ring-amber-400/40',
    placeholder: 'placeholder-white/60 placeholder:text-sm',
    container: 'bg-white/10 backdrop-blur-md border-white/20',
    backdrop: 'backdrop-blur-md',
    text: 'text-white',
    textSecondary: 'text-white/80',
    textMuted: 'text-white/60',
    hover: 'hover:bg-white/20',
    selected: 'bg-amber-400/30 text-amber-200',
    accent: 'text-amber-400'
  },
  minimal: {
    base: 'bg-primary-700/20 backdrop-blur-md border-primary-600 text-gray-100',
    focus: 'focus:border-primary-700 focus:ring-4 focus:ring-primary-700/20',
    placeholder: 'placeholder-gray-300',
    container: 'bg-primary-700/20 backdrop-blur-md border-primary-600',
    backdrop: 'backdrop-blur-md',
    text: 'text-gray-100',
    textSecondary: 'text-gray-200',
    textMuted: 'text-gray-300',
    hover: 'hover:bg-primary-600/30',
    selected: 'bg-primary-600/40 text-primary-100',
    accent: 'text-primary-400'
  }
} as const;

export const UI_STATES = {
  error: 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/30',
  success: 'border-green-500 focus:border-green-500 focus:ring-4 focus:ring-green-500/30',
  disabled: 'opacity-50 cursor-not-allowed',
  readonly: 'cursor-default'
} as const;

export const UI_INTERACTIONS = {
  hover: 'hover:shadow-lg hover:ring-2 hover:ring-amber-400/20',
  active: 'active:ring-4 active:ring-amber-400/50',
  focus: 'focus:outline-none',
  shadow: 'shadow-md hover:shadow-xl',
  ring: 'ring-0 hover:ring-2'
} as const;

export const UI_TRANSITIONS = {
  base: 'transition-all duration-300',
  colors: 'transition-colors duration-200',
  transform: 'transition-transform duration-200'
} as const;

export const UI_CONTAINER = {
  base: 'p-6 backdrop-blur-md rounded-2xl border shadow-xl',
  elegant: 'bg-black/10 backdrop-blur-md border-white/20',
  default: 'bg-black/10 backdrop-blur-md border-gray-300',
  minimal: 'bg-primary-700/20 backdrop-blur-md border-primary-600'
}

export const UI_TEXTS = {
  base: {
    title: 'text-primary-900',
    subtitle: 'text-primary-900',
    item: 'text-primary-900',
    description: 'text-primary-900'
  },
  elegant: {
    title: 'text-white',
    subtitle: 'text-white',
    item: 'text-white',
    description: 'text-white'
  },
  minimal: {
    title: 'text-primary-200',
    subtitle: 'text-primary-200',
    item: 'text-primary-200',
    description: 'text-primary-200'
  }
}

// Component-specific variant configurations
export const UI_COMPONENT_VARIANTS = {
  // Labels
  labels: {
    base: 'text-sm font-semibold',
    default: 'text-gray-700',
    elegant: 'text-white',
    minimal: 'text-gray-200',
    required: 'text-amber-400 ml-1'
  },
  
  // Icons
  icons: {
    position: 'absolute left-3 top-1/2 transform -translate-y-1/2',
    color: {
      default: 'text-gray-400',
      elegant: 'text-white/60',
      minimal: 'text-gray-300'
    },
    size: 'w-4 h-4'
  },
  
  // Messages
  messages: {
    error: 'flex items-center gap-2 text-sm text-red-500 animate-pulse',
    success: 'flex items-center gap-2 text-sm text-green-500'
  },
  
  // Dropdown specific
  dropdown: {
    menu: {
      base: 'absolute z-50 w-full mt-2 border rounded-lg shadow-2xl max-h-60 overflow-hidden',
      default: 'bg-white border-gray-300',
      elegant: 'bg-white/10 backdrop-blur-md border-white/20',
      minimal: 'bg-primary-700/20 backdrop-blur-md border-primary-600'
    },
    option: {
      base: 'w-full px-4 py-3 text-left text-sm flex items-center justify-between cursor-pointer',
      disabled: 'opacity-50 cursor-not-allowed'
    },
    search: {
      container: 'p-3 border-b',
      input: 'w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400'
    },
    button: {
      base: 'w-full rounded-lg cursor-pointer appearance-none flex items-center justify-between',
      arrow: 'w-5 h-5 transition-transform duration-200',
      clear: 'hover:text-red-500 transition-colors duration-200'
    }
  },
  
  // Datepicker specific
  datepicker: {
    container: {
      base: `${UI_CONTAINER.base}`,
      default: `${UI_CONTAINER.default}`,
      elegant: `${UI_CONTAINER.elegant}`,
      minimal: `${UI_CONTAINER.minimal}`
    },
    classes: {
      default: {
        columnHeader: 'text-gray-700 font-semibold',
        input: 'text-gray-900 bg-white border-gray-300',
        button: 'text-gray-700 hover:bg-gray-100',
        actionButtons: 'text-amber-600 hover:text-amber-700',
        polite: 'text-gray-700 bg-transparent hover:text-amber-600',
        dayButton: 'text-gray-700 hover:text-amber-600 hover:bg-amber-50',
        titleVariant: 'text-amber-600 font-bold',
        monthButton: 'text-gray-700 py-1 px-4 text-xs hover:bg-gray-100'
      },
      elegant: {
        columnHeader: 'text-white font-semibold',
        input: 'text-white bg-white/10 backdrop-blur-md border-white/20',
        button: 'text-white hover:bg-white/20',
        actionButtons: 'text-amber-400 hover:text-amber-300',
        polite: 'text-white bg-transparent hover:text-amber-400',
        dayButton: 'text-white/80 hover:text-amber-400 hover:bg-amber-400/20',
        titleVariant: 'text-amber-400 font-bold',
        monthButton: 'text-white py-1 px-4 text-xs hover:bg-white/20'
      },
      minimal: {
        columnHeader: 'text-gray-100 font-semibold',
        input: 'text-gray-100 bg-primary-700/20 backdrop-blur-md border-primary-600',
        button: 'text-gray-100 hover:bg-primary-600/30',
        actionButtons: 'text-primary-400 hover:text-primary-300',
        polite: 'text-gray-100 bg-transparent hover:text-primary-400',
        dayButton: 'text-gray-100 hover:text-primary-400 hover:bg-primary-600/30',
        titleVariant: 'text-primary-400 font-bold',
        monthButton: 'text-gray-100 py-1 px-4 text-xs hover:bg-primary-600/30'
      }
    }
  },
  
  // Stepper specific
  stepper: {
    container: {
      base: `${UI_CONTAINER.base}`,
      default: `${UI_CONTAINER.default}`,
      elegant: `${UI_CONTAINER.elegant}`,
      minimal: `${UI_CONTAINER.minimal}`
    },
    step: {
      indicator: {
        base: 'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors',
        default: {
          completed: 'bg-amber-500 text-white',
          active: 'bg-amber-500 text-white',
          inactive: 'bg-gray-300 text-gray-600'
        },
        elegant: {
          completed: 'bg-amber-500 text-black font-bold',
          active: 'bg-amber-500 text-black font-bold',
          inactive: 'bg-white/20 text-white/60'
        },
        minimal: {
          completed: 'bg-primary-600 text-white',
          active: 'bg-primary-600 text-white',
          inactive: 'bg-gray-300 text-gray-600'
        }
      },
      connector: {
        base: 'transition-colors duration-200 bg-gray-300',
        horizontal: 'h-0.5 w-12',
        vertical: 'w-0.5 h-8 ml-4'
      }
    }
  },
  
  // Timepicker specific
  timepicker: {
    container: {
      base: `${UI_CONTAINER.base} w-full grid gap-1 p-2`,
      default: `${UI_CONTAINER.default}`,
      elegant: `${UI_CONTAINER.elegant}`,
      minimal: `${UI_CONTAINER.minimal}`
    },
    slot: {
      base: 'm-1 py-2 rounded-lg border text-center text-sm font-medium transition-all duration-200',
      available: {
        default: 'border-gray-300 bg-white text-gray-700 hover:bg-amber-50 hover:border-amber-400',
        elegant: 'border-white/30 bg-white/10 text-white/80 hover:text-white hover:bg-amber-400/20 hover:border-amber-400/50',
        minimal: 'border-primary-600 bg-primary-800/60 text-gray-100 hover:bg-primary-600/30 hover:border-primary-400'
      },
      selected: {
        default: 'border-amber-500 bg-amber-100 text-amber-800 shadow-lg',
        elegant: 'border-amber-400 bg-amber-400/30 text-amber-200 shadow-lg shadow-amber-400/20',
        minimal: 'border-primary-400 bg-primary-600/40 text-primary-100 shadow-lg shadow-primary-400/20'
      },
      unavailable: {
        default: 'cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400',
        elegant: 'cursor-not-allowed border-white/20 bg-white/5 text-white/40',
        minimal: 'cursor-not-allowed border-primary-700 bg-primary-800/30 text-gray-500'
      }
    }
  },
  
  // Reservation specific
  reservation: {
    container: {
      base: `${UI_CONTAINER.base}`,
      elegant: `${UI_CONTAINER.elegant}`,
      default: `${UI_CONTAINER.default}`,
      minimal: `${UI_CONTAINER.minimal}`
    },
    header: {
      base: 'mb-6 text-2xl font-bold tracking-wide text-center',
      elegant: 'text-orange-400',
      default: 'text-gray-800',
      minimal: 'text-primary-400'
    },
    grid: {
      base: 'grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'
    },
    item: {
      base: 'flex items-center space-x-3'
    },
    icon: {
      base: 'h-6 w-6',
      elegant: 'text-gray-200',
      default: 'text-gray-800',
      minimal: 'text-gray-100'
    },
    text: {
      base: 'text-base',
      elegant: 'text-gray-200',
      default: 'text-gray-800',
      minimal: 'text-gray-100'
    },
    contact: {
      container: 'mt-4 grid grid-cols-2 gap-6 text-center',
      label: {
        base: 'text-base font-semibold mb-1',
        elegant: 'text-gray-300',
        default: 'text-gray-600',
        minimal: 'text-gray-200'
      },
      value: {
        base: 'text-xl font-bold',
        elegant: 'text-orange-400',
        default: 'text-gray-800',
        minimal: 'text-primary-400'
      }
    }
  }
} as const;