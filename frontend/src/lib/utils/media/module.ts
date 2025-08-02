
export interface VideoConfig {
	autoPlay?: boolean;
	autoPlayDelay?: number;
	closeOnVideoEnd?: boolean;
	closeOnBackdropClick?: boolean;
	closeOnEscape?: boolean;
	preload?: 'none' | 'metadata' | 'auto';
}

export interface MediaModule {
    /**
     * Sets the video element to be monitored.
     * 
     * @param element The video element to be monitored.
     */
    setVideoElement: (element: HTMLVideoElement | undefined) => void;

    /**
     * Returns the video element being monitored.
     */
    getVideoElement: () => HTMLVideoElement | undefined;

    /**
     * Opens a video in the video element.
     * 
     * @param videoUrl The URL of the video to be opened.
     * @param options Optional configuration for the video.
     */
    openVideo: (
        videoUrl: string,
        options?: {
			captionUrl?: string;
			captionLanguage?: string;
			captionLabel?: string;
        }
    ) => void;

    /**
     * Closes the video in the video element.
     */
    closeVideo: () => void;
    
    /**
     * Handles the opening of the video element.
     */
    handleOpen: () => void;

    /**
     * Handles the closing of the video element.
     */
    handleClose: () => void;

    /**
     * Locks the video element.
     */
    lockVideo: () => void;

    /**
     * Unlocks the video element.
     */
    unlockVideo: () => void;

    /**
     * Toggles the video element.
     */
    toggleVideo: () => void;

    /**
     * Toggles the video element.
     */
    toggleLock: () => void;

    /**
     * Plays the video element.
     */
    playVideo: () => void;

    /**
     * Pauses the video element.
     */
    pauseVideo: () => void;

    /**
     * Toggles the video element.
     */
    togglePlay: () => void;

    /**
     * Mutes the video element.
     */
    muteVideo: () => void;

    /**
     * Unmutes the video element.
     */
    unmuteVideo: () => void;

    /**
     * Toggles the video element.
     */
    toggleMute: () => void;

    /**
     * Handles the video ended event.
     */
    handleVideoEnded: () => void;

    /**
     * Handles the video fullscreen event.
     */
    handleVideoFullscreen: () => void;

    /**
     * Handles the backdrop click event.
     * 
     * @param event The click event.
     */
    handleBackdropClick: (event: KeyboardEvent | MouseEvent) => void;

    /**
     * Handles the keyboard event.
     * 
     * @param event The keyboard event.
     */
    handleKeydown: (event: KeyboardEvent) => void;

    /**
     * Handles the keyboard event.
     * 
     * @param event The keyboard event.
     */
    handleKeyup: (event: KeyboardEvent) => void;

    /**
     * Returns the configuration of the video element.
     */
    getConfig: () => void;

    /**
     * Sets the configuration of the video element.
     * 
     * @param config The configuration to be set.
     */
    setConfig: (config: VideoConfig) => void;

    /**
     * Updates the configuration of the video element.
     * 
     * @param config The configuration to be updated.
     */
    updateConfig: (config: Partial<VideoConfig>) => void;

    /**
     * Resets the configuration of the video element.
     */
    resetConfig: () => void;

    /**
     * Destroys the video element.
     */
    destroy: () => void;
}

export interface UtilityModule {
    /**
     * Formats the duration of a video.
     * 
     * @param seconds The duration in seconds.
     * @returns The formatted duration.
     */
    formatDuration: (seconds: number) => string;

    /**
     * Formats the duration of a video.
     * 
     * @param seconds The duration in seconds.
     * @returns The formatted duration.
     */
    formatTime: (seconds: number) => string;

    /**
     * Formats the duration of a video.
     * 
     * @param seconds The duration in seconds.
     * @returns The formatted duration.
     */
    formatBytes: (bytes: number) => string;

    /**
     * Formats the duration of a video.
     * 
     * @param seconds The duration in seconds.
     * @returns The formatted duration.
     */
    formatFileSize: (bytes: number) => string;

    /**
     * Formats the duration of a video.
     * 
     * @param seconds The duration in seconds.
     * @returns The formatted duration.
     */
    formatDataSize: (bytes: number) => string;

    /**
     * Formats the duration of a video.
     * 
     * @param seconds The duration in seconds.
     * @returns The formatted duration.
     */
    formatBitrate: (bytes: number) => string;

    /**
     * Checks if the video can autoplay.
     * 
     * @param videoElement The video element to check.
     * @returns True if the video can autoplay, false otherwise.
     */
    canAutoPlay: (videoElement: HTMLVideoElement) => Promise<boolean>;

    /**
     * Returns the metadata of the video element.
     * 
     * @param videoElement The video element to get the metadata from.
     * @returns The metadata of the video element.
     */
    getVideoMetadata: (videoElement: HTMLVideoElement) => Promise<{
        duration: number;
        currentTime: number;
        buffered: TimeRanges;
        readyState: number;
        videoWidth: number;
        videoHeight: number;
        volume: number;
        muted: boolean;
        paused: boolean;
        ended: boolean;
    }>;

    /**
     * Creates a thumbnail of the video element.
     * 
     * @param videoElement The video element to create the thumbnail from.
     * @param time The time in seconds to create the thumbnail from.
     * @returns The thumbnail of the video element.
     */
    createThumbnail: (videoElement: HTMLVideoElement, time: number) => Promise<string>;
}

export interface ManagerConfig {
	autoPlay?: boolean;
	autoPlayDelay?: number;
	closeOnVideoEnd?: boolean;
	closeOnBackdropClick?: boolean;
	closeOnEscape?: boolean;
	preload?: 'none' | 'metadata' | 'auto';
}

export interface ManagerModule {
    media: MediaModule;
    utility: UtilityModule;
    createMediaManager: (config?: ManagerConfig) => void;
}