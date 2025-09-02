# AB Steak Components Documentation

A comprehensive component library for the AB Steak application, built with Svelte and TypeScript. This library follows atomic design principles and provides reusable, well-documented components for building consistent user interfaces.

## Table of Contents

- [Global Components](#global-components)
- [Guest-Specific Components](#guest-specific-components)
- [General Guidelines](#general-guidelines)
- [Dependencies](#dependencies)
- [Version Compatibility](#version-compatibility)

## Global Components

Global components are shared across the entire application and provide fundamental UI elements that maintain consistency throughout different sections of the AB Steak platform.

### Atoms

#### Logo Component

**Location:** `Global/Atoms/Logo.svelte`

**Purpose:** Displays the AB Steak brand logo with configurable size and variant options.

**Props:**
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`) - Controls the logo size
- `variant`: `'full' | 'icon' | 'text'` (default: `'full'`) - Determines what parts of the logo to display
- `href`: `string` (default: `'/'`) - Link destination when logo is clicked

**Usage Example:**
```svelte
<script>
  import Logo from '@Components/Global/Atoms/Logo.svelte';
</script>

<!-- Full logo with medium size -->
<Logo size="md" variant="full" href="/" />

<!-- Icon only, large size -->
<Logo size="lg" variant="icon" />

<!-- Text only, small size -->
<Logo size="sm" variant="text" />
```

#### Flag Components

**Location:** `Global/Atoms/Flag/`

**Purpose:** Provides country flag icons for internationalization features.

**Available Flags:**
- `IndonesiaFlag.svelte` - Indonesian flag icon
- `JapanFlag.svelte` - Japanese flag icon
- `UnitedKingdomFlag.svelte` - UK flag icon

**Usage Example:**
```svelte
<script>
  import { IndonesiaFlag, JapanFlag, UnitedKingdomFlag } from '@Components/Global/Atoms/Flag';
</script>

<IndonesiaFlag />
<JapanFlag />
<UnitedKingdomFlag />
```

#### Icon Components

**Location:** `Global/Atoms/Icons/`

**Purpose:** Provides a collection of custom SVG icons used throughout the application.

**Available Icons:**
- `LogoIcon` - AB Steak logo icon
- `MapMarkerIcon` - Location marker icon
- `InstagramIcon` - Instagram social media icon
- `FacebookIcon` - Facebook social media icon
- `TwitterIcon` - Twitter social media icon
- `YoutubeIcon` - YouTube social media icon
- `TelephoneIcon` - Phone contact icon
- `EmailIcon` - Email contact icon
- `LeftMouseIcon` - Left mouse button icon
- `ScrollMouseIcon` - Mouse scroll indicator icon

**Usage Example:**
```svelte
<script>
  import { 
    LogoIcon, 
    MapMarkerIcon, 
    InstagramIcon, 
    FacebookIcon 
  } from '@Components/Global/Atoms/Icons';
</script>

<LogoIcon />
<MapMarkerIcon />
<InstagramIcon />
<FacebookIcon />
```

## Guest-Specific Components

Guest-specific components are designed for the public-facing sections of the application, providing specialized functionality for visitors and potential customers.

### Atoms

#### Button Component

**Location:** `Guest/Atoms/Button.svelte`

**Purpose:** A flexible button component built on top of Flowbite Svelte with enhanced TypeScript support and additional styling options.

**Props:**
- `variant`: `'primary' | 'danger' | 'success' | 'warning' | 'info'` (default: `'primary'`) - Button color variant
- `type`: `'button' | 'submit' | 'reset'` (default: `'button'`) - HTML button type
- `disabled`: `boolean` (default: `false`) - Disables the button
- `className`: `string` (default: `''`) - Additional CSS classes
- `href`: `string | undefined` (default: `undefined`) - If provided, renders as a link
- `pill`: `boolean` (default: `false`) - Applies pill/rounded styling
- `size`: `'xs' | 'sm' | 'md' | 'lg' | 'xl'` (default: `'md'`) - Button size
- `circle`: `boolean` (default: `false`) - Creates a circular button

**Usage Example:**
```svelte
<script>
  import Button from '@Components/Guest/Atoms/Button.svelte';
</script>

<!-- Primary button -->
<Button variant="primary">Click Me</Button>

<!-- Danger button with custom class -->
<Button variant="danger" className="mt-4">Delete</Button>

<!-- Link button -->
<Button href="/menu" variant="success">View Menu</Button>

<!-- Circle button -->
<Button circle size="lg" variant="info">+</Button>

<!-- Pill button -->
<Button pill variant="warning">Rounded</Button>
```

#### Backdrop Component

**Location:** `Guest/Atoms/Backdrop.svelte`

**Purpose:** Creates layered background effects with gradient overlays and optional background images.

**Props:**
- `imageUrl`: `string` (default: `''`) - Background image URL
- `opacity`: `number` (default: `0.4`) - Overlay opacity (0-1)

**Usage Example:**
```svelte
<script>
  import Backdrop from '@Components/Guest/Atoms/Backdrop.svelte';
</script>

<!-- Simple gradient backdrop -->
<Backdrop />

<!-- Backdrop with image -->
<Backdrop imageUrl="/images/restaurant-bg.jpg" opacity={0.6} />
```

#### Icon Component

**Location:** `Guest/Atoms/Icon.svelte`

**Purpose:** Generic icon wrapper component for guest-specific icons.

### Molecules

#### Navbar Component

**Location:** `Guest/Molecules/Navbar.svelte`

**Purpose:** Main navigation component with responsive design and mobile menu support.

**Props:**
- `transparent`: `boolean` (default: `false`) - Makes navbar background transparent
- `fixed`: `boolean` (default: `true`) - Fixes navbar to top of viewport

**Usage Example:**
```svelte
<script>
  import Navbar from '@Components/Guest/Molecules/Navbar.svelte';
</script>

<!-- Standard navbar -->
<Navbar />

<!-- Transparent navbar for hero sections -->
<Navbar transparent={true} />

<!-- Relative positioned navbar -->
<Navbar fixed={false} />
```

#### Card Components

**Location:** `Guest/Molecules/Card/`

**Available Cards:**
- `Branch.svelte` - Displays restaurant branch information
- `Outlet.svelte` - Shows outlet/seating area details with availability

**Outlet Card Usage Example:**
```svelte
<script>
  import OutletCard from '@Components/Guest/Molecules/Card/Outlet.svelte';
  
  const outlet = {
    id: '1',
    name: 'Main Dining',
    type: 'indoor',
    capacity: 50,
    available: true,
    priceRange: '$$'
  };
</script>

<OutletCard 
  {outlet} 
  selected={false} 
  onclick={(outlet) => console.log('Selected:', outlet)} 
/>
```

#### Button Components

**Location:** `Guest/Molecules/Button/`

**Available Buttons:**
- `Play.svelte` - Media play button with animation
- `ScrollToUp.svelte` - Scroll to top functionality button

#### Form Components

**Location:** `Guest/Molecules/Form/`

**Available Forms:**
- `BranchList.svelte` - Branch selection form
- `Payment.svelte` - Payment method selection form

#### Contact Components

**Location:** `Guest/Molecules/Contact/`

**Available Components:**
- `Detail.svelte` - Contact information display
- `SocialMedia.svelte` - Social media links component

#### Media Components

**Location:** `Guest/Molecules/Media/`

**Available Components:**
- `ScrollableImage.svelte` - Image gallery with scroll functionality
- `ThumbnailMedia.svelte` - Media thumbnail with preview
- `VideoOverlay.svelte` - Video player overlay component

#### Map Components

**Location:** `Guest/Molecules/Map/`

**Available Components:**
- `Control.svelte` - Map control interface
- `Landmark.svelte` - Map landmark markers

### Organisms

#### Layout Components

**Location:** `Guest/Organisme/Layout/`

**Available Layouts:**
- `Header.svelte` - Main header with hero section support
- `Footer.svelte` - Application footer
- `LanguageSwitch.svelte` - Language selection component
- `ScrollIndicator.svelte` - Page scroll progress indicator

**Header Usage Example:**
```svelte
<script>
  import Header from '@Components/Guest/Organisme/Layout/Header.svelte';
</script>

<!-- Header with hero section -->
<Header heroSection={true} transparent={true} />

<!-- Standard header -->
<Header fixed={true} />
```

## General Guidelines

### Component Implementation

1. **Import Path Aliases**: Use the configured path aliases for cleaner imports:
   ```svelte
   // ✅ Good
   import Button from '@Components/Guest/Atoms/Button.svelte';
   import { LogoIcon } from '@Components/Global/Atoms/Icons';
   
   // ❌ Avoid
   import Button from '../../../Components/Guest/Atoms/Button.svelte';
   ```

2. **TypeScript Usage**: All components support TypeScript. Define proper types for props:
   ```svelte
   <script lang="ts">
     type ButtonVariant = 'primary' | 'secondary' | 'danger';
     export let variant: ButtonVariant = 'primary';
   </script>
   ```

3. **Prop Documentation**: Always provide default values and document prop purposes:
   ```svelte
   <script lang="ts">
     // Controls the visual style of the button
     export let variant: ButtonVariant = 'primary';
     
     // Disables user interaction
     export let disabled: boolean = false;
   </script>
   ```

4. **Slot Usage**: Utilize slots for flexible content composition:
   ```svelte
   <Button variant="primary">
     <Icon name="plus" />
     Add Item
   </Button>
   ```

5. **Event Handling**: Use proper event dispatching for component communication:
   ```svelte
   <script>
     import { createEventDispatcher } from 'svelte';
     const dispatch = createEventDispatcher();
     
     function handleClick() {
       dispatch('click', { data: 'example' });
     }
   </script>
   ```

### Styling Guidelines

1. **Tailwind CSS**: Components use Tailwind CSS for styling. Follow the established design system.

2. **Responsive Design**: Ensure components work across different screen sizes:
   ```svelte
   <div class="flex flex-col md:flex-row lg:items-center">
     <!-- Content -->
   </div>
   ```

3. **Dark Mode Support**: Consider dark mode compatibility when applicable.

4. **Accessibility**: Include proper ARIA attributes and semantic HTML:
   ```svelte
   <button 
     type="button" 
     aria-label="Close dialog"
     class="..."
   >
     <Icon name="close" />
   </button>
   ```

### File Organization

1. **Atomic Design**: Components follow atomic design principles:
   - **Atoms**: Basic building blocks (buttons, inputs, icons)
   - **Molecules**: Simple combinations of atoms (navbar, cards)
   - **Organisms**: Complex combinations (headers, forms, layouts)

2. **Index Files**: Use index files for clean exports:
   ```typescript
   // Components/Guest/Atoms/Index.ts
   export { default as Button } from './Button.svelte';
   export { default as Icon } from './Icon.svelte';
   ```

3. **Naming Conventions**: Use PascalCase for component files and descriptive names.

## Dependencies

### Required Dependencies

- **Svelte**: ^4.0.0 - Core framework
- **TypeScript**: ^5.0.0 - Type safety
- **Tailwind CSS**: ^3.0.0 - Styling framework
- **Flowbite Svelte**: ^0.44.0 - UI component library
- **Flowbite Svelte Icons**: ^1.0.0 - Icon library

### Development Dependencies

- **@sveltejs/vite-plugin-svelte**: ^3.0.0 - Vite integration
- **@tailwindcss/vite**: ^4.0.0 - Tailwind Vite plugin
- **Vite**: ^5.0.0 - Build tool

### Installation

```bash
# Install required dependencies
npm install svelte typescript tailwindcss flowbite-svelte flowbite-svelte-icons

# Install development dependencies
npm install -D @sveltejs/vite-plugin-svelte @tailwindcss/vite vite
```

## Version Compatibility

| Component Library Version | Svelte Version | TypeScript Version | Tailwind CSS Version |
|---------------------------|----------------|--------------------|-----------------------|
| 1.0.x                     | ^4.0.0         | ^5.0.0             | ^3.0.0                |
| 1.1.x                     | ^4.2.0         | ^5.1.0             | ^3.3.0                |

### Breaking Changes

#### Version 1.1.0
- Updated Button component with improved TypeScript support
- Enhanced Flowbite integration with proper color typing
- Added new circle and pill button variants

### Migration Guide

When upgrading from version 1.0.x to 1.1.x:

1. Update Button component imports if using custom color props
2. Review TypeScript types for enhanced type safety
3. Test circle and pill button implementations

---

## Contributing

When contributing new components:

1. Follow the established atomic design structure
2. Include comprehensive TypeScript types
3. Add proper documentation and usage examples
4. Ensure responsive design and accessibility
5. Test across different browsers and devices

## Support

For questions or issues with components:

1. Check this documentation first
2. Review component source code for implementation details
3. Test with minimal reproduction cases
4. Follow the project's issue reporting guidelines

---

*Last updated: January 2025*
*Component Library Version: 1.1.0*