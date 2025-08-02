<script lang="ts">
	import ScrollableImage from '$lib/components/molecules/media/ScrollableImage.svelte';
	import { DetailModal } from '$lib/components/organisms';
	import type { ModalItem } from '$lib/utils/modal/data';
	import { fade, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { createTranslationStore } from '$lib/utils/translation';
	import { CONTAINER_SECTION } from '$lib/const';

	const t = createTranslationStore();

	interface MenuItem {
		name: string;
		desc: string;
		price: string;
		img: string;
	}

	interface MenuCategory {
		category: string;
		items: MenuItem[];
	}

	interface CategoryImages {
		leftColumn: string[];
		rightColumn: string[];
	}

	// Fallback menu data jika translasi tidak tersedia
	const fallbackMenuCategories: MenuCategory[] = [
		{
			category: 'Appetizer',
			items: [
				{
					name: 'Wagyu Beef Tartare',
					desc: 'Wagyu segar dipotong tangan dengan telur puyuh dan minyak truffle',
					price: 'Rp 380.000',
					img: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
				},
				{
					name: 'Foie Gras Pan-Seared',
					desc: 'Disajikan dengan apel karamel dan reduksi wine port',
					price: 'Rp 420.000',
					img: 'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=400'
				},
				{
					name: 'Tuna Sashimi Premium',
					desc: 'Tuna bluefin segar dengan wasabi dan jahe acar',
					price: 'Rp 320.000',
					img: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400'
				},
				{
					name: 'Lobster Bisque',
					desc: 'Sup lobster kaya dan creamy dengan sentuhan cognac',
					price: 'Rp 280.000',
					img: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400'
				}
			]
		},
		{
			category: 'Steak Premium',
			items: [
				{
					name: 'Dry-Aged Ribeye A5',
					desc: 'Ribeye premium aged 28 hari dengan bone marrow panggang',
					price: 'Rp 980.000',
					img: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400'
				},
				{
					name: 'Wagyu Tenderloin',
					desc: 'Tenderloin wagyu dengan saus truffle dan kentang fondant',
					price: 'Rp 1.200.000',
					img: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400'
				},
				{
					name: 'Tomahawk Steak',
					desc: 'Steak tomahawk 800gr dengan herb butter dan sayuran panggang',
					price: 'Rp 1.500.000',
					img: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400'
				},
				{
					name: 'Surf & Turf',
					desc: 'Kombinasi steak tenderloin dan lobster thermidor',
					price: 'Rp 1.800.000',
					img: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400'
				}
			]
		},
		{
			category: 'Dessert',
			items: [
				{
					name: 'Chocolate Soufflé',
					desc: 'Soufflé cokelat hitam dengan es krim vanilla',
					price: 'Rp 180.000',
					img: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
				},
				{
					name: 'Crème Brûlée',
					desc: 'Custard vanilla klasik dengan gula karamel',
					price: 'Rp 160.000',
					img: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400'
				},
				{
					name: 'Tiramisu Premium',
					desc: 'Tiramisu Italia tradisional dengan espresso dan mascarpone',
					price: 'Rp 170.000',
					img: 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400'
				}
			]
		}
	];

	// Reactive statement untuk mendapatkan menu dari translasi atau fallback
	$: menuCategories = (() => {
		const translatedCategories = $t('menu.categories');
		if (Array.isArray(translatedCategories) && translatedCategories.length > 0) {
			return translatedCategories.map((category: any, categoryIndex: number) => ({
				category: category.name,
				items: Array.isArray(category.items) ? category.items.map((item: any, itemIndex: number) => ({
					name: item.name,
					desc: item.description,
					price: item.price,
					img: fallbackMenuCategories[categoryIndex]?.items[itemIndex]?.img || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
				})) : []
			}));
		}
		return fallbackMenuCategories;
	})();

	let activeCategory = 0;
	let showModal = false;
	
	// Reactive statement untuk selectedCategory dengan pengecekan yang lebih robust
	$: selectedCategory = menuCategories && menuCategories.length > 0 ? menuCategories[activeCategory] || menuCategories[0] : {
		category: 'Loading...',
		items: []
	};

	function selectCategory(index: number) {
		if (menuCategories && menuCategories.length > 0 && index >= 0 && index < menuCategories.length) {
			activeCategory = index;
		}
	}

	function openItemDetail(item: MenuItem) {
		// Create enhanced item with additional properties
		const enhancedItem: ModalItem = {
			...item,
			category: selectedCategory.category,
			ingredients: [], // Add if available in your data
			allergens: [], // Add if available in your data
			nutritionInfo: {
				calories: 0,
				protein: '0g',
				carbs: '0g', 
				fat: '0g'
			} // Add if available in your data
		};
		
		// Set the modal item and show the modal
		currentModalItem = enhancedItem;
		showModal = true;
	}

	function handleModalClose() {
		showModal = false;
		currentModalItem = null;
	}

	function handleOrderNow(event: CustomEvent<ModalItem>) {
		console.log('Order now:', event.detail);
		// Handle order logic here
		showModal = false;
	}

	let currentModalItem: ModalItem | null = null;

	// Background images untuk setiap kategori
	const backgroundImages: string[] = [
		'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1920',
		'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=1920',
		'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1920'
	];

	// Images untuk scrolling columns berdasarkan kategori
	const categoryImages: Record<number, CategoryImages> = {
		0: {
			// Starters
			leftColumn: [
				'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=400'
			],
			rightColumn: [
				'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400'
			]
		},
		1: {
			// Mains
			leftColumn: [
				'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400'
			],
			rightColumn: [
				'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400'
			]
		},
		2: {
			// Desserts
			leftColumn: [
				'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400'
			],
			rightColumn: [
				'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
				'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400'
			]
		}
	};

	// Heights untuk variasi ukuran gambar
	const leftColumnHeights = ['h-48', 'h-72', 'h-56', 'h-80', 'h-64', 'h-60'];
	const rightColumnHeights = ['h-64', 'h-52', 'h-76', 'h-68', 'h-56', 'h-72'];

	// Reactive statement untuk mendapatkan images berdasarkan kategori aktif
	$: currentImages = categoryImages[activeCategory] || {
		leftColumn: ['https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'],
		rightColumn: ['https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400']
	};
</script>

<section
	class={`${CONTAINER_SECTION.menu.base} bg-cover bg-center`}
	style="background-image: url('{backgroundImages[activeCategory] || backgroundImages[0] || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1920'}');"
>
	<!-- Overlay for better readability -->
	<div class={`${CONTAINER_SECTION.menu.overlay.first}`}></div>
	<div class={`${CONTAINER_SECTION.menu.overlay.second}`}></div>

	<div class={`${CONTAINER_SECTION.menu.content.base}`}>
		<!-- Left: Menu Content -->
		<div class={`${CONTAINER_SECTION.menu.content.left} ${CONTAINER_SECTION.menu.text.base}`}>
			<h2 class={`${CONTAINER_SECTION.menu.text.title} drop-shadow-2xl`}>
				{$t('menu.title') || 'MENU SIGNATURE KAMI'}
			</h2>
			<p class={`${CONTAINER_SECTION.menu.text.description} drop-shadow-lg`}>
				{$t('menu.subtitle') || 'Rasakan keunggulan kuliner dengan pilihan hidangan yang dikurasi dengan cermat, dibuat oleh chef kelas dunia menggunakan bahan-bahan terbaik.'}
			</p>

			<!-- Category Tabs -->
			<div class={`${CONTAINER_SECTION.menu.category.base}`}>
				{#each menuCategories as category, index}
					<button
						class={`${CONTAINER_SECTION.menu.category.tab} transition-all duration-300 ${activeCategory ===
						index
							? 'scale-105 bg-amber-400 text-gray-900 shadow-lg shadow-amber-400/50'
							: 'border border-gray-600/50 bg-gray-900/80 text-white hover:border-amber-400/50 hover:bg-gray-800/90 hover:scale-105'}`}
						on:click={() => selectCategory(index)}
					>
						{category.category}
					</button>
				{/each}
			</div>

			<!-- Menu Items with Menu Scrollbar -->
			<div
				class={`menu-scrollbar max-h-80 md:max-h-96 space-y-3 md:space-y-4 overflow-y-auto`}
				on:wheel|stopPropagation
				on:touchmove|stopPropagation
				role="region"
				aria-label="Menu items"
			>
				{#each selectedCategory.items as item, itemIndex}
					<button
						class={`${CONTAINER_SECTION.menu.item.list.base} transition-all duration-300 hover:scale-[1.02]`}
						in:slide={{ duration: 400, delay: itemIndex * 100, easing: quintOut }}
						out:slide={{ duration: 400 }}
						on:click={() => openItemDetail(item)}
					>
						<div class="flex items-center justify-between">
							<div class="flex-1">
								<h3 class={`${CONTAINER_SECTION.menu.item.list.title} drop-shadow-lg`}>{item.name}</h3>
								<p class={`${CONTAINER_SECTION.menu.item.list.description} drop-shadow-sm`}>{item.desc}</p>
							</div>
							<div class="ml-4 text-right">
								<span class={`${CONTAINER_SECTION.menu.item.list.price} drop-shadow-lg`}>{item.price}</span>
							</div>
						</div>
					</button>
				{/each}
			</div>
		</div>

		<!-- Right: Infinite scrolling image columns -->
		<div class={`${CONTAINER_SECTION.menu.content.right}`}>
			<!-- Left column - scrolling up -->
			<div class={`${CONTAINER_SECTION.menu.scrollableImage.left}`}>
				{#key activeCategory}
					<div class="h-full" in:fade={{ duration: 600, delay: 200 }} out:fade={{ duration: 400 }}>
						<ScrollableImage
							images={currentImages.leftColumn}
							heights={leftColumnHeights}
							animationClass="animate-scroll-up"
						/>
					</div>
				{/key}
			</div>

			<!-- Right column - scrolling down -->
			<div class={`${CONTAINER_SECTION.menu.scrollableImage.right}`}>
				{#key activeCategory}
					<div class="h-full" in:fade={{ duration: 600, delay: 400 }} out:fade={{ duration: 400 }}>
						<ScrollableImage
							images={currentImages.rightColumn}
							heights={rightColumnHeights}
							animationClass="animate-scroll-down"
						/>
					</div>
				{/key}
			</div>
		</div>
	</div>
</section>

<!-- Detail Modal -->
<DetailModal 
	bind:show={showModal}
	modalItem={currentModalItem}
	position="center" 
	size="lg"
	on:close={handleModalClose}
	on:modalClosed={handleModalClose}
	on:orderNow={handleOrderNow}
/>