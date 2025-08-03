// Container UI Constants
// Konstanta khusus untuk berbagai jenis container dengan varian dan ukuran

import { UI_TEXTS, UI_VARIANTS, UI_TRANSITIONS, UI_CONTAINER } from "./base";
import { UI_LAYOUT } from "./layout";

export const CONTAINER_SIZES = {
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8'
} as const;

export const CONTAINER_RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-full'
} as const;

export const CONTAINER_SHADOWS = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl'
} as const;

export const CONTAINER_BORDERS = {
  none: 'border-0',
  thin: 'border',
  thick: 'border-2'
} as const;

export const CONTAINER_VARIANTS = {
  // Default container - solid background
  default: {
    base: UI_VARIANTS.default.base,
    shadow: 'shadow-md',
    border: 'border',
    radius: 'rounded-xl'
  },
  
  // Elegant container - glass morphism effect
  elegant: {
    base: UI_VARIANTS.elegant.base,
    shadow: 'shadow-xl',
    border: 'border',
    radius: 'rounded-2xl'
  },
  
  // Minimal container - subtle primary theme
  minimal: {
    base: UI_VARIANTS.minimal.base,
    shadow: 'shadow-lg',
    border: 'border',
    radius: 'rounded-xl'
  },
  
  // Blur container - heavy blur effect dengan primary background
  blur: {
    base: 'bg-primary-950/60 backdrop-blur-xl shadow-lg border-white/20 text-white',
    shadow: 'shadow-lg',
    border: 'border',
    radius: 'rounded-2xl'
  }
} as const;

export const CONTAINER_OVERFLOW = {
  auto: 'overflow-auto',
  hidden: 'overflow-hidden',
  visible: 'overflow-visible',
  scroll: 'overflow-scroll'
} as const;

export const CONTAINER_LAYOUTS = {
  // Flex layouts
  flex: {
    col: 'flex flex-col',
    row: 'flex flex-row',
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    around: 'flex items-center justify-around',
    evenly: 'flex items-center justify-evenly'
  },
  
  // Grid layouts
  grid: {
    cols1: 'grid grid-cols-1',
    cols2: 'grid grid-cols-2',
    cols3: 'grid grid-cols-3',
    cols4: 'grid grid-cols-4',
    responsive: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  }
} as const;

export const CONTAINER_GAPS = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8'
} as const;

export const CONTAINER_RESPONSIVE = {
  default: 'w-full max-w-screen-xl mx-auto mx-4 p-4',
  flex: {
    base: 'flex flex-col items-center justify-center',
    gap: 'gap-4',
    padding: 'p-4',
  },
  text: {
      base: 'font-pacifico',
      title: `${UI_TEXTS.base.title} text-4xl font-extrabold mb-6 leading-tight`,
      description: `${UI_TEXTS.base.description} text-lg mb-4`,
      subtitle: `${UI_TEXTS.base.subtitle} text-base mb-8`
  }
} as const;

