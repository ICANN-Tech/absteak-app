<script lang="ts">
	import DetailContact from '@Components/Guest/Molecules/Contact/Detail.svelte';
	import LandmarkMap from '@Components/Guest/Molecules/Map/Landmark.svelte';
	import ControlMap from '@Components/Guest/Molecules/Map/Control.svelte';
	import { CONTAINER_SECTION } from '@Const/Guest/UI/Container';
	import { UI_LAYOUT } from '@Const/Guest/UI/Layout';

	// Dummy data
	const address = "123 Steakhouse Avenue, Culinary District, Food City 12345";
	const phone = "+1 (555) 123-BEEF";
	const email = "info@absteak.com";
	const title = "Visit Our Restaurant";
	const description = "Experience the finest steaks in a warm, welcoming atmosphere. Located in the heart of the culinary district.";
</script>

<div class="mx-auto {CONTAINER_SECTION.footer.map.section} {UI_LAYOUT.maxWidth.content}">
	<div class={`${CONTAINER_SECTION.footer.map.content.base}`}>
		<div class="w-full lg:w-1/2 flex flex-col">
			<div class={`${CONTAINER_SECTION.footer.map.content.info.base}`}>
				<h2 class={`${CONTAINER_SECTION.footer.map.content.info.title}`}>
					{title}
				</h2>
				<p class={`${CONTAINER_SECTION.footer.map.content.info.description}`}>
					{description}
				</p>
			</div>
			<DetailContact {address} {phone} {email} />
		</div>

		<div class="w-full lg:w-1/2 flex flex-col">
			<LandmarkMap restaurantName="ABSteak" />
			<ControlMap {address} />
		</div>
	</div>
</div>
