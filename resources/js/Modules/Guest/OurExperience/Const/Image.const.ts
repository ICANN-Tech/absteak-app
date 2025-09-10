/**
 * Image constants for the Our Experience section
 * 
 * @description Contains all image URLs and configurations used in the experience section
 * @version 1.0.0
 */

/**
 * Left column images for the experience section
 * These images will scroll upward with the animate-scroll-up animation
 */
export const EXPERIENCE_LEFT_COLUMN_IMAGES: string[] = [
	'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=600&fit=crop&q=80',
	'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop&q=80',
	'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=600&fit=crop&q=80',
	'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=600&fit=crop&q=80',
	'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=600&fit=crop&q=80'
];

/**
 * Right column images for the experience section
 * These images will scroll downward with the animate-scroll-down animation
 */
export const EXPERIENCE_RIGHT_COLUMN_IMAGES: string[] = [
	'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=600&fit=crop&q=80',
	'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=600&fit=crop&q=80',
	'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=600&fit=crop&q=80',
	'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=600&fit=crop&q=80',
	'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=600&fit=crop&q=80'
];

/**
 * Height classes for left column images
 * These classes control the varying heights of images in the left column
 */
export const EXPERIENCE_LEFT_COLUMN_HEIGHTS: string[] = [
	'h-48', // 192px
	'h-72', // 288px
	'h-56', // 224px
	'h-80', // 320px
	'h-64', // 256px
	'h-60'  // 240px
];

/**
 * Height classes for right column images
 * These classes control the varying heights of images in the right column
 */
export const EXPERIENCE_RIGHT_COLUMN_HEIGHTS: string[] = [
	'h-64', // 256px
	'h-52', // 208px
	'h-76', // 304px
	'h-68', // 272px
	'h-56', // 224px
	'h-72'  // 288px
];

/**
 * Animation classes for scrollable images
 */
export const EXPERIENCE_ANIMATION_CLASSES = {
	leftColumn: 'animate-scroll-up',
	rightColumn: 'animate-scroll-down'
} as const;

/**
 * Alt text configurations for accessibility
 */
export const EXPERIENCE_ALT_TEXT = {
	leftColumn: 'Culinary experience showcase',
	rightColumn: 'Restaurant ambiance and dishes'
} as const;