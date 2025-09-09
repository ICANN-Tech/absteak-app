/**
 * Navigation items configuration for the guest application
 * 
 * @module NavigationConstants
 */

export interface NavigationItem {
  name: string;
  href: string;
  external?: boolean;
}

/**
 * Main navigation items for the guest application
 */
export const navItems: NavigationItem[] = [
  {
    name: 'Home',
    href: '/'
  },
  {
    name: 'Menu',
    href: '/menu'
  },
  {
    name: 'Reservations',
    href: '/reservations'
  },
  {
    name: 'About',
    href: '/about'
  },
  {
    name: 'Contact',
    href: '/contact'
  }
];