<script lang="ts">
	import { createTranslationStore } from '../../../Utils/Global/Translation';

	const t = createTranslationStore();

	// Section classes and styles
	const sectionClasses = 'min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black';
	const sectionStyle = '';
</script>

<section 
	id="booking"
	class={sectionClasses}
	style={sectionStyle}
>
	<div class="container mx-auto px-4">
		<div class="text-center">
			<h2 class="text-4xl font-bold text-white mb-8">
				{$t('reservation.title', 'Make a Reservation')}
			</h2>
			<p class="text-xl text-gray-300 mb-12">
				{$t('reservation.subtitle', 'Book your table for an unforgettable dining experience')}
			</p>
			
			<!-- Reservation form or content will go here -->
			<div class="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto">
				<p class="text-white text-lg">
					{$t('reservation.comingSoon', 'Reservation system coming soon...')}
				</p>
			</div>
		</div>
	</div>
</section>