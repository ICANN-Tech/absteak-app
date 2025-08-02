<script lang="ts">
	import { EmailIcon, MapMarkerIcon, TelephoneIcon } from '$lib/components/atoms';

	export let address: string = '';
	export let phone: string = '';
	export let email: string = '';
</script>

<div class="space-y-3">
	<div class="flex items-center space-x-3">
		<MapMarkerIcon className="text-amber-400" size="sm" />
		<span class="text-gray-300">{address}</span>
	</div>

	<div class="flex items-center space-x-3">
		<TelephoneIcon className="text-amber-400" size="sm" />
		<span class="text-gray-300">{phone}</span>
	</div>

	<div class="flex items-center space-x-3">
		<EmailIcon className="text-amber-400" size="sm" />
		<span class="text-gray-300">{email}</span>
	</div>
</div>
