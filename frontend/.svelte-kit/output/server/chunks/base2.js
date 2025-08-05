const UI_SIZES = {
  sm: "text-sm px-3 py-2",
  md: "text-base px-4 py-3",
  lg: "text-lg px-5 py-4"
};
const UI_VARIANTS = {
  default: {
    base: "bg-white border-gray-300 text-gray-900",
    focus: "focus:border-amber-400 focus:ring-4 focus:ring-amber-400/30",
    placeholder: "placeholder-gray-500",
    container: "bg-white border-gray-300",
    backdrop: "",
    text: "text-gray-900",
    textSecondary: "text-gray-600",
    textMuted: "text-gray-500",
    hover: "hover:bg-gray-50",
    selected: "bg-amber-100 text-amber-800",
    accent: "text-amber-600"
  },
  elegant: {
    base: "bg-black/10 backdrop-blur-md border-white/20 text-white",
    focus: "focus:border-amber-400 focus:ring-4 focus:ring-amber-400/40",
    placeholder: "placeholder-white/60 placeholder:text-sm",
    container: "bg-white/10 backdrop-blur-md border-white/20",
    backdrop: "backdrop-blur-md",
    text: "text-white",
    textSecondary: "text-white/80",
    textMuted: "text-white/60",
    hover: "hover:bg-white/20",
    selected: "bg-amber-400/30 text-amber-200",
    accent: "text-amber-400"
  },
  minimal: {
    base: "bg-primary-700/20 backdrop-blur-md border-primary-600 text-gray-100",
    focus: "focus:border-primary-700 focus:ring-4 focus:ring-primary-700/20",
    placeholder: "placeholder-gray-300",
    container: "bg-primary-700/20 backdrop-blur-md border-primary-600",
    backdrop: "backdrop-blur-md",
    text: "text-gray-100",
    textSecondary: "text-gray-200",
    textMuted: "text-gray-300",
    hover: "hover:bg-primary-600/30",
    selected: "bg-primary-600/40 text-primary-100",
    accent: "text-primary-400"
  }
};
const UI_STATES = {
  error: "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/30",
  success: "border-green-500 focus:border-green-500 focus:ring-4 focus:ring-green-500/30",
  disabled: "opacity-50 cursor-not-allowed",
  readonly: "cursor-default"
};
const UI_INTERACTIONS = {
  hover: "hover:shadow-lg hover:ring-2 hover:ring-amber-400/20",
  active: "active:ring-4 active:ring-amber-400/50",
  focus: "focus:outline-none",
  shadow: "shadow-md hover:shadow-xl",
  ring: "ring-0 hover:ring-2"
};
const UI_TRANSITIONS = {
  base: "transition-all duration-300",
  colors: "transition-colors duration-200"
};
const UI_CONTAINER = {
  base: "p-6 backdrop-blur-md rounded-2xl border shadow-xl",
  elegant: "bg-black/10 backdrop-blur-md border-white/20",
  default: "bg-black/10 backdrop-blur-md border-gray-300",
  minimal: "bg-primary-700/20 backdrop-blur-md border-primary-600"
};
const UI_TEXTS = {
  base: {
    title: "text-primary-900",
    subtitle: "text-primary-900",
    item: "text-primary-900",
    description: "text-primary-900"
  },
  elegant: {
    title: "text-white",
    description: "text-white"
  }
};
const UI_COMPONENT_VARIANTS = {
  // Labels
  labels: {
    base: "text-sm font-semibold",
    default: "text-gray-700",
    elegant: "text-white",
    minimal: "text-gray-200",
    required: "text-amber-400 ml-1"
  },
  // Icons
  icons: {
    position: "absolute left-3 top-1/2 transform -translate-y-1/2",
    color: {
      default: "text-gray-400",
      elegant: "text-white/60",
      minimal: "text-gray-300"
    },
    size: "w-4 h-4"
  },
  // Messages
  messages: {
    error: "flex items-center gap-2 text-sm text-red-500 animate-pulse",
    success: "flex items-center gap-2 text-sm text-green-500"
  },
  // Dropdown specific
  dropdown: {
    button: {
      base: "w-full rounded-lg cursor-pointer appearance-none flex items-center justify-between",
      arrow: "w-5 h-5 transition-transform duration-200",
      clear: "hover:text-red-500 transition-colors duration-200"
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
        base: "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
        default: {
          completed: "bg-amber-500 text-white",
          active: "bg-amber-500 text-white",
          inactive: "bg-gray-300 text-gray-600"
        },
        elegant: {
          completed: "bg-amber-500 text-black font-bold",
          active: "bg-amber-500 text-black font-bold",
          inactive: "bg-white/20 text-white/60"
        },
        minimal: {
          completed: "bg-primary-600 text-white",
          active: "bg-primary-600 text-white",
          inactive: "bg-gray-300 text-gray-600"
        }
      },
      connector: {
        base: "transition-colors duration-200 bg-gray-300",
        horizontal: "h-0.5 w-12",
        vertical: "w-0.5 h-8 ml-4"
      }
    }
  }
};
export {
  UI_TRANSITIONS as U,
  UI_COMPONENT_VARIANTS as a,
  UI_VARIANTS as b,
  UI_SIZES as c,
  UI_INTERACTIONS as d,
  UI_STATES as e,
  UI_TEXTS as f
};
