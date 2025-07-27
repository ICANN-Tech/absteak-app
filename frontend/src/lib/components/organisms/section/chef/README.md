# Chef Section Component

## Overview
The Chef Section component is a responsive layout component that showcases chef information with an image and biographical content. It's designed to highlight the chef's background, achievements, and philosophy in an elegant two-column layout.

## Features
- **Responsive Design**: Adapts seamlessly between mobile and desktop layouts
- **Image Display**: Features a prominent chef image on the left side
- **Content Area**: Dedicated space for chef name, quote, and biography
- **Professional Styling**: Uses warm color scheme with proper typography hierarchy
- **Full Height Layout**: Takes full screen height for impactful presentation

## Props
This component currently doesn't accept props and uses hardcoded content. Future versions may include:
- `chefName`: Chef's name
- `chefImage`: URL for chef's main image
- `quote`: Featured quote from the chef
- `biography`: Chef's biographical information
- `backgroundColor`: Custom background color

## Layout Structure
```
┌─────────────────────────────────────────┐
│                Section                  │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │             │  │                 │   │
│  │    Chef     │  │   Chef Name     │   │
│  │    Image    │  │   Quote         │   │
│  │             │  │   Biography     │   │
│  │             │  │                 │   │
│  └─────────────┘  └─────────────────┘   │
└─────────────────────────────────────────┘
```

## Styling
- **Background**: Warm cream color (`#fdf6ee`)
- **Typography**: Bold headings with readable body text
- **Spacing**: Generous padding and margins for clean layout
- **Responsive**: Stacks vertically on mobile, side-by-side on desktop

## Usage Examples
```svelte
<!-- Basic usage -->
<ChefSection />

<!-- Future usage with props -->
<ChefSection 
  chefName="Gordon Ramsay"
  chefImage="/images/chef-gordon.jpg"
  quote="Cooking is about passion, technique, and respect for ingredients."
  biography="World-renowned chef with multiple Michelin stars..."
/>
```

## Dependencies
- **Internal**: None
- **External**: Tailwind CSS for styling

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Touch-friendly interface

## Performance Considerations
- Images should be optimized for web
- Consider lazy loading for large images
- Use appropriate image formats (WebP, AVIF) when possible

## Accessibility
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images (to be implemented)
- Keyboard navigation support

## Future Enhancements
- Props support for dynamic content
- Multiple chef profiles support
- Animation effects
- Social media links integration
- Awards and achievements section