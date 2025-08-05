<script context="module" lang="ts">
	import DetailModal from '../modal/detail/Index.svelte';
	import { slide } from 'svelte/transition';
	import { CONTAINER_SECTION } from '$lib/const';
	import { quintOut } from 'svelte/easing';
</script>

<script lang="ts">
	import { itemInterface } from '../../services/interface.service';
	import { modalActionInterface } from '../../services/detail/modal.service';

	const { getMenuItems } = itemInterface;
	const items = getMenuItems();
	const { open, close } = modalActionInterface;
</script>

<div
	class={`menu-scrollbar max-h-80 space-y-3 overflow-y-auto p-2 md:max-h-96 md:space-y-4`}
	on:wheel|stopPropagation
	on:touchmove|stopPropagation
	role="region"
	aria-label="Menu items"
>
	{#each items as item, itemIndex}
		<button
			class={`${CONTAINER_SECTION.menu.item.list.base} transition-all duration-300 hover:scale-[1.02]`}
			in:slide={{ duration: 400, delay: itemIndex * 100, easing: quintOut }}
			out:slide={{ duration: 400 }}
			on:click={() => open(item)}
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

<DetailModal onClose={close} onModalClosed={close} />
