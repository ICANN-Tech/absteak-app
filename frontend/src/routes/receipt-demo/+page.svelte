<script lang="ts">
	import Receipt from '$lib/modules/reservation/components/form/Receipt.svelte';
	import { Button } from '$lib/components/atoms';

	let currentStatus: 'success' | 'warning' | 'failed' = 'success';
	let showDemo = true;

	function handleNewReservation() {
		console.log('New reservation clicked');
		alert('Navigating to new reservation...');
	}

	function handlePrint() {
		console.log('Print clicked');
	}

	function handleDownload() {
		console.log('Download clicked');
		alert('Downloading receipt...');
	}

	function handleRetry() {
		console.log('Retry clicked');
		alert('Retrying reservation...');
	}

	function handleContactSupport() {
		console.log('Contact support clicked');
		alert('Opening customer service contact...');
	}

	function switchStatus(status: 'success' | 'warning' | 'failed') {
		currentStatus = status;
		showDemo = false;
		setTimeout(() => {
			showDemo = true;
		}, 100);
	}
</script>

<svelte:head>
	<title>Receipt Component Demo - ABSteak</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1 class="mb-4 text-4xl font-bold text-white">Receipt Component Demo</h1>
			<p class="text-gray-300">Demonstrasi komponen Receipt dengan berbagai status</p>
		</div>

		<!-- Status Switcher -->
		<div class="mb-8 flex justify-center space-x-4">
			<Button
				variant={currentStatus === 'success' ? 'success' : 'info'}
				on:click={() => switchStatus('success')}
			>
				Success
			</Button>
			<Button
				variant={currentStatus === 'warning' ? 'warning' : 'info'}
				on:click={() => switchStatus('warning')}
			>
				Warning
			</Button>
			<Button
				variant={currentStatus === 'failed' ? 'danger' : 'info'}
				on:click={() => switchStatus('failed')}
			>
				Failed
			</Button>
		</div>

		<!-- Receipt Component Demo -->
		{#if showDemo}
			<Receipt
				status={currentStatus}
				reservationId="RSV-2024-{Math.random().toString(36).substr(2, 6).toUpperCase()}"
				onnewreservation={handleNewReservation}
				onprint={handlePrint}
				ondownload={handleDownload}
				onretry={handleRetry}
				oncontactsupport={handleContactSupport}
			/>
		{/if}

		<!-- Component Info -->
		<div class="mt-12 rounded-lg bg-gray-800/50 p-6">
			<h2 class="mb-4 text-2xl font-semibold text-white">Component Features</h2>
			<div class="grid gap-6 md:grid-cols-3">
				<div class="rounded-lg bg-green-500/10 border border-green-500/30 p-4">
					<h3 class="mb-2 font-semibold text-green-400">Success State</h3>
					<ul class="space-y-1 text-sm text-green-300">
						<li>• Konfirmasi reservasi berhasil</li>
						<li>• Tombol buat reservasi baru</li>
						<li>• Opsi cetak dan unduh</li>
						<li>• Informasi kedatangan</li>
					</ul>
				</div>

				<div class="rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-4">
					<h3 class="mb-2 font-semibold text-yellow-400">Warning State</h3>
					<ul class="space-y-1 text-sm text-yellow-300">
						<li>• Reservasi sedang diproses</li>
						<li>• Tombol hubungi customer service</li>
						<li>• Opsi buat reservasi baru</li>
						<li>• Informasi waktu tunggu</li>
					</ul>
				</div>

				<div class="rounded-lg bg-red-500/10 border border-red-500/30 p-4">
					<h3 class="mb-2 font-semibold text-red-400">Failed State</h3>
					<ul class="space-y-1 text-sm text-red-300">
						<li>• Reservasi gagal diproses</li>
						<li>• Tombol coba lagi</li>
						<li>• Opsi hubungi customer service</li>
						<li>• Informasi kontak bantuan</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Props Documentation -->
		<div class="mt-8 rounded-lg bg-gray-800/50 p-6">
			<h2 class="mb-4 text-2xl font-semibold text-white">Available Props</h2>
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-gray-300">
					<thead>
						<tr class="border-b border-gray-600">
							<th class="py-2 text-left">Prop</th>
							<th class="py-2 text-left">Type</th>
							<th class="py-2 text-left">Default</th>
							<th class="py-2 text-left">Description</th>
						</tr>
					</thead>
					<tbody class="space-y-2">
						<tr class="border-b border-gray-700">
							<td class="py-2 font-mono text-blue-400">status</td>
							<td class="py-2">'success' | 'warning' | 'failed'</td>
							<td class="py-2">'success'</td>
							<td class="py-2">Status receipt yang menentukan tampilan dan perilaku</td>
						</tr>
						<tr class="border-b border-gray-700">
							<td class="py-2 font-mono text-blue-400">title</td>
							<td class="py-2">string</td>
							<td class="py-2">''</td>
							<td class="py-2">Judul custom (opsional, akan menggunakan default jika kosong)</td>
						</tr>
						<tr class="border-b border-gray-700">
							<td class="py-2 font-mono text-blue-400">message</td>
							<td class="py-2">string</td>
							<td class="py-2">''</td>
							<td class="py-2">Pesan custom (opsional, akan menggunakan default jika kosong)</td>
						</tr>
						<tr class="border-b border-gray-700">
							<td class="py-2 font-mono text-blue-400">reservationId</td>
							<td class="py-2">string</td>
							<td class="py-2">''</td>
							<td class="py-2">ID reservasi yang akan ditampilkan</td>
						</tr>
						<tr class="border-b border-gray-700">
							<td class="py-2 font-mono text-blue-400">showActions</td>
							<td class="py-2">boolean</td>
							<td class="py-2">true</td>
							<td class="py-2">Menampilkan atau menyembunyikan tombol aksi</td>
						</tr>
						<tr class="border-b border-gray-700">
							<td class="py-2 font-mono text-blue-400">showDownload</td>
							<td class="py-2">boolean</td>
							<td class="py-2">true</td>
							<td class="py-2">Menampilkan tombol unduh</td>
						</tr>
						<tr class="border-b border-gray-700">
							<td class="py-2 font-mono text-blue-400">showPrint</td>
							<td class="py-2">boolean</td>
							<td class="py-2">true</td>
							<td class="py-2">Menampilkan tombol cetak</td>
						</tr>
						<tr>
							<td class="py-2 font-mono text-blue-400">showNewReservation</td>
							<td class="py-2">boolean</td>
							<td class="py-2">true</td>
							<td class="py-2">Menampilkan tombol buat reservasi baru</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Events Documentation -->
		<div class="mt-8 rounded-lg bg-gray-800/50 p-6">
			<h2 class="mb-4 text-2xl font-semibold text-white">Available Event Callbacks (Svelte 5)</h2>
			<div class="grid gap-4 md:grid-cols-2">
				<div>
					<h3 class="mb-2 font-semibold text-gray-200">User Actions</h3>
					<ul class="space-y-1 text-sm text-gray-300">
						<li><code class="text-blue-400">onnewreservation</code> - Buat reservasi baru</li>
						<li><code class="text-blue-400">onprint</code> - Cetak receipt</li>
						<li><code class="text-blue-400">ondownload</code> - Unduh receipt</li>
						<li><code class="text-blue-400">onretry</code> - Coba lagi (failed state)</li>
					</ul>
				</div>
				<div>
					<h3 class="mb-2 font-semibold text-gray-200">Support Actions</h3>
					<ul class="space-y-1 text-sm text-gray-300">
						<li><code class="text-blue-400">oncontactsupport</code> - Hubungi customer service</li>
						<li><code class="text-blue-400">onexport</code> - Export receipt (dengan format)</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>