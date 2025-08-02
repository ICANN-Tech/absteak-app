import { ComponentId } from '$lib/enums';
import { lockVisibility, unlockVisibility, showComponent } from '$lib/stores/viewport/visibility';
import { writable, type Writable } from 'svelte/store';
import { scrollUtils } from '../viewport';
import type { VideoConfig, MediaModule, UtilityModule, ManagerConfig, ManagerModule } from './module';

export interface VideoOverlayState {
	show: boolean;
	videoUrl: string;
	captionUrl?: string;
	captionLanguage?: string;
	captionLabel?: string;
}

/**
 * Creates a media module that implements the MediaModule interface
 */
function createMediaModule(config: VideoConfig = {}): MediaModule {
	let videoElement: HTMLVideoElement | undefined;
	const overlayState: Writable<VideoOverlayState> = writable({
		show: false,
		videoUrl: '',
		captionUrl: '',
		captionLanguage: 'en',
		captionLabel: 'English captions'
	});

	let currentConfig: VideoConfig = {
		autoPlay: true,
		autoPlayDelay: 300,
		closeOnVideoEnd: true,
		closeOnBackdropClick: true,
		closeOnEscape: true,
		preload: 'metadata',
		...config
	};

	return {
		setVideoElement: (element: HTMLVideoElement | undefined) => {
			videoElement = element;
		},

		getVideoElement: () => videoElement,

		openVideo: (
			videoUrl: string,
			options?: {
				captionUrl?: string;
				captionLanguage?: string;
				captionLabel?: string;
			}
		) => {
			overlayState.update(state => ({
				...state,
				show: true,
				videoUrl,
				captionUrl: options?.captionUrl || '',
				captionLanguage: options?.captionLanguage || 'en',
				captionLabel: options?.captionLabel || 'English captions'
			}));

			// Handle open logic
			if (typeof document !== 'undefined') {
				document.body.style.overflow = 'hidden';
			}

			if (currentConfig.autoPlay && currentConfig.autoPlayDelay && currentConfig.autoPlayDelay > 0) {
				setTimeout(() => {
					if (videoElement) {
						videoElement.play().catch((error) => {
							console.warn('Video autoplay failed:', error);
						});
					}
				}, currentConfig.autoPlayDelay);
			} else if (currentConfig.autoPlay) {
				if (videoElement) {
					videoElement.play().catch((error) => {
						console.warn('Video autoplay failed:', error);
					});
				}
			}

			// Lock components
			scrollUtils.disable();
			lockVisibility([
				ComponentId.Highlight,
				ComponentId.LanguageSwitch,
				ComponentId.Operation,
				ComponentId.Schedule,
				ComponentId.Navigation
			], false);
		},

		closeVideo: () => {
			overlayState.update(state => ({
				...state,
				show: false
			}));

			// Handle close logic
			if (typeof document !== 'undefined') {
				document.body.style.overflow = 'auto';
			}

			if (videoElement) {
				videoElement.pause();
				videoElement.currentTime = 0;
			}

			// Unlock components
			scrollUtils.enable();
			unlockVisibility([
				ComponentId.Highlight,
				ComponentId.LanguageSwitch,
				ComponentId.Operation,
				ComponentId.Schedule,
				ComponentId.Navigation
			]);

			showComponent([
				ComponentId.Highlight,
				ComponentId.LanguageSwitch,
				ComponentId.Operation,
				ComponentId.Schedule,
				ComponentId.Navigation
			]);
		},

		handleOpen: () => {
			if (typeof document !== 'undefined') {
				document.body.style.overflow = 'hidden';
			}
		},

		handleClose: () => {
			if (typeof document !== 'undefined') {
				document.body.style.overflow = 'auto';
			}
		},

		lockVideo: () => {
			scrollUtils.disable();
			lockVisibility([
				ComponentId.Highlight,
				ComponentId.LanguageSwitch,
				ComponentId.Operation,
				ComponentId.Schedule,
				ComponentId.Navigation
			], false);
		},

		unlockVideo: () => {
			scrollUtils.enable();
			unlockVisibility([
				ComponentId.Highlight,
				ComponentId.LanguageSwitch,
				ComponentId.Operation,
				ComponentId.Schedule,
				ComponentId.Navigation
			]);
		},

		toggleVideo: () => {
			overlayState.update(state => ({
				...state,
				show: !state.show
			}));
		},

		toggleLock: () => {
			// Implementation for toggle lock functionality
			// This would need to track current lock state
		},

		playVideo: () => {
			if (videoElement) {
				videoElement.play().catch((error) => {
					console.warn('Video play failed:', error);
				});
			}
		},

		pauseVideo: () => {
			if (videoElement) {
				videoElement.pause();
			}
		},

		togglePlay: () => {
			if (videoElement) {
				if (videoElement.paused) {
					videoElement.play().catch((error) => {
						console.warn('Video play failed:', error);
					});
				} else {
					videoElement.pause();
				}
			}
		},

		muteVideo: () => {
			if (videoElement) {
				videoElement.muted = true;
			}
		},

		unmuteVideo: () => {
			if (videoElement) {
				videoElement.muted = false;
			}
		},

		toggleMute: () => {
			if (videoElement) {
				videoElement.muted = !videoElement.muted;
			}
		},

		handleVideoEnded: () => {
			if (currentConfig.closeOnVideoEnd) {
				overlayState.update(state => ({
					...state,
					show: false
				}));
			}
		},

		handleVideoFullscreen: () => {
			if (videoElement) {
				if (document.fullscreenElement) {
					document.exitFullscreen();
				} else {
					videoElement.requestFullscreen();
				}
			}
		},

		handleBackdropClick: (event: KeyboardEvent | MouseEvent) => {
			if (currentConfig.closeOnBackdropClick && event.target === event.currentTarget) {
				overlayState.update(state => ({
					...state,
					show: false
				}));
			}
		},

		handleKeydown: (event: KeyboardEvent) => {
			if (currentConfig.closeOnEscape && event.key === 'Escape') {
				overlayState.update(state => ({
					...state,
					show: false
				}));
			}
		},

		handleKeyup: (event: KeyboardEvent) => {
			// Handle keyup events if needed
		},

		getConfig: () => {
			return { ...currentConfig };
		},

		setConfig: (config: VideoConfig) => {
			currentConfig = { ...config };
		},

		updateConfig: (config: Partial<VideoConfig>) => {
			currentConfig = { ...currentConfig, ...config };
		},

		resetConfig: () => {
			currentConfig = {
				autoPlay: true,
				autoPlayDelay: 300,
				closeOnVideoEnd: true,
				closeOnBackdropClick: true,
				closeOnEscape: true,
				preload: 'metadata'
			};
		},

		destroy: () => {
			overlayState.update(state => ({
				...state,
				show: false
			}));
			videoElement = undefined;
		}
	};
}

