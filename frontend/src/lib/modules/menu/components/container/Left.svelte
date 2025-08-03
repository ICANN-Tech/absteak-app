<script lang="ts">
	import { CONTAINER_SECTION } from '$lib/const';
	import type { BaseMenuItem } from '../../types/menu.type';
	import DetailModal from '../modal/detail/Index.svelte';
	import { DetailModalService } from '../../services/detail/modal.service';
	import { createTranslationStore } from '$lib/utils/translation';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { 
		activeCategory, 
		menuCategories, 
		selectedCategory, 
		menuInterfaceActions 
	} from '../../stores/interface';

	const t = createTranslationStore();

	function selectCategory(index: number) {
		menuInterfaceActions.setActiveCategory(index);
	}

	function openItemDetail(item: BaseMenuItem) {
		const detailItem = menuInterfaceActions.createDetailMenuItem(item, $selectedCategory.category);
		DetailModalService.open(detailItem);
	}

	function handleModalClose() {
		DetailModalService.close();
	}
</script>

<div class={`${CONTAINER_SECTION.menu.content.left} ${CONTAINER_SECTION.menu.text.base}`}>
	<div class={CONTAINER_SECTION.experience.flex}>
		<h2 class={`${CONTAINER_SECTION.menu.text.title} drop-shadow-2xl`}>
			{$t('menu.title') || 'MENU SIGNATURE KAMI'}
		</h2>
		<p class={`${CONTAINER_SECTION.menu.text.description} drop-shadow-lg`}>
			{$t('menu.subtitle') ||
				'Rasakan keunggulan kuliner dengan pilihan hidangan yang dikurasi dengan cermat, dibuat oleh chef kelas dunia menggunakan bahan-bahan terbaik.'}
		</p>

		<!-- Category Tabs -->
		<div class={`${CONTAINER_SECTION.menu.category.base}`}>
			{#each $menuCategories as category, index}
				<button
					class={`${CONTAINER_SECTION.menu.category.tab} transition-all duration-300 ${
						$activeCategory === index
							? 'scale-105 bg-amber-400 text-gray-900 shadow-lg shadow-amber-400/50'
							: 'border border-gray-600/50 bg-gray-900/80 text-white hover:scale-105 hover:border-amber-400/50 hover:bg-gray-800/90'
					}`}
					on:click={() => selectCategory(index)}
				>
					{category.category}
				</button>
			{/each}
		</div>

		<!-- Menu Items with Menu Scrollbar -->
		<div
			class={`menu-scrollbar max-h-80 space-y-3 overflow-y-auto md:max-h-96 md:space-y-4`}
			on:wheel|stopPropagation
			on:touchmove|stopPropagation
			role="region"
			aria-label="Menu items"
		>
			{#each $selectedCategory.items as item, itemIndex}
				<button
					class={`${CONTAINER_SECTION.menu.item.list.base} transition-all duration-300 hover:scale-[1.02]`}
					in:slide={{ duration: 400, delay: itemIndex * 100, easing: quintOut }}
					out:slide={{ duration: 400 }}
					on:click={() => openItemDetail(item)}
				>
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<h3 class={`${CONTAINER_SECTION.menu.item.list.title} drop-shadow-lg`}>
								{item.name}
							</h3>
							<p class={`${CONTAINER_SECTION.menu.item.list.description} drop-shadow-sm`}>
								{item.desc}
							</p>
						</div>
						<div class="ml-4 text-right">
							<span class={`${CONTAINER_SECTION.menu.item.list.price} drop-shadow-lg`}
								>{item.price}</span
							>
						</div>
					</div>
				</button>
			{/each}
		</div>
	</div>
</div>

<DetailModal
	onClose={handleModalClose}
	onModalClosed={handleModalClose}
/>
