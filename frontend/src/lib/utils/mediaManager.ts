import { ComponentId } from '$lib/enums';
import { lockVisibility, unlockVisibility, showComponent } from '$lib/stores/viewport/visibility';
import { writable, type Writable } from 'svelte/store';
import { scrollUtils } from './viewport';

export interface VideoOverlayState {
	show: boolean;
	videoUrl: string;
	captionUrl?: string;
	captionLanguage?: string;
	captionLabel?: string;
}

export interface MediaManagerConfig {
	autoPlay?: boolean;
	autoPlayDelay?: number;
	closeOnVideoEnd?: boolean;
	closeOnBackdropClick?: boolean;
	closeOnEscape?: boolean;
	preload?: 'none' | 'metadata' | 'auto';
}

export class MediaManager {
	private videoElement: HTMLVideoElement | undefined;
	private overlayState: Writable<VideoOverlayState>;
	private config: MediaManagerConfig;

	constructor(config: MediaManagerConfig = {}) {
		this.config = {
			autoPlay: true,
			autoPlayDelay: 300,
			closeOnVideoEnd: true,
			closeOnBackdropClick: true,
			closeOnEscape: true,
			preload: 'metadata',
			...config
		};

		this.overlayState = writable({
			show: false,
			videoUrl: '',
			captionUrl: '',
			captionLanguage: 'en',
			captionLabel: 'English captions'
		});
	}

	// Getter untuk state
	get state() {
		return this.overlayState;
	}

	// Setter untuk video element
	setVideoElement(element: HTMLVideoElement | undefined) {
		this.videoElement = element;
	}

	// Open video overlay
	openVideo(
		videoUrl: string,
		options?: {
			captionUrl?: string;
			captionLanguage?: string;
			captionLabel?: string;
		}
	) {
		this.overlayState.update(state => ({
			...state,
			show: true,
			videoUrl,
			captionUrl: options?.captionUrl || '',
			captionLanguage: options?.captionLanguage || 'en',
			captionLabel: options?.captionLabel || 'English captions'
		}));

		this.handleOpen();
	}

	// Close video overlay
	closeVideo() {
		this.overlayState.update(state => ({
			...state,
			show: false
		}));

		this.handleClose();
	}

	// Handle overlay open
	private handleOpen() {

		// Browser check untuk SSR safety
		if (typeof document !== 'undefined') {
			document.body.style.overflow = 'hidden';
		}

		if (this.config.autoPlay && this.config.autoPlayDelay && this.config.autoPlayDelay > 0) {
			setTimeout(() => {
				this.playVideo();
			}, this.config.autoPlayDelay);
		} else if (this.config.autoPlay) {
			this.playVideo();
		}

		this.lockVideo();
	}

	// Handle overlay close
	private handleClose() {
		
		// Browser check untuk SSR safety
		if (typeof document !== 'undefined') {
			document.body.style.overflow = 'auto';
		}

		if (this.videoElement) {
			this.videoElement.pause();
			this.videoElement.currentTime = 0;
		}

		this.unlockVideo();
	}

	// Lock visibility component to false and disable scroll
	private lockVideo() {
		scrollUtils.disable();
		lockVisibility([
			ComponentId.Highlight,
			ComponentId.LanguageSwitch,
			ComponentId.Operation,
			ComponentId.Schedule,
			ComponentId.Navigation
		], false);
	}

	// Unlock visibility component and enable scroll
	private unlockVideo() {
		scrollUtils.enable();
		unlockVisibility([
			ComponentId.Highlight,
			ComponentId.LanguageSwitch,
			ComponentId.Operation,
			ComponentId.Schedule,
			ComponentId.Navigation
		]);

		// Show navigation component
		showComponent([
			ComponentId.Highlight,
			ComponentId.LanguageSwitch,
			ComponentId.Operation,
			ComponentId.Schedule,
			ComponentId.Navigation
		]);
	}

	// Play video
	playVideo() {
		if (this.videoElement) {
			this.videoElement.play().catch((error) => {
				console.warn('Video autoplay failed:', error);
			});
		}
	}

	// Pause video
	pauseVideo() {
		if (this.videoElement) {
			this.videoElement.pause();
		}
	}

	// Reset video
	resetVideo() {
		if (this.videoElement) {
			this.videoElement.currentTime = 0;
		}
	}

	// Handle video ended
	handleVideoEnded() {
		if (this.config.closeOnVideoEnd) {
			this.closeVideo();
		}
	}

	// Handle backdrop click
	handleBackdropClick(event: KeyboardEvent | MouseEvent) {
		if (this.config.closeOnBackdropClick && event.target === event.currentTarget) {
			this.closeVideo();
		}
	}

	// Handle keyboard events
	handleKeydown(event: KeyboardEvent) {
		if (this.config.closeOnEscape && event.key === 'Escape') {
			this.closeVideo();
		}
	}

	// Get current config
	getConfig() {
		return { ...this.config };
	}

	// Update config
	updateConfig(newConfig: Partial<MediaManagerConfig>) {
		this.config = { ...this.config, ...newConfig };
	}

	// Destroy manager (cleanup)
	destroy() {
		this.closeVideo();
		this.videoElement = undefined;
	}
}

// Factory function untuk membuat media manager instance
export function createMediaManager(config?: MediaManagerConfig) {
	return new MediaManager(config);
}

// Utility functions
export const mediaUtils = {
	// Format video duration
	formatDuration(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = Math.floor(seconds % 60);

		if (hours > 0) {
			return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
		}
		return `${minutes}:${secs.toString().padStart(2, '0')}`;
	},

	// Check if video can autoplay
	async canAutoplay(videoElement: HTMLVideoElement): Promise<boolean> {
		try {
			await videoElement.play();
			videoElement.pause();
			return true;
		} catch {
			return false;
		}
	},

	// Get video metadata
	getVideoMetadata(videoElement: HTMLVideoElement) {
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

	// Create video thumbnail from canvas
	createThumbnail(videoElement: HTMLVideoElement, time: number = 0): Promise<string> {
		return new Promise((resolve, reject) => {
			// Browser check untuk SSR safety
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