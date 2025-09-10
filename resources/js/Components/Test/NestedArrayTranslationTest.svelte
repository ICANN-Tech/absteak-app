<script lang="ts">
	import { createMultilingualTranslation } from '@Utils/Global/Translation';
	import { localeStore, setLocale } from '@Stores/Global/Locale';
	import { LocaleEnum } from '@Enums/Global/Locale';

	// Test data dengan nested array seperti yang diberikan user
	const testData = {
		title: {
			en: "ABSteak Culinary Excellence",
			id: "Kuliner ABSteak",
			ko: "ABSteak 요리의 완벽"
		},
		subtitle: {
			en: "Discover the secrets behind our exceptional premium steak flavors",
			id: "Jelajahi secret di balik hidangan steak premium kami",
			ko: "우리의 우수한 프리미엄 스테이크 맛의 비밀을 탐험하세요"
		},
		description: {
			en: "With high dedication to quality and innovation, we deliver an unforgettable culinary experience through every dish we serve",
			id: "Dengan dedikasi tinggi terhadap kualitas dan inovasi, kami menyajikan pengalaman kuliner tak terlupakan melalui setiap hidangan yang kami sajikan",
			ko: "우리는 열정과 완벽이 만나는 모든 요리에서 잊을 수 없는 다이닝 경험을 제공하기 위해 최선을 다하고 있습니다."
		},
		items: [
			{
				en: "Premium high-quality meat selectively chosen for excellence",
				id: "Daging premium berkualitas tinggi yang dipilih secara selectif untuk kualitas terbaik",
				ko: "우수한 품질의 고급 메인을 선택하여 완벽한 맛을 제공합니다."
			},
			{
				en: "Expertly crafted dishes with a focus on quality and flavor",
				id: "Dish yang disusun dengan teliti untuk kualitas dan cita rasa",
				ko: "고급 메인을 선택하여 완벽한 맛을 제공합니다."
			},
			{
				en: "Professional cooking techniques with international standards",
				id: "Teknik memasak profesional dengan standar internasional",
				ko: "국제 표준을 준수한 전문 요리 기술"
			},
			{
				en: "Carefully selected spices and seasonings creating authentic and appetizing flavors",
				id: "Bumbu dan seasonings yang dipilih dengan teliti untuk cita rasa yang autentik dan memuaskan",
				ko: "국제 표준을 준수한 전문 요리 기술"
			}
		]
	};

	// Buat translation store dengan fields yang mencakup nested array
	const translation = createMultilingualTranslation(
		testData,
		['title', 'subtitle', 'description', 'items']
	);

	// Function untuk mengubah locale
	function changeLocale(locale: LocaleEnum) {
		setLocale(locale);
	}
</script>

<div class="nested-array-test p-8">
	<h1 class="text-3xl font-bold mb-6">Nested Array Translation Test</h1>
	
	<div class="mb-6">
		<h2 class="text-xl font-semibold mb-4">Language Controls:</h2>
		<div class="space-x-4">
			<button 
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				on:click={() => changeLocale(LocaleEnum.En)}
			>
				English
			</button>
			<button 
				class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
				on:click={() => changeLocale(LocaleEnum.Id)}
			>
				Indonesian
			</button>
			<button 
				class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
				on:click={() => changeLocale(LocaleEnum.Ja)}
			>
				Japanese
			</button>
		</div>
	</div>

	<div class="mb-6">
		<h2 class="text-xl font-semibold mb-4">Current Locale: <span class="text-blue-600">{$localeStore.current}</span></h2>
	</div>

	{#if $translation}
		<div class="bg-white shadow-lg rounded-lg p-6">
			<h2 class="text-2xl font-bold mb-4 text-gray-800">{$translation.title}</h2>
			<h3 class="text-lg font-semibold mb-4 text-gray-600">{$translation.subtitle}</h3>
			<p class="text-gray-700 mb-6">{$translation.description}</p>
			
			<div class="mb-6">
				<h4 class="text-lg font-semibold mb-4 text-gray-800">Items (Nested Array):</h4>
				{#if $translation.items && Array.isArray($translation.items)}
					<ul class="space-y-3">
						{#each $translation.items as item, index}
							<li class="bg-gray-100 p-4 rounded-lg">
								<span class="font-semibold text-gray-700">Item {index + 1}:</span>
								<span class="text-gray-600">{item}</span>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="text-red-500">Items array tidak ditemukan atau kosong!</p>
				{/if}
			</div>
			
			<div class="mt-6">
				<h4 class="text-lg font-semibold mb-2 text-gray-800">Raw Data (untuk debugging):</h4>
				<pre class="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">{JSON.stringify($translation, null, 2)}</pre>
			</div>
		</div>
	{:else}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
			Translation data tidak tersedia
		</div>
	{/if}
</div>

<style>
	.nested-array-test {
		min-height: 100vh;
		background-color: #f7fafc;
	}
</style>