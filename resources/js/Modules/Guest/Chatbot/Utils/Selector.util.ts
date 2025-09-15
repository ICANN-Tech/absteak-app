import { chatbotService } from '../Services/Chatbot.service';
import { chatUtils, ChatUtils } from './Chat.util';
import type { MessageType } from '../Types/Message.type';
import { MessageFrom } from '../Types/Message.type';

// Handle menu button selection - enhanced version with proper CS state management
export async function selectMenu(
  menu: string,
  sendMessage: (messageText: string, clearInput: boolean) => Promise<void>,
  // State parameters passed from parent component
  csConnectionState: string,
  loading: boolean,
  disabled: boolean,
  initialMessage: string,
  // State setters passed from parent component
  setActiveMenu: (menu: string) => void,
  setMessages: (messages: MessageType[]) => void,
  setCSConnectionState: (state: string) => void
): Promise<void> {
  if (loading || disabled) return;

  if (menu === 'CS') {
    console.log('🎧 [Selector] CS button clicked, current state:', csConnectionState);
    
    if (csConnectionState === 'idle' || csConnectionState === 'disconnected') {
      // Start connecting to CS
      console.log('🚀 [Selector] Starting CS connection...');
      setActiveMenu(menu);
      setMessages([]);
      
      try {
        // Set connecting state immediately for UI feedback
        setCSConnectionState('connecting');
        
        // Add connecting message
        const connectingMessage: MessageType = {
          from: MessageFrom.Bot,
          message: 'Menghubungkan ke customer service...',
          timestamp: new Date(),
          id: ChatUtils.generateMessageId('connecting')
        };
        setMessages([connectingMessage]);
        
        await chatbotService.connectToCS();
        console.log('✅ [Selector] CS connection successful');
        
      } catch (err) {
        console.error('❌ [Selector] CS connection failed:', err);
        chatUtils.errors.logError('CS connection', err);
        
        // Reset to idle state on error
        setCSConnectionState('idle');
        
        const errorMessage: MessageType = {
          from: MessageFrom.Bot,
          message: 'Gagal menghubungkan ke customer service. Silakan coba lagi.',
          timestamp: new Date(),
          id: ChatUtils.generateMessageId('error')
        };
        setMessages([errorMessage]);
      }
    } else if (csConnectionState === 'connected') {
      // Disconnect from CS (tutup komunikasi)
      console.log('🔌 [Selector] Disconnecting from CS...');
      
      try {
        await chatbotService.disconnectFromCS();
        console.log('✅ [Selector] CS disconnection successful');
        
        // Reset to general chat
        setActiveMenu('General');
        setMessages([{ 
          from: MessageFrom.Bot, 
          message: initialMessage, 
          timestamp: new Date(), 
          id: ChatUtils.generateMessageId('initial') 
        }]);
        
      } catch (err) {
        console.error('❌ [Selector] CS disconnection failed:', err);
        chatUtils.errors.logError('CS disconnection', err);
      }
    } else if (csConnectionState === 'connecting' || csConnectionState === 'waiting') {
      // Button should be disabled in these states, but handle gracefully
      console.log('⏳ [Selector] CS is already connecting/waiting, ignoring click');
      return;
    }
  } else {
    // Handle other menu items
    setActiveMenu(menu);
    const menuPrompt = chatbotService.getMenuPrompt(menu);
    await sendMessage(menuPrompt, false);
  }
}

// Create select menu handler
export function createSelectMenuHandler(
  sendMessage: (messageText: string, clearInput: boolean) => Promise<void>,
  csConnectionState: string,
  loading: boolean,
  disabled: boolean,
  initialMessage: string,
  setActiveMenu: (menu: string) => void,
  setMessages: (messages: MessageType[]) => void,
  setCSConnectionState: (state: string) => void
) {
  return (menu: string) => selectMenu(
    menu, 
    sendMessage, 
    csConnectionState, 
    loading, 
    disabled, 
    initialMessage, 
    setActiveMenu, 
    setMessages, 
    setCSConnectionState
  );
}