/**
 * Creates a utility module that implements the UtilityModule interface
 */
function createUtilityModule(): UtilityModule {
	return {
		formatDuration: (seconds: number): string => {
			const hours = Math.floor(seconds / 3600);
			const minutes = Math.floor((seconds % 3600) / 60);
			const secs = Math.floor(seconds % 60);

			if (hours > 0) {
				return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
			}
			return `${minutes}:${secs.toString().padStart(2, '0')}`;
		},

		formatTime: (seconds: number): string => {
			const hours = Math.floor(seconds / 3600);
			const minutes = Math.floor((seconds % 3600) / 60);
			const secs = Math.floor(seconds % 60);

			if (hours > 0) {
				return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
			}
			return `${minutes}:${secs.toString().padStart(2, '0')}`;
		},

		formatBytes: (bytes: number): string => {
			if (bytes === 0) return '0 Bytes';
			const k = 1024;
			const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
			const i = Math.floor(Math.log(bytes) / Math.log(k));
			return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
		},

		formatFileSize: (bytes: number): string => {
			if (bytes === 0) return '0 Bytes';
			const k = 1024;
			const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
			const i = Math.floor(Math.log(bytes) / Math.log(k));
			return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
		},

		formatDataSize: (bytes: number): string => {
			if (bytes === 0) return '0 Bytes';
			const k = 1024;
			const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
			const i = Math.floor(Math.log(bytes) / Math.log(k));
			return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
		},

		formatBitrate: (bitsPerSecond: number): string => {
			if (bitsPerSecond === 0) return '0 bps';
			const k = 1000;
			const sizes = ['bps', 'Kbps', 'Mbps', 'Gbps'];
			const i = Math.floor(Math.log(bitsPerSecond) / Math.log(k));
			return parseFloat((bitsPerSecond / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
		},

		canAutoPlay: async (videoElement: HTMLVideoElement): Promise<boolean> => {
			try {
				await videoElement.play();
				videoElement.pause();
				return true;
			} catch {
				return false;
			}
		},

		getVideoMetadata: async (videoElement: HTMLVideoElement) => {
			return {
				duration: videoElement.duration,
				currentTime: videoElement.currentTime,
				buffered: videoElement.buffered,
				readyState: videoElement.readyState,
				videoWidth: videoElement.videoWidth,
				videoHeight: videoElement.videoHeight,
				volume: videoElement.volume,
				muted: videoElement.muted,
				paused: videoElement.paused,
				ended: videoElement.ended
			};
		},

		createThumbnail: (videoElement: HTMLVideoElement, time: number = 0): Promise<string> => {
			return new Promise((resolve, reject) => {
				if (typeof document === 'undefined') {
					reject(new Error('Document not available in SSR environment'));
					return;
				}

				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');

				if (!ctx) {
					reject(new Error('Canvas context not available'));
					return;
				}

				const originalTime = videoElement.currentTime;

				videoElement.currentTime = time;
				videoElement.addEventListener('seeked', function onSeeked() {
					videoElement.removeEventListener('seeked', onSeeked);

					canvas.width = videoElement.videoWidth;
					canvas.height = videoElement.videoHeight;

					ctx.drawImage(videoElement, 0, 0);

					const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
					videoElement.currentTime = originalTime;

					resolve(thumbnail);
				});
			});
		}
	};
}

/**
 * Creates a complete media manager that implements the ManagerModule interface
 */
export function createMediaManager(config?: ManagerConfig): ManagerModule {
	const media = createMediaModule(config);
	const utility = createUtilityModule();

	return {
		media,
		utility,
		createMediaManager: (newConfig?: ManagerConfig) => createMediaManager(newConfig)
	};
}

// Export individual modules for direct access
export const mediaModule = createMediaModule();
export const utilityModule = createUtilityModule();

// Export the main manager instance
export const mediaManager = createMediaManager();

// Export utility functions for convenience
export const mediaUtils = {
	formatDuration: utilityModule.formatDuration,
	formatTime: utilityModule.formatTime,
	formatBytes: utilityModule.formatBytes,
	formatFileSize: utilityModule.formatFileSize,
	formatDataSize: utilityModule.formatDataSize,
	formatBitrate: utilityModule.formatBitrate,
	canAutoPlay: utilityModule.canAutoPlay,
	getVideoMetadata: utilityModule.getVideoMetadata,
	createThumbnail: utilityModule.createThumbnail
};