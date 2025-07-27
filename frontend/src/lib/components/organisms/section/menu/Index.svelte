<script lang="ts">
	import ScrollableImage from '$lib/components/molecules/media/ScrollableImage.svelte';
	import { DetailModal } from '$lib/components/organisms';
	import { modalStore } from '$lib/stores/modal';
	import { fade, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

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

	const menuCategories: MenuCategory[] = [
		{
			category: 'Starters',
			items: [
				{
					name: 'Lobster Bisque',
					desc: 'Rich and creamy lobster soup with a hint of cognac',
					price: '$18',
					img: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
				},
				{
					name: 'Wagyu Beef Tartare',
					desc: 'Hand-cut wagyu with quail egg and truffle oil',
					price: '$24',
					img: 'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=400'
				},
				{
					name: 'Pan-Seared Foie Gras',
					desc: 'Served with caramelized apple and port wine reduction',
					price: '$28',
					img: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400'
				},
				{
					name: 'Tuna Sashimi',
					desc: 'Fresh bluefin tuna with wasabi and pickled ginger',
					price: '$22',
					img: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400'
				}
			]
		},
		{
			category: 'Mains',
			items: [
				{
					name: 'Dry-Aged Ribeye',
					desc: '28-day aged prime ribeye with roasted bone marrow',
					price: '$65',
					img: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400'
				},
				{
					name: 'Lobster Thermidor',
					desc: 'Whole lobster with cognac cream sauce and gruyere',
					price: '$58',
					img: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400'
				},
				{
					name: 'Duck Confit',
					desc: 'Slow-cooked duck leg with cherry gastrique',
					price: '$42',
					img: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400'
				},
				{
					name: 'Seafood Risotto',
					desc: 'Arborio rice with fresh seafood and saffron',
					price: '$38',
					img: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400'
				}
			]
		},
		{
			category: 'Desserts',
			items: [
				{
					name: 'Chocolate Soufflé',
					desc: 'Dark chocolate soufflé with vanilla ice cream',
					price: '$16',
					img: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
				},
				{
					name: 'Crème Brûlée',
					desc: 'Classic vanilla custard with caramelized sugar',
					price: '$14',
					img: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400'
				},
				{
					name: 'Tiramisu',
					desc: 'Traditional Italian dessert with espresso and mascarpone',
					price: '$15',
					img: 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400'
				}
			]
		}
	];

	let activeCategory = 0;
	let selectedCategory = menuCategories[0];

	function selectCategory(index: number) {
		activeCategory = index;
		selectedCategory = menuCategories[index];
	}

	function openItemDetail(item: MenuItem) {
		modalStore.open(item);
	}

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
	$: currentImages = categoryImages[activeCategory];
</script>

<section
	class="relative h-screen w-full overflow-hidden"
	style="background-image: url('{backgroundImages[
		activeCategory
	]}'); background-size: cover; background-position: center;"