export const CONTAINER_SECTION = {
  hero: {
    base: 'w-full h-screen relative z-20',
    flex: 'flex flex-col md:flex-row h-full',
    content: {
      base: `${CONTAINER_RESPONSIVE.flex.base}`,
      left: `md:w-1/2 ${CONTAINER_LAYOUTS.flex.col} justify-center ${CONTAINER_SIZES.sm} md:${CONTAINER_SIZES.md} lg:${CONTAINER_SIZES.lg}`,
      right: `md:w-1/2 flex h-full ${CONTAINER_OVERFLOW.hidden}`,
      centered: `${CONTAINER_LAYOUTS.flex.col} items-center justify-center h-full text-center px-8 md:px-14 lg:px-20 xl:px-28 max-w-4xl mx-auto`
    },
    text: {
      base: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.elegant.title}`,
      title: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.elegant.title} text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight`,
      subtitle: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.elegant.subtitle} text-base md:text-lg mb-4 md:mb-6`,
      description: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.elegant.description} text-sm md:text-base lg:text-lg mb-6 md:mb-8`
    },
    logo: {
      base: 'mb-6 md:mb-8'
    },
    buttons: {
      container: `${CONTAINER_LAYOUTS.flex.col} sm:${CONTAINER_LAYOUTS.flex.row} ${CONTAINER_GAPS.md} justify-center items-center mt-4 md:mt-6`,
      spacing: `${CONTAINER_GAPS.md}`
    }
  },
  videoHighlight: {
    base: 'w-full h-screen',
    flex: `flex flex-col h-full justify-center space-y-4 ${CONTAINER_GAPS.md} ${CONTAINER_SIZES.md}`,
    content: {
      base: `relative z-10 mx-auto flex h-full ${CONTAINER_LAYOUTS.flex.col} md:${CONTAINER_LAYOUTS.flex.row}`,
      left: `md:w-1/2 ${CONTAINER_LAYOUTS.flex.col} justify-center`,
      right: `md:w-1/2 flex h-full ${CONTAINER_OVERFLOW.hidden} ${CONTAINER_SIZES.sm} md:${CONTAINER_SIZES.md} lg:${CONTAINER_SIZES.lg} ${UI_LAYOUT.padding.lg}`
    },
    text: {
      base: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.title}`,
      title: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.title} text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight`,
      subtitle: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.subtitle} text-base md:text-lg mb-4 md:mb-6 italic`,
      description: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.description} text-sm md:text-base lg:text-lg mb-6 md:mb-8`
    },
    item: {
      base: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.item} mb-4 space-y-2`,
      list: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.item} flex items-start gap-3`,
      unordered: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.item} mb-4 space-y-2`
    },
    scrollableImage: {
      left: 'w-1/2 h-full',
      right: 'w-1/2 h-full'
    }
  },
  experience: {
    base: 'w-full h-screen',
    backgroundPatternImageUrl: 'https://res.cloudinary.com/gordonramsay/image/upload/c_fill,w_1920,h_640,q_auto,f_auto/Gordon%20Ramsay%20Restaurants%20-%20NA/default-light-bg_dddsi4',
    flex: `flex flex-col h-full justify-center space-y-4 ${UI_LAYOUT.padding.lg} ${CONTAINER_GAPS.md} ${CONTAINER_SIZES.md}`,
    content: {
      base: `relative z-10 mx-auto flex h-full ${CONTAINER_LAYOUTS.flex.col} md:${CONTAINER_LAYOUTS.flex.row}`,
      left: `md:w-1/2 ${CONTAINER_LAYOUTS.flex.col} justify-center ${CONTAINER_SIZES.sm} md:${CONTAINER_SIZES.md} lg:${CONTAINER_SIZES.lg} ${UI_LAYOUT.padding.lg}`,
      right: `md:w-1/2 flex h-full ${CONTAINER_OVERFLOW.hidden}`
    },
    text: {
      base: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.title}`,
      title: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.title} text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight`,
      subtitle: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.subtitle} text-base md:text-lg mb-4 md:mb-6`,
      description: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.description} text-sm md:text-base lg:text-lg mb-6 md:mb-8`
    },
    scrollableImage: {
      left: 'w-1/2 h-full',
      right: 'w-1/2 h-full'
    }
  },
  chef: {
    base: 'w-full h-screen',
    imageUrl: {
      chef: "https://absteakjkt.com/wp-content/uploads/2024/01/ACR07440-683x1024.jpg",
      pattern: 'https://res.cloudinary.com/gordonramsay/image/upload/c_fill,w_1920,h_640,q_auto,f_auto/Gordon%20Ramsay%20Restaurants%20-%20NA/default-light-bg_dddsi4'
    },
    flex: `flex flex-col h-full justify-center space-y-4 ${UI_LAYOUT.padding.lg} ${CONTAINER_GAPS.md} ${CONTAINER_SIZES.md}`,
    content: {
      base: `relative z-10 mx-auto flex h-full ${CONTAINER_LAYOUTS.flex.col} md:${CONTAINER_LAYOUTS.flex.row}`,
      left: `md:w-1/2 ${CONTAINER_LAYOUTS.flex.col} justify-center`,
      right: `md:w-1/2 flex h-full ${CONTAINER_OVERFLOW.hidden} ${CONTAINER_SIZES.sm} md:${CONTAINER_SIZES.md} lg:${CONTAINER_SIZES.lg} ${UI_LAYOUT.padding.base}`
    },
    text: {
      base: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.title}`,
      title: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.title} text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight`,
      subtitle: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.subtitle} text-base md:text-lg mb-4 md:mb-6 italic`,
      description: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.description} text-sm md:text-base lg:text-lg mb-6 md:mb-8 leading-relaxed`
    },
    image: {
      base: 'w-full h-full object-cover group-hover:scale-110 transition-all duration-500'
    }
  },
  menu: {
    base: 'w-full h-screen relative overflow-hidden',
    overlay: {
      first: 'absolute inset-0 bg-gradient-to-r from-black/85 via-black/75 to-black/65',
      second: 'absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70'
    },
    flex: `flex flex-col h-full justify-center space-y-4 ${UI_LAYOUT.padding.lg} ${CONTAINER_GAPS.md} ${CONTAINER_SIZES.md}`,
    content: {
      base: `relative z-10 mx-auto flex h-full ${CONTAINER_LAYOUTS.flex.col} md:${CONTAINER_LAYOUTS.flex.row}`,
      left: `md:w-1/2 ${CONTAINER_LAYOUTS.flex.col} justify-center ${CONTAINER_SIZES.sm} md:${CONTAINER_SIZES.md} lg:${CONTAINER_SIZES.lg} ${UI_LAYOUT.padding.lg}`,
      right: `md:w-1/2 flex h-full ${CONTAINER_OVERFLOW.hidden}`
    },
    text: {
      base: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.elegant.title}`,
      title: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.elegant.title} text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight`,
      subtitle: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.elegant.subtitle} text-base md:text-lg mb-4 md:mb-6`,
      description: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.elegant.description} text-sm md:text-base lg:text-lg mb-6 md:mb-8`
    },
    category: {
      base: 'mb-6 md:mb-8 flex flex-wrap gap-3 md:gap-4',
      tab: `${CONTAINER_RESPONSIVE.text.base} rounded-full px-4 md:px-6 py-2 md:py-3 font-semibold shadow-lg ${UI_TRANSITIONS.base}`
    },
    item: {
      base: 'custom-scrollbar max-h-80 md:max-h-96 space-y-3 md:space-y-4 overflow-y-auto',
      list: {
        base: `w-full cursor-pointer ${CONTAINER_RADIUS.md} border border-gray-700/50 bg-gray-900/60 ${CONTAINER_SIZES.md} md:p-5 text-left ${CONTAINER_SHADOWS.xl} backdrop-blur-sm ${UI_TRANSITIONS.base} hover:border-amber-400/30 hover:bg-gray-800/70 hover:${CONTAINER_SHADOWS['2xl']}`,
        title: `${CONTAINER_RESPONSIVE.text.base} mb-2 text-lg md:text-xl font-bold ${UI_TEXTS.elegant.title} drop-shadow-lg`,
        description: `${CONTAINER_RESPONSIVE.text.base} mb-2 text-xs md:text-sm leading-relaxed text-gray-200 drop-shadow-sm`,
        price: `${CONTAINER_RESPONSIVE.text.base} text-xl md:text-2xl font-bold text-amber-400 drop-shadow-lg`
      }
    },
    scrollableImage: {
      left: 'w-1/2 h-full',
      right: 'w-1/2 h-full'
    }
  },
  footer: {
    base: 'w-full h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden',
    background: {
      base: 'absolute inset-0',
      first: 'absolute top-0 left-0 h-96 w-96 rounded-full bg-gradient-to-br from-amber-400/10 to-orange-400/10 blur-3xl',
      second: 'absolute bottom-0 right-0 h-96 w-96 rounded-full bg-gradient-to-tl from-orange-400/10 to-amber-400/10 blur-3xl'
    },
    flex: 'flex flex-col md:flex-row h-full',
    content: {
      base: `relative z-10 mx-auto flex h-full ${CONTAINER_LAYOUTS.flex.col} md:${CONTAINER_LAYOUTS.flex.row}`,
      left: `md:w-1/2 ${CONTAINER_LAYOUTS.flex.col} justify-center ${CONTAINER_SIZES.sm} md:${CONTAINER_SIZES.md} lg:${CONTAINER_SIZES.lg}`,
      right: `md:w-1/2 flex h-full ${CONTAINER_OVERFLOW.hidden}`
    },
    text: {
      base: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.elegant.title}`,
      title: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.elegant.title} text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight`,
      subtitle: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.elegant.subtitle} text-base md:text-lg mb-4 md:mb-6`,
      description: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.elegant.description} text-sm md:text-base lg:text-lg mb-6 md:mb-8`
    },
    map: {
      base: 'relative z-10 border-b border-gray-700/50',
      section: `relative z-10 border-b border-gray-700/50 ${UI_LAYOUT.padding.base} ${UI_LAYOUT.padding.md} ${UI_LAYOUT.padding.lg} ${UI_LAYOUT.padding.xl} py-8 md:py-10`,
      content: {
        base: `${CONTAINER_LAYOUTS.grid.cols1} lg:${CONTAINER_LAYOUTS.grid.cols2} gap-8 md:gap-12 items-center`,
        info: {
          base: 'space-y-4 md:space-y-6 mb-4 md:mb-6 flex flex-col gap-3 md:gap-4',
          title: `${CONTAINER_RESPONSIVE.text.base} text-2xl md:text-3xl lg:text-4xl font-bold ${UI_TEXTS.elegant.title} drop-shadow-lg`,
          description: `${CONTAINER_RESPONSIVE.text.base} text-xs md:text-sm leading-relaxed text-gray-200 drop-shadow-sm`,
          location: {
            base: `${CONTAINER_LAYOUTS.flex.col} flex-wrap ${CONTAINER_RADIUS.lg} ${CONTAINER_OVERFLOW.hidden}`,
            address: {
              title: `${CONTAINER_RESPONSIVE.text.base} text-xs md:text-sm leading-relaxed text-gray-200 drop-shadow-sm`,
              content: `${CONTAINER_RESPONSIVE.text.base} text-xs md:text-sm leading-relaxed text-gray-200 drop-shadow-sm`
            },
            phone: {
              title: `${CONTAINER_RESPONSIVE.text.base} text-xs md:text-sm leading-relaxed text-gray-200 drop-shadow-sm`,
              content: `${CONTAINER_RESPONSIVE.text.base} text-xs md:text-sm leading-relaxed text-gray-200 drop-shadow-sm`,
              call: `${CONTAINER_RESPONSIVE.text.base} text-xs md:text-sm leading-relaxed text-gray-200 drop-shadow-sm`
            }
          }
        },
        interactive: {
          base: 'relative',
          placeholder: `bg-gray-800/50 ${CONTAINER_RADIUS.lg} ${CONTAINER_OVERFLOW.hidden} ${CONTAINER_BORDERS.thin} border-gray-700/50 ${CONTAINER_SHADOWS['2xl']}`,
          pattern: {
            background: 'absolute inset-0 opacity-20',
            marker: 'relative z-10 flex flex-col items-center'
          },
          control: {
              base: 'p-3 md:p-4 bg-gray-800/80 border-t border-gray-700/50',
              wrapper: 'flex justify-between items-center',
              button: {
                base: `flex ${CONTAINER_GAPS.sm} md:${CONTAINER_GAPS.md} items-center`,
                direction: `px-2 md:px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs md:text-sm ${CONTAINER_RADIUS.sm} ${UI_TRANSITIONS.colors}`,
                view: `px-2 md:px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs md:text-sm ${CONTAINER_RADIUS.sm} ${UI_TRANSITIONS.colors}`
              },
              address: 'text-xs md:text-sm text-gray-300'
            }
        }
      }
    },
    main: {
      section: `relative h-full ${UI_LAYOUT.padding.base} ${UI_LAYOUT.padding.md} ${UI_LAYOUT.padding.lg} ${UI_LAYOUT.padding.xl} py-8 md:py-10`,
      container: `mx-auto ${UI_LAYOUT.maxWidth.content}`,
      grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${CONTAINER_GAPS.lg} mb-8`,
      info: {
        base: `lg:col-span-2 ${CONTAINER_GAPS.lg}`,
        tagline: `text-amber-400 text-lg font-semibold mb-4`,
        description: `text-gray-300 text-base leading-relaxed`
      },
      newsletter: {
        base: `${CONTAINER_LAYOUTS.flex.col} ${CONTAINER_GAPS.lg}`,
        title: `text-xl font-bold text-white mb-2`,
        description: `text-gray-300 text-sm leading-relaxed`,
        form: `space-y-4 gap-8`,
        input: `bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-amber-400`,
        button: `w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-0 font-semibold transition-all duration-300 hover:scale-105`,
        social: `flex justify-start items-start space-x-4`
      }
    }
  }
}

