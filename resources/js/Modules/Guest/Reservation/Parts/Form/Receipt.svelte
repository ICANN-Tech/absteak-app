<script lang="ts">
	import { Button } from '$lib/components/atoms';
	import { CheckCircleSolid, ExclamationCircleSolid, CloseCircleSolid, ArrowDownToBracketOutline, FileExportOutline } from 'flowbite-svelte-icons';
	import { fly } from 'svelte/transition';

	// Props
	export let status: 'success' | 'warning' | 'failed' = 'success';
	export let title: string = '';
	export let message: string = '';
	export let reservationId: string = '';
	export let showActions: boolean = true;
	export let showDownload: boolean = true;
	export let showPrint: boolean = true;
	export let showNewReservation: boolean = true;

	// Event callback props (Svelte 5 approach)
	export let onnewreservation: (() => void) | undefined = undefined;
	export let onprint: (() => void) | undefined = undefined;
	export let ondownload: ((data: { reservationId: string; status: string }) => void) | undefined = undefined;
	export let onexport: ((data: { reservationId: string; status: string; format: string }) => void) | undefined = undefined;
	export let onretry: (() => void) | undefined = undefined;
	export let oncontactsupport: (() => void) | undefined = undefined;

	// Status configurations
	const statusConfig = {
		success: {
			icon: CheckCircleSolid,
			iconBg: 'bg-green-500',
			borderColor: 'border-green-500/30',
			bgColor: 'bg-green-500/10',
			titleColor: 'text-green-400',
			messageColor: 'text-green-300',
			buttonPrimary: 'success' as const,
			buttonSecondary: 'success' as const,
			defaultTitle: 'Reservasi Berhasil!',
			defaultMessage: 'Terima kasih! Reservasi Anda telah berhasil dikonfirmasi. Kami akan mengirimkan detail reservasi ke email Anda.'
		},
		warning: {
			icon: ExclamationCircleSolid,
			iconBg: 'bg-yellow-500',
			borderColor: 'border-yellow-500/30',
			bgColor: 'bg-yellow-500/10',
			titleColor: 'text-yellow-400',
			messageColor: 'text-yellow-300',
			buttonPrimary: 'warning' as const,
			buttonSecondary: 'warning' as const,
			defaultTitle: 'Reservasi Tertunda',
			defaultMessage: 'Reservasi Anda sedang diproses. Mohon tunggu konfirmasi lebih lanjut melalui email atau telepon.'
		},
		failed: {
			icon: CloseCircleSolid,
			iconBg: 'bg-red-500',
			borderColor: 'border-red-500/30',
			bgColor: 'bg-red-500/10',
			titleColor: 'text-red-400',
			messageColor: 'text-red-300',
			buttonPrimary: 'danger' as const,
			buttonSecondary: 'danger' as const,
			defaultTitle: 'Reservasi Gagal',
			defaultMessage: 'Maaf, terjadi kesalahan dalam memproses reservasi Anda. Silakan coba lagi atau hubungi customer service.'
		}
	};

	$: config = statusConfig[status];
	$: displayTitle = title || config.defaultTitle;
	$: displayMessage = message || config.defaultMessage;

	// Event handlers
	function handleNewReservation() {
		onnewreservation?.();
	}

	function handlePrint() {
		window.print();
		onprint?.();
	}

	function handleDownload() {
		ondownload?.({ reservationId, status });
	}

	function handleExport() {
		onexport?.({ reservationId, status, format: 'pdf' });
	}

	function handleRetry() {
		onretry?.();
	}

	function handleContactSupport() {
		oncontactsupport?.();
	}
</script>