>
	<!-- Enhanced overlay untuk readability yang lebih baik -->
	<div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/75 to-black/65"></div>
	<div class="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"></div>

	<div class="relative z-10 mx-auto flex h-full flex-col md:flex-row">
		<!-- Left: Menu Content -->
		<div class="flex flex-col justify-center bg-black/30 p-10 backdrop-blur-sm md:w-1/2 md:p-16">
			<h2 class="mb-6 text-3xl leading-tight font-extrabold text-white drop-shadow-2xl md:text-5xl">
				OUR SIGNATURE <span class="text-amber-400 drop-shadow-lg">MENU</span>
			</h2>
			<p class="mb-8 text-lg leading-relaxed text-gray-100 drop-shadow-lg">
				Experience culinary excellence with our carefully curated selection of dishes, crafted by
				world-class chefs using the finest ingredients.
			</p>

			<!-- Category Tabs -->
			<div class="mb-8 flex flex-wrap gap-3">
				{#each menuCategories as category, index}
					<button
						class="rounded-full px-6 py-3 font-semibold shadow-lg transition-all duration-300 {activeCategory ===
						index
							? 'scale-105 bg-amber-400 text-gray-900 shadow-amber-400/50'
							: 'border border-gray-600/50 bg-gray-900/80 text-white hover:border-amber-400/50 hover:bg-gray-800/90'}"
						on:click={() => selectCategory(index)}
					>
						{category.category}
					</button>
				{/each}
			</div>

			<!-- Menu Items -->
			<div
				class="custom-scrollbar max-h-96 space-y-4 overflow-y-auto"
				on:wheel|stopPropagation
				on:touchmove|stopPropagation
				tabindex="0"
				role="region"
				aria-label="Menu items"
			>
				{#each selectedCategory.items as item, itemIndex}
					<button
						class="w-full cursor-pointer rounded-xl border border-gray-700/50 bg-gray-900/60 p-5 text-left shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-amber-400/30 hover:bg-gray-800/70 hover:shadow-2xl"
						in:slide={{ duration: 400, delay: itemIndex * 100, easing: quintOut }}
						out:slide={{ duration: 400 }}
						on:click={() => openItemDetail(item)}
					>
						<div class="flex items-center justify-between">
							<div class="flex-1">
								<h3 class="mb-2 text-xl font-bold text-white drop-shadow-lg">{item.name}</h3>
								<p class="mb-2 text-sm leading-relaxed text-gray-200 drop-shadow-sm">{item.desc}</p>
							</div>
							<div class="ml-4 text-right">
								<span class="text-2xl font-bold text-amber-400 drop-shadow-lg">{item.price}</span>
							</div>
						</div>
					</button>
				{/each}
			</div>
		</div>

		<!-- Right: Infinite scrolling image columns -->
		<div class="relative flex h-full overflow-hidden md:w-1/2">
			<!-- Enhanced overlay untuk smooth transition -->
			<div
				class="absolute inset-0 z-10 bg-gradient-to-l from-transparent via-black/20 to-black/40 transition-opacity duration-500"
				class:opacity-100={activeCategory !== activeCategory}
				class:opacity-0={activeCategory === activeCategory}
			></div>

			<!-- Left column - scrolling up -->
			<div class="relative w-1/2 h-full">
				{#key activeCategory}
					<div class="h-full bg-rose-600" in:fade={{ duration: 600, delay: 200 }} out:fade={{ duration: 400 }}>
						<ScrollableImage
							images={currentImages.leftColumn}
							heights={leftColumnHeights}
							animationClass="animate-scroll-up"
						/>
					</div>
				{/key}
			</div>

			<!-- Right column - scrolling down -->
			<div class="relative w-1/2 h-full">
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
<DetailModal position="center" size="lg" />

<style>
	/* Enhanced custom scrollbar untuk menu items */
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.3);
		border-radius: 3px;
		backdrop-filter: blur(4px);
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, #f59e0b, #d97706);
		border-radius: 3px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(180deg, #fbbf24, #f59e0b);
		box-shadow: 0 4px 8px rgba(245, 158, 11, 0.4);
	}

	/* Enhanced scroll behavior untuk menu items container */
	.custom-scrollbar {
		scroll-behavior: smooth;
		overscroll-behavior: contain;
		-webkit-overflow-scrolling: touch;
	}

	.custom-scrollbar:focus {
		outline: 2px solid rgba(245, 158, 11, 0.5);
		outline-offset: 2px;
		border-radius: 8px;
	}

	/* Enhanced text shadows untuk better readability */
	.drop-shadow-2xl {
		filter: drop-shadow(0 25px 25px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 20px rgba(0, 0, 0, 0.6));
	}

	.drop-shadow-lg {
		filter: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.4));
	}

	.drop-shadow-sm {
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
	}

	/* Smooth transitions untuk semua elemen */
	* {
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Enhanced backdrop blur effect */
	.backdrop-blur-sm {
		backdrop-filter: blur(4px) saturate(1.2);
	}

	/* Custom gradient overlay untuk better visual hierarchy */
	section::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: radial-gradient(circle at 30% 50%, rgba(245, 158, 11, 0.1) 0%, transparent 50%);
		pointer-events: none;
		z-index: 1;
	}

	/* Prevent body scroll when scrolling menu items */
	.custom-scrollbar:hover {
		overscroll-behavior: contain;
	}
</style>