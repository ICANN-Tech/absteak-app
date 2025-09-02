/**
 * Flowise Chatbot API Types
 * Defines the request and response interfaces for Flowise chatbot integration
 */

/**
 * Request payload for sending messages to Flowise chatbot
 */
export interface FlowiseRequest {
	/** The user's question or message */
	question: string;
	/** Override configuration for the chatbot */
	overrideConfig: Record<string, any>;
}

/**
 * Response payload from Flowise chatbot
 */
export interface FlowiseResponse {
	/** The chatbot's response text */
	text: string;
	/** The original question that was asked */
	question: string;
	/** Unique identifier for the chat session */
	chatId: string;
	/** Unique identifier for this specific message */
	chatMessageId: string;
	/** Indicates if the stream is valid */
	isStreamValid: string;
	/** Session identifier for maintaining conversation context */
	sessionId: string;
}

/**
 * Configuration for Flowise API connection
 */
export interface FlowiseConfig {
	/** Base URL of the Flowise server */
	baseUrl: string;
	/** Flowise chatbot ID */
	chatflowId: string;
}

/**
 * Error response from Flowise API
 */
export interface FlowiseError {
	/** Error message */
	message: string;
	/** HTTP status code */
	status?: number;
	/** Additional error details */
	details?: any;
}

/**
 * Chat message interface for internal use
 */
export interface ChatMessage {
	/** Unique identifier for the message */
	id: string;
	/** Message content */
	content: string;
	/** Message sender (user or bot) */
	sender: 'user' | 'bot';
	/** Timestamp when message was created */
	timestamp: Date;
	/** Optional session ID for grouping messages */
	sessionId?: string;
}

/**
 * Chat session interface
 */
export interface ChatSession {
	/** Unique session identifier */
	id: string;
	/** Array of messages in this session */
	messages: ChatMessage[];
	/** Session creation timestamp */
	createdAt: Date;
	/** Last activity timestamp */
	lastActivity: Date;
	/** Session status */
	status: 'active' | 'inactive' | 'ended';
}