// Pre-built container combinations
export const CONTAINER_PRESETS = {
  // Card containers
  card: {
    default: `${CONTAINER_VARIANTS.default.base} ${CONTAINER_VARIANTS.default.shadow} ${CONTAINER_VARIANTS.default.border} ${CONTAINER_VARIANTS.default.radius} ${CONTAINER_SIZES.lg}`,
    elegant: `${CONTAINER_VARIANTS.elegant.base} ${CONTAINER_VARIANTS.elegant.shadow} ${CONTAINER_VARIANTS.elegant.border} ${CONTAINER_VARIANTS.elegant.radius} ${CONTAINER_SIZES.lg}`,
    minimal: `${CONTAINER_VARIANTS.minimal.base} ${CONTAINER_VARIANTS.minimal.shadow} ${CONTAINER_VARIANTS.minimal.border} ${CONTAINER_VARIANTS.minimal.radius} ${CONTAINER_SIZES.lg}`,
    blur: `${CONTAINER_VARIANTS.blur.base} ${CONTAINER_VARIANTS.blur.shadow} ${CONTAINER_VARIANTS.blur.border} ${CONTAINER_VARIANTS.blur.radius} ${CONTAINER_SIZES.sm}`
  },
  
  // Modal containers
  modal: {
    default: `${CONTAINER_VARIANTS.default.base} ${CONTAINER_SHADOWS['2xl']} ${CONTAINER_BORDERS.thin} ${CONTAINER_RADIUS.lg} ${CONTAINER_SIZES.xl}`,
    elegant: `${CONTAINER_VARIANTS.elegant.base} ${CONTAINER_SHADOWS['2xl']} ${CONTAINER_BORDERS.thin} ${CONTAINER_RADIUS.lg} ${CONTAINER_SIZES.xl}`,
    minimal: `${CONTAINER_VARIANTS.minimal.base} ${CONTAINER_SHADOWS['2xl']} ${CONTAINER_BORDERS.thin} ${CONTAINER_RADIUS.lg} ${CONTAINER_SIZES.xl}`,
    blur: `${CONTAINER_VARIANTS.blur.base} ${CONTAINER_SHADOWS['2xl']} ${CONTAINER_BORDERS.thin} ${CONTAINER_RADIUS.lg} ${CONTAINER_SIZES.lg}`
  },

  // Wrapper containers
  wrapper: {
    default: `${CONTAINER_VARIANTS.default.base} ${CONTAINER_VARIANTS.default.radius} ${CONTAINER_SHADOWS.md} ${CONTAINER_BORDERS.thin} ${CONTAINER_RADIUS.md} ${CONTAINER_SIZES.md}`,
    elegant: `${CONTAINER_VARIANTS.elegant.base} ${CONTAINER_VARIANTS.elegant.radius} ${CONTAINER_SHADOWS.md} ${CONTAINER_BORDERS.thin} ${CONTAINER_RADIUS.md} ${CONTAINER_SIZES.md}`,
    minimal: `${CONTAINER_VARIANTS.minimal.base} ${CONTAINER_VARIANTS.minimal.radius} ${CONTAINER_SHADOWS.md} ${CONTAINER_BORDERS.thin} ${CONTAINER_RADIUS.md} ${CONTAINER_SIZES.md}`,
    blur: `${CONTAINER_VARIANTS.blur.base} ${CONTAINER_VARIANTS.blur.radius} ${CONTAINER_SHADOWS.md} ${CONTAINER_BORDERS.thin} ${CONTAINER_RADIUS.md} ${CONTAINER_SIZES.md}`,
  },
  
  // Panel containers
  panel: {
    default: `${CONTAINER_VARIANTS.default.base} ${CONTAINER_VARIANTS.default.radius} ${CONTAINER_SHADOWS.md} ${CONTAINER_BORDERS.thin} ${CONTAINER_RADIUS.md} ${CONTAINER_SIZES.md}`,
    elegant: `${CONTAINER_VARIANTS.elegant.base} ${CONTAINER_VARIANTS.elegant.radius} ${CONTAINER_SHADOWS.md} ${CONTAINER_BORDERS.thin} ${CONTAINER_RADIUS.md} ${CONTAINER_SIZES.md}`,
    minimal: `${CONTAINER_VARIANTS.minimal.base} ${CONTAINER_VARIANTS.minimal.radius} ${CONTAINER_SHADOWS.md} ${CONTAINER_BORDERS.thin} ${CONTAINER_RADIUS.md} ${CONTAINER_SIZES.md}`,
    blur: `${CONTAINER_VARIANTS.blur.base} ${CONTAINER_VARIANTS.blur.radius} ${CONTAINER_SHADOWS.md} ${CONTAINER_BORDERS.thin} ${CONTAINER_RADIUS.md} ${CONTAINER_SIZES.sm}`
  },
  
  // Dropdown containers
  dropdown: {
    default: `${CONTAINER_VARIANTS.default.base} ${CONTAINER_SHADOWS.xl} ${CONTAINER_BORDERS.thin} ${CONTAINER_RADIUS.md} ${CONTAINER_SIZES.sm}`,
    elegant: `${CONTAINER_VARIANTS.elegant.base} ${CONTAINER_SHADOWS.xl} ${CONTAINER_BORDERS.thin} ${CONTAINER_RADIUS.md} ${CONTAINER_SIZES.sm}`,
    minimal: `${CONTAINER_VARIANTS.minimal.base} ${CONTAINER_SHADOWS.xl} ${CONTAINER_BORDERS.thin} ${CONTAINER_RADIUS.md} ${CONTAINER_SIZES.sm}`,
    blur: `${CONTAINER_VARIANTS.blur.base} ${CONTAINER_SHADOWS.xl} ${CONTAINER_BORDERS.thin} ${CONTAINER_RADIUS.md} ${CONTAINER_SIZES.xs}`
  },

  positioned: {
    leftCenter: `fixed left-${UI_LAYOUT.positioned.gap} top-1/2 z-20 -translate-y-1/2`,
    rightCenter: `fixed right-${UI_LAYOUT.positioned.gap} top-1/2 z-20 -translate-y-1/2`,
    topCenter: `fixed top-${UI_LAYOUT.positioned.gap} left-1/2 z-20 -translate-x-1/2`,
    bottomCenter: `fixed bottom-${UI_LAYOUT.positioned.gap} left-1/2 z-20 -translate-x-1/2`,
  }

} as const;

