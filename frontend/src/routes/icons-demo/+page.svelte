<script lang="ts">
  import {
    LogoIcon,
    MapMarkerIcon,
    InstagramIcon,
    FacebookIcon,
    TwitterIcon,
    YoutubeIcon,
    TelephoneIcon,
    EmailIcon
  } from '$lib/components/atoms/icon';
</script>

<div class="p-8 space-y-8">
  <h1 class="text-3xl font-bold text-center mb-8">Icon Components Demo</h1>
  
  <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
    <div class="flex flex-col items-center space-y-2">
      <LogoIcon size="lg" className="text-blue-600" />
      <span class="text-sm font-medium">Logo</span>
    </div>
    
    <div class="flex flex-col items-center space-y-2">
      <MapMarkerIcon size="lg" className="text-red-600" />
      <span class="text-sm font-medium">Map Marker</span>
    </div>
    
    <div class="flex flex-col items-center space-y-2">
      <InstagramIcon size="lg" className="text-pink-600" />
      <span class="text-sm font-medium">Instagram</span>
    </div>
    
    <div class="flex flex-col items-center space-y-2">
      <FacebookIcon size="lg" className="text-blue-700" />
      <span class="text-sm font-medium">Facebook</span>
    </div>
    
    <div class="flex flex-col items-center space-y-2">
      <TwitterIcon size="lg" className="text-black" />
      <span class="text-sm font-medium">Twitter/X</span>
    </div>
    
    <div class="flex flex-col items-center space-y-2">
      <YoutubeIcon size="lg" className="text-red-600" />
      <span class="text-sm font-medium">YouTube</span>
    </div>
    
    <div class="flex flex-col items-center space-y-2">
      <TelephoneIcon size="lg" className="text-green-600" />
      <span class="text-sm font-medium">Telephone</span>
    </div>
    
    <div class="flex flex-col items-center space-y-2">
      <EmailIcon size="lg" className="text-gray-600" />
      <span class="text-sm font-medium">Email</span>
    </div>
  </div>
  
  <div class="mt-12">
    <h2 class="text-2xl font-bold mb-4">Size Variations</h2>
    <div class="flex items-center space-x-4">
      <div class="flex flex-col items-center space-y-2">
        <MapMarkerIcon size="sm" className="text-red-600" />
        <span class="text-xs">Small</span>
      </div>
      <div class="flex flex-col items-center space-y-2">
        <MapMarkerIcon size="md" className="text-red-600" />
        <span class="text-xs">Medium</span>
      </div>
      <div class="flex flex-col items-center space-y-2">
        <MapMarkerIcon size="lg" className="text-red-600" />
        <span class="text-xs">Large</span>
      </div>
      <div class="flex flex-col items-center space-y-2">
        <MapMarkerIcon size="xl" className="text-red-600" />
        <span class="text-xs">XL</span>
      </div>
      <div class="flex flex-col items-center space-y-2">
        <MapMarkerIcon size="2xl" className="text-red-600" />
        <span class="text-xs">2XL</span>
      </div>
    </div>
  </div>
</div>