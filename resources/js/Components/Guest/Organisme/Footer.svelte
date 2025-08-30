<script>
  import Logo from '../Atoms/Logo.svelte';
  import Icon from '../Atoms/Icon.svelte';
  import Button from '../Atoms/Button.svelte';
  
  const currentYear = new Date().getFullYear();
  
  const footerSections = {
    company: {
      title: 'ABSteak',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Story', href: '/story' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' }
      ]
    },
    services: {
      title: 'Services',
      links: [
        { name: 'Dine In', href: '/menu' },
        { name: 'Private Events', href: '/events' },
        { name: 'Catering', href: '/catering' },
        { name: 'Gift Cards', href: '/gift-cards' }
      ]
    },
    support: {
      title: 'Support',
      links: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'Reservations', href: '/reservations' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Feedback', href: '/feedback' }
      ]
    }
  };
  
  const socialLinks = [
    { name: 'Facebook', href: '#', icon: 'user' },
    { name: 'Instagram', href: '#', icon: 'user' },
    { name: 'Twitter', href: '#', icon: 'user' },
    { name: 'LinkedIn', href: '#', icon: 'user' }
  ];
  
  const contactInfo = {
    address: '123 Steakhouse Avenue, Culinary District, CD 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@absteak.com',
    hours: 'Mon-Thu: 5PM-10PM | Fri-Sat: 5PM-11PM | Sun: 4PM-9PM'
  };
</script>

<footer class="bg-gray-900 text-white">
  <!-- Main Footer Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <!-- Company Info -->
      <div class="lg:col-span-1">
        <div class="mb-6">
          <Logo size="lg" variant="full" />
        </div>
        <p class="text-gray-300 mb-6 leading-relaxed">
          Experience the finest steakhouse dining with premium cuts, exceptional service, and an unforgettable atmosphere.
        </p>
        
        <!-- Contact Info -->
        <div class="space-y-3 text-sm text-gray-300">
          <div class="flex items-start space-x-3">
            <Icon name="location" size="sm" color="#ef4444" />
            <span>{contactInfo.address}</span>
          </div>
          <div class="flex items-center space-x-3">
            <Icon name="phone" size="sm" color="#ef4444" />
            <a href="tel:{contactInfo.phone}" class="hover:text-red-400 transition-colors">
              {contactInfo.phone}
            </a>
          </div>
          <div class="flex items-center space-x-3">
            <Icon name="email" size="sm" color="#ef4444" />
            <a href="mailto:{contactInfo.email}" class="hover:text-red-400 transition-colors">
              {contactInfo.email}
            </a>
          </div>
          <div class="flex items-start space-x-3">
            <Icon name="clock" size="sm" color="#ef4444" />
            <span>{contactInfo.hours}</span>
          </div>
        </div>
      </div>
      
      <!-- Footer Links -->
      {#each Object.entries(footerSections) as [key, section]}
        <div>
          <h3 class="text-lg font-semibold mb-4 text-red-400">{section.title}</h3>
          <ul class="space-y-2">
            {#each section.links as link}
              <li>
                <a 
                  href={link.href} 
                  class="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {link.name}
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
    
    <!-- Newsletter Signup -->
    <div class="mt-12 pt-8 border-t border-gray-800">
      <div class="max-w-md mx-auto text-center lg:max-w-none lg:text-left">
        <h3 class="text-lg font-semibold mb-4 text-red-400">Stay Updated</h3>
        <p class="text-gray-300 mb-4 text-sm">
          Subscribe to our newsletter for exclusive offers and culinary updates.
        </p>
        <div class="flex flex-col sm:flex-row gap-3">
          <input 
            type="email" 
            placeholder="Enter your email" 
            class="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <Button variant="primary" size="md">
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Bottom Footer -->
  <div class="border-t border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <!-- Copyright -->
        <div class="text-sm text-gray-400">
          © {currentYear} ABSteak. All rights reserved.
        </div>
        
        <!-- Social Links -->
        <div class="flex space-x-4">
          {#each socialLinks as social}
            <a 
              href={social.href} 
              class="text-gray-400 hover:text-red-400 transition-colors"
              aria-label={social.name}
            >
              <Icon name={social.icon} size="md" />
            </a>
          {/each}
        </div>
        
        <!-- Legal Links -->
        <div class="flex space-x-6 text-sm text-gray-400">
          <a href="/privacy" class="hover:text-white transition-colors">Privacy Policy</a>
          <a href="/terms" class="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </div>
</footer>