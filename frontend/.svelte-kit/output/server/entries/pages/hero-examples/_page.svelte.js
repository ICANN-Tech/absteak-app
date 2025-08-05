import { h as head } from "../../../chunks/index2.js";
import { I as Index } from "../../../chunks/Index9.js";
function Example($$payload) {
  const customImages = [
    {
      url: "https://via.placeholder.com/1920x1080/FF6B6B/FFFFFF?text=Restaurant+1"
    },
    {
      url: "https://via.placeholder.com/1920x1080/4ECDC4/FFFFFF?text=Restaurant+2"
    },
    {
      url: "https://via.placeholder.com/1920x1080/45B7D1/FFFFFF?text=Restaurant+3"
    }
  ];
  const pizzaImages = [
    {
      url: "https://via.placeholder.com/1920x1080/F7DC6F/000000?text=Pizza+Special"
    },
    {
      url: "https://via.placeholder.com/1920x1080/BB8FCE/FFFFFF?text=Italian+Cuisine"
    }
  ];
  const fastImages = [
    {
      url: "https://via.placeholder.com/1920x1080/58D68D/FFFFFF?text=Fast+1"
    },
    {
      url: "https://via.placeholder.com/1920x1080/F8C471/000000?text=Fast+2"
    },
    {
      url: "https://via.placeholder.com/1920x1080/85C1E9/000000?text=Fast+3"
    }
  ];
  $$payload.out.push(`<div class="space-y-8"><h1 class="text-3xl font-bold text-center mb-8">Hero Carousel Examples</h1> <section class="svelte-16199ie"><h2 class="text-2xl font-semibold mb-4">1. Default Usage</h2> <div class="h-96">`);
  Index($$payload, {});
  $$payload.out.push(`<!----></div></section> <section class="svelte-16199ie"><h2 class="text-2xl font-semibold mb-4">2. Custom Images</h2> <div class="h-96">`);
  Index($$payload, {
    images: customImages,
    title: "Fine Dining",
    subtitle: "Experience",
    description: "Discover exceptional culinary artistry in an elegant atmosphere where every dish tells a story."
  });
  $$payload.out.push(`<!----></div></section> <section class="svelte-16199ie"><h2 class="text-2xl font-semibold mb-4">3. Pizza Restaurant Theme</h2> <div class="h-96">`);
  Index($$payload, {
    carouselId: "pizza-hero",
    images: pizzaImages,
    interval: 4e3,
    title: "Mario's",
    subtitle: "Pizzeria",
    description: "Authentic Italian pizza made with fresh ingredients and traditional recipes passed down through generations.",
    primaryButtonText: "View Menu",
    primaryButtonHref: "#pizza-menu",
    secondaryButtonText: "Order Now",
    secondaryButtonHref: "#order"
  });
  $$payload.out.push(`<!----></div></section> <section class="svelte-16199ie"><h2 class="text-2xl font-semibold mb-4">4. Fast Transition (2 seconds)</h2> <div class="h-96">`);
  Index($$payload, {
    carouselId: "fast-hero",
    images: fastImages,
    interval: 2e3,
    title: "Quick",
    subtitle: "Bites",
    description: "Fast, fresh, and delicious meals for people on the go.",
    primaryButtonText: "Quick Order",
    primaryButtonHref: "#quick-order",
    secondaryButtonText: "Locations",
    secondaryButtonHref: "#locations"
  });
  $$payload.out.push(`<!----></div></section></div>`);
}
function _page($$payload) {
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Hero Carousel Examples</title>`;
  });
  $$payload.out.push(`<main class="container mx-auto px-4 py-8">`);
  Example($$payload);
  $$payload.out.push(`<!----></main>`);
}
export {
  _page as default
};