// Utility functions untuk membuat container custom
export const createContainer = (
  variant: keyof typeof CONTAINER_VARIANTS = 'default',
  size: keyof typeof CONTAINER_SIZES = 'md',
  radius: keyof typeof CONTAINER_RADIUS = 'md',
  shadow: keyof typeof CONTAINER_SHADOWS = 'md',
  layout?: string,
  gap?: keyof typeof CONTAINER_GAPS
): string => {
  const baseClasses: string[] = [
    CONTAINER_VARIANTS[variant].base,
    CONTAINER_SIZES[size],
    CONTAINER_RADIUS[radius],
    CONTAINER_SHADOWS[shadow],
    CONTAINER_BORDERS.thin
  ];
  
  if (layout) baseClasses.push(layout);
  if (gap) baseClasses.push(CONTAINER_GAPS[gap]);
  
  return baseClasses.join(' ');
};

// Container blur khusus sesuai permintaan
export const BLUR_CONTAINER = {
  // Container blur dengan flex column dan gap
  flexCol: `bg-primary-950/60 ${CONTAINER_LAYOUTS.flex.col} ${CONTAINER_GAPS.sm} ${CONTAINER_RADIUS.lg} ${CONTAINER_BORDERS.thin} border-white/20 ${CONTAINER_SIZES.sm} ${CONTAINER_SHADOWS.lg} backdrop-blur-lg`,
  
  // Variasi container blur lainnya
  flexRow: `bg-primary-950/60 ${CONTAINER_LAYOUTS.flex.row} ${CONTAINER_GAPS.sm} ${CONTAINER_RADIUS.lg} ${CONTAINER_BORDERS.thin} border-white/20 ${CONTAINER_SIZES.sm} ${CONTAINER_SHADOWS.lg} backdrop-blur-lg`,
  flexCenter: `bg-primary-950/60 ${CONTAINER_LAYOUTS.flex.center} ${CONTAINER_GAPS.sm} ${CONTAINER_RADIUS.lg} ${CONTAINER_BORDERS.thin} border-white/20 ${CONTAINER_SIZES.sm} ${CONTAINER_SHADOWS.lg} backdrop-blur-lg`,
  flexBetween: `bg-primary-950/60 ${CONTAINER_LAYOUTS.flex.between} ${CONTAINER_GAPS.sm} ${CONTAINER_RADIUS.lg} ${CONTAINER_BORDERS.thin} border-white/20 ${CONTAINER_SIZES.sm} ${CONTAINER_SHADOWS.lg} backdrop-blur-lg`,
  
  // Grid variations
  grid: `bg-primary-950/60 grid ${CONTAINER_GAPS.sm} ${CONTAINER_RADIUS.lg} ${CONTAINER_BORDERS.thin} border-white/20 ${CONTAINER_SIZES.sm} ${CONTAINER_SHADOWS.lg} backdrop-blur-lg`,
  gridCols2: `bg-primary-950/60 ${CONTAINER_LAYOUTS.grid.cols2} ${CONTAINER_GAPS.sm} ${CONTAINER_RADIUS.lg} ${CONTAINER_BORDERS.thin} border-white/20 ${CONTAINER_SIZES.sm} ${CONTAINER_SHADOWS.lg} backdrop-blur-lg`,
  gridCols3: `bg-primary-950/60 ${CONTAINER_LAYOUTS.grid.cols3} ${CONTAINER_GAPS.sm} ${CONTAINER_RADIUS.lg} ${CONTAINER_BORDERS.thin} border-white/20 ${CONTAINER_SIZES.sm} ${CONTAINER_SHADOWS.lg} backdrop-blur-lg`,
  
  // Size variations
  sm: `bg-primary-950/60 ${CONTAINER_LAYOUTS.flex.col} ${CONTAINER_GAPS.xs} ${CONTAINER_RADIUS.sm} ${CONTAINER_BORDERS.thin} border-white/20 ${CONTAINER_SIZES.xs} ${CONTAINER_SHADOWS.md} backdrop-blur-lg`,
  md: `bg-primary-950/60 ${CONTAINER_LAYOUTS.flex.col} ${CONTAINER_GAPS.sm} ${CONTAINER_RADIUS.lg} ${CONTAINER_BORDERS.thin} border-white/20 ${CONTAINER_SIZES.sm} ${CONTAINER_SHADOWS.lg} backdrop-blur-lg`,
  lg: `bg-primary-950/60 ${CONTAINER_LAYOUTS.flex.col} ${CONTAINER_GAPS.md} ${CONTAINER_RADIUS.lg} ${CONTAINER_BORDERS.thin} border-white/20 ${CONTAINER_SIZES.md} ${CONTAINER_SHADOWS.xl} backdrop-blur-lg`,
  xl: `bg-primary-950/60 ${CONTAINER_LAYOUTS.flex.col} ${CONTAINER_GAPS.lg} rounded-3xl ${CONTAINER_BORDERS.thin} border-white/20 ${CONTAINER_SIZES.lg} ${CONTAINER_SHADOWS['2xl']} backdrop-blur-lg`
} as const;

export type ContainerVariant = keyof typeof CONTAINER_VARIANTS;
export type ContainerSize = keyof typeof CONTAINER_SIZES;
export type ContainerRadius = keyof typeof CONTAINER_RADIUS;
export type ContainerShadow = keyof typeof CONTAINER_SHADOWS;
export type ContainerGap = keyof typeof CONTAINER_GAPS;
export type BlurContainerType = keyof typeof BLUR_CONTAINER;