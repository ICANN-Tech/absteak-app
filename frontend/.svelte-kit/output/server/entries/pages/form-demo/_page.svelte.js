import { y as copy_payload, z as assign_payload, h as head, e as escape_html } from "../../../chunks/index2.js";
import { I as Index, a as Index$1 } from "../../../chunks/Index8.js";
function _page($$payload) {
  let inputValue = "";
  let emailValue = "";
  let passwordValue = "";
  let dropdownValue = "";
  let searchableDropdownValue = "";
  const countryOptions = [
    { value: "id", label: "Indonesia" },
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "jp", label: "Japan" },
    { value: "kr", label: "South Korea" },
    { value: "sg", label: "Singapore" },
    { value: "my", label: "Malaysia" },
    { value: "th", label: "Thailand" },
    { value: "vn", label: "Vietnam" },
    { value: "ph", label: "Philippines" }
  ];
  const categoryOptions = [
    { value: "starters", label: "Starters" },
    { value: "mains", label: "Main Courses" },
    { value: "desserts", label: "Desserts" },
    { value: "beverages", label: "Beverages" },
    { value: "wine", label: "Wine Selection" }
  ];
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    head($$payload2, ($$payload3) => {
      $$payload3.title = `<title>Form Components Demo - Restaurant</title>`;
    });
    $$payload2.out.push(`<div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black svelte-1hichns"><div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/75 to-black/65 svelte-1hichns"></div> <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 svelte-1hichns"></div> <div class="relative z-10 container mx-auto px-6 py-12 svelte-1hichns"><div class="text-center mb-12 svelte-1hichns"><h1 class="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-2xl svelte-1hichns">FORM <span class="text-amber-400 drop-shadow-lg svelte-1hichns">COMPONENTS</span></h1> <p class="text-gray-200 text-lg drop-shadow-lg leading-relaxed max-w-2xl mx-auto svelte-1hichns">Elegant and reusable input and dropdown components with beautiful styling</p></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto svelte-1hichns"><div class="bg-gray-900/60 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 shadow-2xl svelte-1hichns"><h2 class="text-2xl font-bold text-white mb-6 drop-shadow-lg svelte-1hichns">Input Components</h2> <div class="space-y-6 svelte-1hichns">`);
    Index($$payload2, {
      label: "Full Name",
      placeholder: "Enter your full name",
      variant: "elegant",
      required: true,
      get value() {
        return inputValue;
      },
      set value($$value) {
        inputValue = $$value;
        $$settled = false;
      }
    });
    $$payload2.out.push(`<!----> `);
    Index($$payload2, {
      label: "Email Address",
      type: "email",
      placeholder: "your.email@example.com",
      variant: "elegant",
      icon: "fas fa-envelope",
      required: true,
      get value() {
        return emailValue;
      },
      set value($$value) {
        emailValue = $$value;
        $$settled = false;
      }
    });
    $$payload2.out.push(`<!----> `);
    Index($$payload2, {
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
      variant: "elegant",
      icon: "fas fa-lock",
      required: true,
      get value() {
        return passwordValue;
      },
      set value($$value) {
        passwordValue = $$value;
        $$settled = false;
      }
    });
    $$payload2.out.push(`<!----> `);
    Index($$payload2, {
      label: "Phone Number",
      type: "tel",
      placeholder: "+62 812 3456 7890",
      value: "+62 812 3456 7890",
      variant: "elegant",
      icon: "fas fa-phone",
      success: "Phone number verified!",
      readonly: true
    });
    $$payload2.out.push(`<!----> `);
    Index($$payload2, {
      label: "Website URL",
      type: "url",
      placeholder: "https://example.com",
      value: "invalid-url",
      variant: "elegant",
      icon: "fas fa-globe",
      error: "Please enter a valid URL"
    });
    $$payload2.out.push(`<!----></div></div> <div class="bg-gray-900/60 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 shadow-2xl svelte-1hichns"><h2 class="text-2xl font-bold text-white mb-6 drop-shadow-lg svelte-1hichns">Dropdown Components</h2> <div class="space-y-6 svelte-1hichns">`);
    Index$1($$payload2, {
      label: "Country",
      placeholder: "Select your country",
      options: countryOptions,
      variant: "elegant",
      icon: "fas fa-flag",
      required: true,
      get value() {
        return dropdownValue;
      },
      set value($$value) {
        dropdownValue = $$value;
        $$settled = false;
      }
    });
    $$payload2.out.push(`<!----> `);
    Index$1($$payload2, {
      label: "Menu Category",
      placeholder: "Choose a category",
      options: categoryOptions,
      variant: "elegant",
      icon: "fas fa-utensils",
      searchable: true,
      clearable: true,
      get value() {
        return searchableDropdownValue;
      },
      set value($$value) {
        searchableDropdownValue = $$value;
        $$settled = false;
      }
    });
    $$payload2.out.push(`<!----> `);
    Index$1($$payload2, {
      label: "Reservation Time",
      placeholder: "Select time slot",
      value: "19:00",
      options: [
        { value: "18:00", label: "6:00 PM" },
        { value: "18:30", label: "6:30 PM" },
        { value: "19:00", label: "7:00 PM" },
        { value: "19:30", label: "7:30 PM" },
        { value: "20:00", label: "8:00 PM" },
        { value: "20:30", label: "8:30 PM" }
      ],
      variant: "elegant",
      icon: "fas fa-clock",
      success: "Time slot confirmed!"
    });
    $$payload2.out.push(`<!----> `);
    Index$1($$payload2, {
      label: "Party Size",
      placeholder: "Number of guests",
      value: "",
      options: [
        { value: "1", label: "1 Guest" },
        { value: "2", label: "2 Guests" },
        { value: "3", label: "3 Guests" },
        { value: "4", label: "4 Guests" },
        { value: "5", label: "5 Guests" },
        { value: "6+", label: "6+ Guests" }
      ],
      variant: "elegant",
      icon: "fas fa-users",
      error: "Please select number of guests",
      required: true
    });
    $$payload2.out.push(`<!----></div></div></div> <div class="mt-12 bg-gray-900/60 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 shadow-2xl svelte-1hichns"><h2 class="text-2xl font-bold text-white mb-6 drop-shadow-lg text-center svelte-1hichns">Different Variants</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-6 svelte-1hichns"><div class="space-y-4 svelte-1hichns"><h3 class="text-lg font-semibold text-amber-400 svelte-1hichns">Default Variant</h3> `);
    Index($$payload2, { label: "Name", placeholder: "Enter name", variant: "default" });
    $$payload2.out.push(`<!----> `);
    Index$1($$payload2, {
      label: "Option",
      placeholder: "Select option",
      options: [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" }
      ],
      variant: "default"
    });
    $$payload2.out.push(`<!----></div> <div class="space-y-4 svelte-1hichns"><h3 class="text-lg font-semibold text-amber-400 svelte-1hichns">Elegant Variant</h3> `);
    Index($$payload2, { label: "Name", placeholder: "Enter name", variant: "elegant" });
    $$payload2.out.push(`<!----> `);
    Index$1($$payload2, {
      label: "Option",
      placeholder: "Select option",
      options: [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" }
      ],
      variant: "elegant"
    });
    $$payload2.out.push(`<!----></div> <div class="space-y-4 svelte-1hichns"><h3 class="text-lg font-semibold text-amber-400 svelte-1hichns">Minimal Variant</h3> `);
    Index($$payload2, { label: "Name", placeholder: "Enter name", variant: "minimal" });
    $$payload2.out.push(`<!----> `);
    Index$1($$payload2, {
      label: "Option",
      placeholder: "Select option",
      options: [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" }
      ],
      variant: "minimal"
    });
    $$payload2.out.push(`<!----></div></div></div> <div class="mt-8 bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-2xl svelte-1hichns"><h3 class="text-lg font-semibold text-white mb-4 svelte-1hichns">Current Values:</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm svelte-1hichns"><div class="text-gray-300 svelte-1hichns"><strong class="text-amber-400 svelte-1hichns">Input Value:</strong> ${escape_html(inputValue || "Empty")}</div> <div class="text-gray-300 svelte-1hichns"><strong class="text-amber-400 svelte-1hichns">Email:</strong> ${escape_html(emailValue || "Empty")}</div> <div class="text-gray-300 svelte-1hichns"><strong class="text-amber-400 svelte-1hichns">Password:</strong> ${escape_html(passwordValue ? "••••••••" : "Empty")}</div> <div class="text-gray-300 svelte-1hichns"><strong class="text-amber-400 svelte-1hichns">Country:</strong> ${escape_html(dropdownValue || "Not selected")}</div> <div class="text-gray-300 svelte-1hichns"><strong class="text-amber-400 svelte-1hichns">Category:</strong> ${escape_html(searchableDropdownValue || "Not selected")}</div></div></div></div></div>`);
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
}
export {
  _page as default
};
