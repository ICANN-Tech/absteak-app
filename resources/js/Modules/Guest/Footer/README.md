# Footer Module Documentation

## Overview

The Footer module is a comprehensive, modular footer component for the ABSteak application. It provides a clean, extensible architecture with proper separation of concerns, state management, and reusable components.

## Component Architecture

### Directory Structure

```
Footer/
├── Index.svelte                 # Main footer component
├── Parts/
│   └── Container/
│       ├── Newsletter.svelte     # Newsletter subscription component
│       ├── RestaurantInfo.svelte # Restaurant information display
│       └── SocialMedia.svelte    # Social media links component
├── Services/
│   └── Newsletter.service.ts     # Newsletter business logic and API communication
├── Stores/
│   └── Newsletter.store.ts       # Newsletter state management
└── README.md                     # This documentation
```

### Component Hierarchy

```
Footer (Index.svelte)
├── AnimateOnScroll
│   └── footer
│       ├── MapLocation
│       └── main content
│           ├── RestaurantInfo
│           ├── QuickLink
│           ├── Newsletter
│           │   └── SocialMedia
│           ├── SocialMedia
│           └── BottomBar
```

## Components

### 1. Footer/Index.svelte (Main Component)

**Purpose**: Main footer container that orchestrates all footer sections.

**Features**:
- Animated entrance with fade effect
- Responsive grid layout
- Map integration
- Modular component composition

**Dependencies**:
- `CONTAINER_SECTION` from `$lib/const`
- `createTranslationStore` from `$lib/utils/translation`
- Various UI components from `$lib/components`

### 2. Parts/Container/Newsletter.svelte

**Purpose**: Newsletter subscription form with state management.

**Features**:
- Email validation
- Loading states
- Error handling
- Success notifications
- Toast messages
- Integrated social media links

**Props**: None (uses global store)

**Events**: None (handled internally)

**State Management**: Uses `newsletterStore` for reactive state

### 3. Parts/Container/RestaurantInfo.svelte

**Purpose**: Displays restaurant branding and information.

**Features**:
- Logo display
- Restaurant tagline
- Description text
- Responsive layout

**Props**: None (uses translation store)

### 4. Parts/Container/SocialMedia.svelte

**Purpose**: Social media links component.

**Features**:
- Multiple platform support (Facebook, Twitter, Instagram, YouTube)
- Configurable URLs
- Consistent styling

**Configuration**:
```typescript
const socialLinks = {
  instagram: 'https://instagram.com/absteak',
  facebook: 'https://facebook.com/absteak',
  twitter: 'https://twitter.com/absteak',
  youtube: 'https://youtube.com/absteak'
};
```

## State Management

### Newsletter Store (Stores/Newsletter.store.ts)

**Purpose**: Manages newsletter subscription state and actions.

**State Interface**:
```typescript
interface NewsletterState {
  email: string;              // Current email input
  isSubscribing: boolean;     // Loading state
  error: string | null;       // Error message
  success: boolean;           // Success state
  lastResponse: NewsletterResponse | null; // Last API response
  isFormValid: boolean;       // Form validation state
}
```

**Actions**:
- `setEmail(email: string)` - Updates email and validates
- `validateEmail()` - Validates current email
- `subscribeToNewsletter()` - Submits subscription
- `reset()` - Resets to initial state
- `clearError()` - Clears error state
- `clearSuccess()` - Clears success state

**Usage**:
```typescript
import { newsletterStore } from './Stores/Newsletter.store';

// Subscribe to state changes
$: email = $newsletterStore.email;
$: isLoading = $newsletterStore.isSubscribing;
$: error = $newsletterStore.error;

// Update email
newsletterStore.setEmail('user@example.com');

// Submit subscription
await newsletterStore.subscribeToNewsletter();
```

## Services

### Newsletter Service (Services/Newsletter.service.ts)

**Purpose**: Handles newsletter business logic and API communication.

**Key Methods**:

#### `validateEmail(email: string): boolean`
Validates email format using regex pattern.

#### `subscribe(email: string): Promise<NewsletterResponse>`
Submits newsletter subscription (currently simulated).

#### `getEmailValidationError(email: string): Promise<string | null>`
Returns validation error message or null if valid.

