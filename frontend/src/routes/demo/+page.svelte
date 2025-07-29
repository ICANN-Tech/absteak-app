<script lang="ts">
	import SetShowComponentTest from '$lib/components/demo/SetShowComponentTest.svelte';
	import LockVisibilityDemo from '$lib/components/demo/LockVisibilityDemo.svelte';
</script>

<div class="p-6">
	<h1 class="text-3xl font-bold mb-6">Demo Pages</h1>
	
	<div class="space-y-4">
		<a href="/demo/paraglide" class="block p-4 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors">
			<div class="font-semibold text-blue-800">Paraglide Demo</div>
			<div class="text-blue-600 text-sm">Test internationalization features</div>
		</a>
		
		<div class="p-4 bg-green-100 rounded-lg">
			<div class="font-semibold text-green-800 mb-2">setShowComponent Test</div>
			<div class="text-green-600 text-sm mb-4">Test the setShowComponent functionality</div>
			<SetShowComponentTest />
		</div>
		
		<div class="p-4 bg-purple-100 rounded-lg">
			<div class="font-semibold text-purple-800 mb-2">Lock/Unlock Visibility Demo</div>
			<div class="text-purple-600 text-sm mb-4">Test lock dan unlock visibility functionality</div>
			<LockVisibilityDemo />
		</div>
	</div>
</div>