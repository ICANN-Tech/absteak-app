import { chatbotService } from '../Services/Chatbot.service';
import { CHATBOT_CONFIG } from '../Const/Chatbot.const';
import { chatUtils, ChatUtils } from '../Utils/Chat.util';
import type { MessageType } from '../Types/Message.type';
import { MessageFrom } from '../Types/Message.type';
import { messages, error, chatStore } from '../Stores/Chat.store';
import { customerServiceStore, csConnectionState } from '../Stores/CustomerService.store';
import { ConnectionEnum, toConnectionEnum } from '../Enums/Connection.enum';
import { get } from 'svelte/store';

export async function initializeChatbot(initialMessage: string, closeChat: () => void) {
    try {
        await chatbotService.startNewSession();

        // CS state change callback
        chatbotService.setCSStateChangeCallback((state: string, agentName?: string) => {
            console.log('🎯 UI State Update:', state, agentName);

            // Update CS connection state using customerServiceStore actions
            switch (state) {
                case 'connecting':
                    customerServiceStore.connect();
                    break;
                case 'waiting':
                    customerServiceStore.setWaiting();
                    break;
                case 'connected':
                    customerServiceStore.setConnected(agentName || '', '', '');
                    break;
                case 'disconnected':
                    customerServiceStore.disconnect();
                    break;
                case 'error':
                    customerServiceStore.setError();
                    break;
                default:
                    customerServiceStore.reset();
            }

            console.log('🔍 CS Connection State updated to:', state);

            if (agentName && state === 'connected') {
                const joinMessage: MessageType = {
                    from: MessageFrom.CS,
                    message: `${agentName} bergabung ke percakapan`,
                    timestamp: new Date(),
                    id: ChatUtils.generateMessageId('system_join'),
                    isFromCS: true
                };
                chatStore.addMessage(joinMessage);
            } else if (state === 'disconnected') {
                const leaveMessage: MessageType = {
                    from: MessageFrom.CS,
                    message: 'CS KELUAR',
                    timestamp: new Date(),
                    id: ChatUtils.generateMessageId('system_leave'),
                    isFromCS: true
                };
                chatStore.addMessage(leaveMessage);
            }

            if (state === 'connecting') {
                const connectingMessage: MessageType = {
                    from: MessageFrom.Bot,
                    message: 'Connecting to customer service...',
                    timestamp: new Date(),
                    id: ChatUtils.generateMessageId('system_connecting')
                };
                chatStore.addMessage(connectingMessage);
            } else if (state === 'waiting') {
                const waitingMessage: MessageType = {
                    from: MessageFrom.Bot,
                    message: 'Waiting for customer service agent to join...',
                    timestamp: new Date(),
                    id: ChatUtils.generateMessageId('system_waiting')
                };
                chatStore.addMessage(waitingMessage);
            }
        });

        // Message callback for real-time CS messages
        chatbotService.setMessageCallback((chatMessage) => {
            const messageType: MessageType = {
                from: chatMessage.sender === 'user' ? MessageFrom.User : MessageFrom.CS,
                message: chatMessage.content,
                timestamp: chatMessage.timestamp,
                id: chatMessage.id,
                isFromCS: true
            };
            chatStore.addMessage(messageType);
        });

        // Close chat callback for when agent leaves
        chatbotService.setCloseChatCallback(() => {
            console.log('🚪 [Initialize] Agent left - closing chat dialog');
            closeChat();
        });

        // Set initial message
        messages.set([{ from: MessageFrom.Bot, message: initialMessage, timestamp: new Date() }]);

        // Test connection
        const isConnected = await chatbotService.testConnection();
        if (!isConnected) {
            error.set(CHATBOT_CONFIG.ERROR_MESSAGES.CONNECTION_FAILED);
        }
    } catch (err) {
        chatUtils.errors.logError('initialization', err);
        error.set(CHATBOT_CONFIG.ERROR_MESSAGES.INITIALIZATION_FAILED);
    }

    // Event listeners
    const handleKeydown = (e: KeyboardEvent) => chatUtils.events.handleEscape(e, closeChat);
    const handleClickOutside = (e: MouseEvent) =>
        chatUtils.events.handleClickOutside(e, ['.chat-dialog', '.chat-button-container'], closeChat);
    
    // Handle application close/refresh - trigger force-end-chat if connected to CS
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        // Check if currently connected to CS
        const currentState = get(csConnectionState);
        if (currentState === 'connected') {
            // Trigger force-end-chat event to notify CS that customer is closing the application
            chatbotService.disconnectFromCS();
        }
    };

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
        document.removeEventListener('keydown', handleKeydown);
        document.removeEventListener('click', handleClickOutside);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        chatbotService.endCurrentSession();
    };
}