**Response Interface**:
```typescript
interface NewsletterResponse {
  success: boolean;
  message: string;
  data?: NewsletterSubscription;
}

interface NewsletterSubscription {
  email: string;
  timestamp: Date;
}
```

**Error Handling**:
- Email format validation
- Required field validation
- Network error handling
- User-friendly error messages

## Usage Instructions

### Basic Implementation

```svelte
<script>
  import Footer from './Modules/Guest/Footer/Index.svelte';
</script>

<Footer />
```

### Customizing Social Media Links

Edit `Parts/Container/SocialMedia.svelte`:

```typescript
const socialLinks = {
  instagram: 'https://instagram.com/yourhandle',
  facebook: 'https://facebook.com/yourpage',
  twitter: 'https://twitter.com/yourhandle',
  youtube: 'https://youtube.com/yourchannel'
};
```

### Newsletter Integration

The newsletter functionality is ready to integrate with your backend API. Update the `subscribe` method in `Newsletter.service.ts`:

```typescript
static async subscribe(email: string): Promise<NewsletterResponse> {
  try {
    const response = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Network error. Please try again.'
    };
  }
}
```

### Translation Integration

The components use translation keys. Ensure your translation system includes:

```json
{
  "footer": {
    "newsletter": {
      "title": "Subscribe to Our Newsletter",
      "description": "Get the latest updates and offers",
      "forms": {
        "email": {
          "placeholder": "Enter your email",
          "validation": {
            "required": "Email is required",
            "email": "Please enter a valid email address"
          }
        },
        "submit": {
          "label": "Subscribe",
          "loadingLabel": "Subscribing..."
        },
        "message": {
          "success": "Successfully subscribed!",
          "error": "Failed to subscribe. Please try again."
        }
      }
    },
    "restaurant": {
      "title": "Visit Our Restaurant",
      "description": "Experience premium steaks in Jakarta"
    },
    "tagline": {
      "title": "ABSteak Restaurant",
      "description": "Premium steaks and exceptional dining experience"
    }
  }
}
```

## Styling

The components use `CONTAINER_SECTION.footer` classes for styling. Ensure your CSS includes:

- `.footer.base` - Main footer container
- `.footer.background` - Background decorative elements
- `.footer.map.section` - Map section styling
- `.footer.main.grid` - Main content grid
- `.footer.main.newsletter` - Newsletter section styling
- `.footer.main.info` - Restaurant info styling

## Best Practices

1. **Modular Design**: Each component has a single responsibility
2. **State Management**: Centralized state with reactive updates
3. **Error Handling**: Comprehensive error handling with user feedback
4. **Accessibility**: Proper form labels and ARIA attributes
5. **Performance**: Lazy loading and efficient reactivity
6. **Maintainability**: Clear separation of concerns and documentation

## Testing

To test the footer functionality:

1. **Newsletter Subscription**:
   - Test email validation
   - Test form submission
   - Test error states
   - Test success states
   - Test loading states

2. **Responsive Design**:
   - Test on different screen sizes
   - Verify grid layout adaptation
   - Check mobile navigation

3. **Integration**:
   - Test with translation system
   - Test with styling system
   - Test component composition

## Future Enhancements

1. **Analytics Integration**: Track newsletter subscriptions
2. **A/B Testing**: Test different newsletter copy
3. **Social Media Integration**: Dynamic social media feeds
4. **Accessibility**: Enhanced screen reader support
5. **Performance**: Implement virtual scrolling for large lists
6. **Internationalization**: Multi-language support

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure all paths use correct capitalization
2. **Translation Errors**: Verify translation keys exist
3. **Styling Issues**: Check CSS class names match `CONTAINER_SECTION`
4. **State Issues**: Verify store subscriptions are properly set up

### Debug Mode

Enable console logging in `Newsletter.store.ts` by uncommenting debug statements:

```typescript
console.log('setEmail called with:', email);
console.log('Previous state:', state);
console.log('New state:', newState);
```

## Contributing

When contributing to the footer module:

1. Follow the established naming conventions (capitalized folders)
2. Maintain the modular architecture
3. Add proper TypeScript types
4. Include comprehensive error handling
5. Update this documentation
6. Add appropriate tests

---

*Last updated: January 2025*