<div class="mx-auto max-w-xl text-center" in:fly={{ x: 300, duration: 300 }}>
	<div class="rounded-lg border {config.borderColor} {config.bgColor} p-8">
		<div class="mb-6">
			<!-- Status Icon -->
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full {config.iconBg}">
				<svelte:component this={config.icon} class="h-8 w-8 text-white" />
			</div>

			<!-- Title and Message -->
			<h2 class="mb-4 text-3xl font-bold {config.titleColor}">{displayTitle}</h2>
			<p class="mb-6 {config.messageColor}">
				{displayMessage}
			</p>

			<!-- Reservation ID (if provided) -->
			{#if reservationId}
				<div class="mb-4 rounded-lg bg-black/20 p-3">
					<p class="text-sm text-gray-300">ID Reservasi</p>
					<p class="font-mono text-lg font-semibold {config.titleColor}">{reservationId}</p>
				</div>
			{/if}
		</div>

		{#if showActions}
			<div class="space-y-4">
				<!-- Primary Actions -->
				<div class="space-y-3">
					{#if status === 'success'}
						{#if showNewReservation}
							<Button
								variant={config.buttonPrimary}
								class="w-full"
								on:click={handleNewReservation}
							>
								Buat Reservasi Baru
							</Button>
						{/if}
					{:else if status === 'warning'}
						<Button
							variant={config.buttonPrimary}
							class="w-full"
							on:click={handleContactSupport}
						>
							Hubungi Customer Service
						</Button>
					{:else if status === 'failed'}
						<Button
							variant={config.buttonPrimary}
							class="w-full"
							on:click={handleRetry}
						>
							Coba Lagi
						</Button>
					{/if}
				</div>

				<!-- Secondary Actions -->
				<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
					{#if showPrint}
						<Button
							variant="info"
							class="w-full border border-current bg-transparent hover:bg-current/10"
							on:click={handlePrint}
						>
							<FileExportOutline class="mr-2 h-4 w-4" />
							Cetak
						</Button>
					{/if}

					{#if showDownload}
						<Button
							variant="info"
							class="w-full border border-current bg-transparent hover:bg-current/10"
							on:click={handleDownload}
						>
							<ArrowDownToBracketOutline class="mr-2 h-4 w-4" />
							Unduh
						</Button>
					{/if}
				</div>

				<!-- Additional Actions for Failed Status -->
				{#if status === 'failed'}
					<div class="pt-2">
						<Button
							variant="info"
							class="w-full border border-current bg-transparent hover:bg-current/10"
							on:click={handleContactSupport}
						>
							Hubungi Customer Service
						</Button>
					</div>
				{/if}

				<!-- Additional Actions for Warning Status -->
				{#if status === 'warning' && showNewReservation}
					<div class="pt-2">
						<Button
							variant="info"
							class="w-full border border-current bg-transparent hover:bg-current/10"
							on:click={handleNewReservation}
						>
							Buat Reservasi Baru
						</Button>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Additional Information -->
	{#if status === 'warning'}
		<div class="mt-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20 p-4">
			<p class="text-sm text-yellow-200">
				<strong>Catatan:</strong> Proses konfirmasi biasanya memakan waktu 5-10 menit. 
				Jika tidak ada konfirmasi dalam 30 menit, silakan hubungi customer service.
			</p>
		</div>
	{:else if status === 'failed'}
		<div class="mt-4 rounded-lg bg-red-500/5 border border-red-500/20 p-4">
			<p class="text-sm text-red-200">
				<strong>Bantuan:</strong> Jika masalah terus berlanjut, silakan hubungi customer service 
				di <span class="font-semibold">+62 21 1234 5678</span> atau email 
				<span class="font-semibold">support@absteak.com</span>
			</p>
		</div>
	{:else if status === 'success'}
		<div class="mt-4 rounded-lg bg-green-500/5 border border-green-500/20 p-4">
			<p class="text-sm text-green-200">
				<strong>Informasi:</strong> Silakan datang 15 menit sebelum waktu reservasi. 
				Tunjukkan ID reservasi atau email konfirmasi kepada staff kami.
			</p>
		</div>
	{/if}
</div>