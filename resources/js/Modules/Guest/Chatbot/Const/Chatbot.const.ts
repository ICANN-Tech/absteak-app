// Chatbot configuration constants
export const CHATBOT_CONFIG = {
  // Default props
  DEFAULT_POSITION: 'bottom-right' as const,
  DEFAULT_INITIAL_MESSAGE: 'Hi! How can I help you?',
  DEFAULT_PLACEHOLDER: 'Type your message...',
  DEFAULT_MENU_ITEMS: ['CS', 'Menu', 'Dine In', 'Dine Out'],
  
  // Animation settings
  ANIMATION: {
    SCALE_DURATION: 300,
    SCALE_DELAY: 300,
    SCALE_OUT_DURATION: 200,
    FLY_DURATION: 400,
    FLY_DELAY: 150,
    FLY_OUT_DURATION: 300,
    FLY_OFFSET: 40,
    MESSAGE_DELAY: 50,
    MESSAGE_DURATION: 300
  },
  
  // UI dimensions
  UI: {
    CHAT_WIDTH: 'w-92',
    CHAT_HEIGHT: 'h-[35rem]',
    HEADER_HEIGHT: 'h-32',
    MAX_WIDTH: 'max-w-[95vw]'
  },
  
  // Menu prompts
  MENU_PROMPTS: {
    CS: 'I need customer service assistance',
    Menu: 'Tell me about your menu and dishes',
    'Dine In': 'I want to dine in and make a reservation',
    'Dine Out': 'I want to order takeaway or delivery'
  },
  
  // Error messages
  ERROR_MESSAGES: {
    CONNECTION_FAILED: 'Unable to connect to chatbot service. Please try again later.',
    INITIALIZATION_FAILED: 'Failed to initialize chatbot. Please refresh the page.',
    SEND_MESSAGE_FAILED: 'Failed to send message. Please try again.'
  },
  
  // Status indicators
  STATUS: {
    ONLINE: 'Online',
    TYPING: 'Typing...',
    DISCONNECTED: 'Disconnected'
  }
} as const;

// Position type definition
export type ChatbotPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

// Position classes mapping
export const POSITION_CLASSES = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6'
} as const;

export const DIALOG_POSITION_CLASSES = {
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4'
} as const;

// CSS classes
export const CSS_CLASSES = {
  CHAT_BUTTON: 'shadow-lg hover:scale-110 transition-transform duration-200',
  CHAT_DIALOG: 'border-primary-200 fixed z-50 flex max-w-[95vw] flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl',
  HEADER_GRADIENT: 'from-primary-600 to-primary-500 relative overflow-hidden rounded-t-2xl bg-gradient-to-r',
  STATUS_INDICATOR: 'w-3 h-3 rounded-full animate-pulse',
  MENU_BUTTON_BASE: 'transform rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 hover:scale-105',
  INPUT_BASE: 'border-primary-300 focus:ring-primary-400 bg-primary-50 placeholder-primary-400 flex-1 rounded-full border px-4 py-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2',
  SEND_BUTTON: 'bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105 shadow-lg'
} as const;