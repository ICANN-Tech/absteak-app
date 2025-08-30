<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>ABSteak Chatbot</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .chatbot-container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 800px;
            height: 600px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .chatbot-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 24px;
            font-weight: 600;
        }

        .chat-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: #f8f9fa;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .message {
            max-width: 70%;
            padding: 12px 16px;
            border-radius: 18px;
            word-wrap: break-word;
            animation: fadeIn 0.3s ease-in;
        }

        .message.user {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            align-self: flex-end;
            margin-left: auto;
        }

        .message.bot {
            background: white;
            color: #333;
            align-self: flex-start;
            border: 1px solid #e9ecef;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .chat-input-container {
            padding: 20px;
            background: white;
            border-top: 1px solid #e9ecef;
        }

        .chat-input-form {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .chat-input {
            flex: 1;
            padding: 12px 16px;
            border: 2px solid #e9ecef;
            border-radius: 25px;
            font-size: 16px;
            outline: none;
            transition: all 0.3s ease;
        }

        .chat-input:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .send-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 80px;
        }

        .send-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .send-button:active {
            transform: translateY(0);
        }

        .send-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .clear-button {
            background: #dc3545;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 80px;
            margin-left: 10px;
        }

        .clear-button:hover {
            background: #c82333;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }

        .clear-button:active {
            transform: translateY(0);
        }

        .typing-indicator {
            display: none;
            align-self: flex-start;
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 18px;
            padding: 12px 16px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .typing-dots {
            display: flex;
            gap: 4px;
        }

        .typing-dot {
            width: 8px;
            height: 8px;
            background: #667eea;
            border-radius: 50%;
            animation: typing 1.4s infinite;
        }

        .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }

        /* Calendar Styles */
        .calendar-container {
            margin: 10px 0;
            display: flex;
            justify-content: flex-start;
        }

        .calendar-widget {
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 300px;
            font-family: Arial, sans-serif;
        }

        .calendar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding: 0 5px;
        }

        .calendar-nav-btn {
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            width: 30px;
            height: 30px;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .calendar-nav-btn:hover {
            background: #0056b3;
        }

        .calendar-month-year {
            font-weight: bold;
            font-size: 16px;
            color: #333;
        }

        .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 2px;
            margin-bottom: 15px;
        }

        .calendar-day-header {
            text-align: center;
            font-weight: bold;
            padding: 8px 4px;
            font-size: 12px;
            color: #666;
            background: #f8f9fa;
        }

        .calendar-day {
            text-align: center;
            padding: 8px 4px;
            cursor: pointer;
            border-radius: 4px;
            font-size: 14px;
            min-height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .calendar-day.selectable {
            background: #f8f9fa;
            color: #333;
        }

        .calendar-day.selectable:hover {
            background: #007bff;
            color: white;
        }

        .calendar-day.other-month {
            color: #ccc;
            cursor: default;
        }

        .calendar-day.past-date {
            color: #ccc;
            cursor: not-allowed;
            background: #f5f5f5;
        }

        .calendar-cancel-btn {
            width: 100%;
            padding: 8px 16px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }

        .calendar-cancel-btn:hover {
            background: #545b62;
        }

        /* Time Slots Styles */
        .time-slots-container {
            margin: 10px 0;
            display: flex;
            justify-content: flex-end;
        }

        .time-slots-widget {
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 400px;
            width: 100%;
        }

        .time-slots-header {
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
            color: #333;
            font-size: 16px;
        }

        .time-slots-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-bottom: 15px;
        }

        .time-slot-btn {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            padding: 8px 4px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
            text-align: center;
        }

        .time-slot-btn:hover {
            background-color: #007bff;
            color: white;
            border-color: #007bff;
        }

        .time-slots-cancel-btn {
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
        }

        .time-slots-cancel-btn:hover {
            background-color: #c82333;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes typing {
            0%, 60%, 100% {
                transform: translateY(0);
            }
            30% {
                transform: translateY(-10px);
            }
        }

        .welcome-message {
            text-align: center;
            color: #6c757d;
            font-style: italic;
            margin: 20px 0;
        }

        @media (max-width: 768px) {
            .chatbot-container {
                height: 100vh;
                border-radius: 0;
                max-width: 100%;
            }

            .message {
                max-width: 85%;
            }

            .chat-input-form {
                gap: 8px;
            }

            .send-button {
                padding: 12px 16px;
                min-width: 60px;
            }
        }
    </style>
</head>
<body>
    <div class="chatbot-container">
        <div class="chatbot-header">
            🥩 ABSteak Assistant
        </div>
        
        <div class="chat-messages" id="chatMessages">
            <div class="welcome-message">
                Welcome! I'm here to help you with reservations and answer any questions about ABSteak.
            </div>
        </div>
        
        <div class="typing-indicator" id="typingIndicator">
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
        
        <div class="chat-input-container">
            <form class="chat-input-form" id="chatForm">
                @csrf
                <input 
                    type="text" 
                    class="chat-input" 
                    id="messageInput" 
                    placeholder="Type your message here..." 
                    required
                    autocomplete="off"
                >
                <button type="submit" class="send-button" id="sendButton">
                    Send
                </button>
                <button type="button" class="clear-button" id="clearButton">
                    Clear
                </button>
            </form>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const chatForm = document.getElementById('chatForm');
            const messageInput = document.getElementById('messageInput');
            const sendButton = document.getElementById('sendButton');
            const chatMessages = document.getElementById('chatMessages');
            const typingIndicator = document.getElementById('typingIndicator');

            // Chat history management
            const CHAT_HISTORY_KEY = 'absteak_chat_history';
            let chatHistory = [];
            let reservationState = null;
            let selectedDate = null;
            let selectedTime = null;
            let userLanguage = 'en'; // Default to English
            let lastMessageBeforeCalendar = null; // Store last user message before calendar

            // Load chat history from localStorage
            loadChatHistory();

            // Focus on input when page loads
            messageInput.focus();

            // Handle form submission
            chatForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const message = messageInput.value.trim();
                if (!message) return;

                // Add user message to chat
                addMessage(message, 'user');
                
                // Clear input and disable form
                messageInput.value = '';
                setFormState(false);
                
                // Show typing indicator
                showTypingIndicator();
                
                // Send message to server
                sendMessage(message);
            });

            // Handle clear button
            document.getElementById('clearButton').addEventListener('click', function() {
                if (confirm('Are you sure you want to clear the chat history?')) {
                    clearChatHistory();
                }
            });

            function addMessage(text, sender, saveToHistory = true) {
                // Detect language from user messages
                if (sender === 'user') {
                    detectUserLanguage(text);
                }
                
                addMessageToDOM(text, sender, saveToHistory);
                
                if (saveToHistory) {
                    addToHistory(text, sender);
                }
            }

            function addMessageToDOM(text, sender, saveToHistory = true) {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${sender}`;
                messageDiv.innerHTML = text;
                
                chatMessages.appendChild(messageDiv);
                scrollToBottom();
            }

            function showTypingIndicator() {
                typingIndicator.style.display = 'block';
                scrollToBottom();
            }

            function hideTypingIndicator() {
                typingIndicator.style.display = 'none';
            }

            function setFormState(enabled) {
                messageInput.disabled = !enabled;
                sendButton.disabled = !enabled;
                sendButton.textContent = enabled ? 'Send' : 'Sending...';
            }

            function scrollToBottom() {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }

            function sendMessage(message) {
                // Check if we're in reservation flow
                if (reservationState && reservationState.startsWith('FIELD__')) {
                    handleReservationFieldInput(message);
                    return;
                }

                fetch('/chatbot/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                    body: JSON.stringify({
                        message: message
                    })
                })
                .then(response => response.json())
                .then(data => {
                    hideTypingIndicator();
                    
                    if (data.success) {
                        addMessage(data.response, 'bot');
                        
                        // Check if we need to show calendar
                        if (data.show_calendar) {
                            showCalendar();
                        }
                    } else {
                        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
                    }
                    
                    setFormState(true);
                    messageInput.focus();
                })
                .catch(error => {
                    console.error('Error:', error);
                    hideTypingIndicator();
                    addMessage('Sorry, I encountered an error. Please try again.', 'bot');
                    setFormState(true);
                    messageInput.focus();
                });
            }

            // Allow Enter key to send message
            messageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    chatForm.dispatchEvent(new Event('submit'));
                }
            });

            function showCalendar() {
                // Store the last user message before showing calendar
                lastMessageBeforeCalendar = getLastUserMessage();
                
                // Disable chat input
                setFormState(false);
                
                // Create calendar container
                const calendarContainer = document.createElement('div');
                calendarContainer.className = 'calendar-container';
                calendarContainer.id = 'calendarContainer';
                
                // Create calendar widget
                const calendar = createCalendarWidget();
                calendarContainer.appendChild(calendar);
                
                // Add to chat messages
                chatMessages.appendChild(calendarContainer);
                scrollToBottom();
            }

            function createCalendarWidget() {
                const calendarDiv = document.createElement('div');
                calendarDiv.className = 'calendar-widget';
                
                // Create header
                const header = document.createElement('div');
                header.className = 'calendar-header';
                
                const currentDate = new Date();
                const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
                
                const prevBtn = document.createElement('button');
                prevBtn.innerHTML = '‹';
                prevBtn.className = 'calendar-nav-btn';
                
                const nextBtn = document.createElement('button');
                nextBtn.innerHTML = '›';
                nextBtn.className = 'calendar-nav-btn';
                
                const monthYear = document.createElement('span');
                monthYear.className = 'calendar-month-year';
                monthYear.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
                
                header.appendChild(prevBtn);
                header.appendChild(monthYear);
                header.appendChild(nextBtn);
                
                // Create calendar grid
                const grid = document.createElement('div');
                grid.className = 'calendar-grid';
                
                // Add day headers
                const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                dayHeaders.forEach(day => {
                    const dayHeader = document.createElement('div');
                    dayHeader.className = 'calendar-day-header';
                    dayHeader.textContent = day;
                    grid.appendChild(dayHeader);
                });
                
                // Add calendar days
                const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                const startDate = new Date(firstDay);
                startDate.setDate(startDate.getDate() - firstDay.getDay());
                
                for (let i = 0; i < 42; i++) {
                    const dayDiv = document.createElement('div');
                    dayDiv.className = 'calendar-day';
                    
                    const currentDay = new Date(startDate);
                    currentDay.setDate(startDate.getDate() + i);
                    
                    dayDiv.textContent = currentDay.getDate();
                    
                    if (currentDay.getMonth() !== currentDate.getMonth()) {
                        dayDiv.classList.add('other-month');
                    }
                    
                    if (currentDay < new Date().setHours(0,0,0,0)) {
                        dayDiv.classList.add('past-date');
                    } else {
                        dayDiv.classList.add('selectable');
                        dayDiv.addEventListener('click', function() {
                            selectDate(currentDay);
                        });
                    }
                    
                    grid.appendChild(dayDiv);
                }
                
                // Create cancel button
                const cancelBtn = document.createElement('button');
                cancelBtn.textContent = 'Cancel';
                cancelBtn.className = 'calendar-cancel-btn';
                cancelBtn.addEventListener('click', function() {
                    hideCalendar();
                });
                
                calendarDiv.appendChild(header);
                calendarDiv.appendChild(grid);
                calendarDiv.appendChild(cancelBtn);
                
                return calendarDiv;
            }

            function selectDate(date) {
                selectedDate = date;
                const formattedDate = date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                // Add user message with selected date
                addMessage(`I would like to make a reservation for ${formattedDate}`, 'user');
                
                // Hide calendar and show time slots
                hideCalendar();
                showTimeSlots(formattedDate);
            }

            function showTimeSlots(formattedDate) {
                // Disable chat input
                setFormState(false);
                
                // Create time slots container
                const timeSlotsContainer = document.createElement('div');
                timeSlotsContainer.className = 'time-slots-container';
                timeSlotsContainer.id = 'timeSlotsContainer';
                
                // Create time slots widget
                const timeSlots = createTimeSlotsWidget(formattedDate);
                timeSlotsContainer.appendChild(timeSlots);
                
                // Add to chat messages
                chatMessages.appendChild(timeSlotsContainer);
                scrollToBottom();
            }

            function createTimeSlotsWidget(formattedDate) {
                const timeSlotsDiv = document.createElement('div');
                timeSlotsDiv.className = 'time-slots-widget';
                
                // Create header
                const header = document.createElement('div');
                header.className = 'time-slots-header';
                header.textContent = `Available times for ${formattedDate}`;
                
                // Create time slots grid
                const grid = document.createElement('div');
                grid.className = 'time-slots-grid';
                
                // Define available time slots
                const timeSlots = [
                    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
                    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
                    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
                    '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
                ];
                
                timeSlots.forEach(time => {
                    const timeSlot = document.createElement('button');
                    timeSlot.className = 'time-slot-btn';
                    timeSlot.textContent = time;
                    timeSlot.addEventListener('click', function() {
                        selectTimeSlot(time);
                    });
                    grid.appendChild(timeSlot);
                });
                
                // Create cancel button
                const cancelBtn = document.createElement('button');
                cancelBtn.textContent = 'Cancel';
                cancelBtn.className = 'time-slots-cancel-btn';
                cancelBtn.addEventListener('click', function() {
                    hideTimeSlots();
                });
                
                timeSlotsDiv.appendChild(header);
                timeSlotsDiv.appendChild(grid);
                timeSlotsDiv.appendChild(cancelBtn);
                
                return timeSlotsDiv;
            }

            function selectTimeSlot(time) {
                selectedTime = time;
                const formattedDate = selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                // Add user message with selected time
                addMessage(`I would like to reserve a table for ${formattedDate} at ${time}`, 'user');
                
                // Hide time slots
                hideTimeSlots();
                
                // Start reservation form flow
                reservationState = 'FIELD__NAME';
                startReservationFlow();
            }

            function hideTimeSlots() {
                const timeSlotsContainer = document.getElementById('timeSlotsContainer');
                if (timeSlotsContainer) {
                    timeSlotsContainer.remove();
                }
                
                // Don't re-enable chat input here - it will be handled by the reservation flow
            }

            function startReservationFlow() {
                // Start with asking for name
                askForField('FIELD__NAME');
            }

            function askForField(fieldType) {
                // Use the stored message from before calendar was shown
                const prompt = lastMessageBeforeCalendar || 'Please provide the requested information.';
                
                // Show typing indicator
                showTypingIndicator();
                
                // Send request to asking_chatid flow
                fetch('/chatbot/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                    body: JSON.stringify({
                        message: prompt,
                        chatflow_id: 'asking_chatid',
                        field_type: fieldType,
                        context: lastMessageBeforeCalendar,
                        reservation_data: {
                            date: selectedDate,
                            time: selectedTime
                        }
                    })
                })
                .then(response => response.json())
                .then(data => {
                    hideTypingIndicator();
                    if (data.response) {
                        addMessage(data.response, 'bot');
                        // Set up to capture the next user input for this field
                        reservationState = fieldType;
                        // Re-enable input for user to respond
                        setFormState(true);
                        messageInput.focus();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    hideTypingIndicator();
                    addMessage('Sorry, there was an error processing your request.', 'bot');
                    setFormState(true);
                    messageInput.focus();
                });
            }

            function getLocalizedPrompt(englishPrompt) {
                // Simple translation based on detected language
                if (userLanguage === 'id') {
                    const translations = {
                        'What is your name?': 'Siapa nama Anda?',
                        'How many people will be dining?': 'Berapa orang yang akan makan?',
                        'Any special requests or dietary restrictions?': 'Apakah ada permintaan khusus atau pantangan makanan?'
                    };
                    return translations[englishPrompt] || englishPrompt;
                }
                return englishPrompt;
            }

            function handleReservationFieldInput(message) {
                // Store the field data
                if (!window.reservationData) {
                    window.reservationData = {};
                }
                
                switch(reservationState) {
                    case 'FIELD__NAME':
                        window.reservationData.name = message;
                        reservationState = 'FIELD__NUMBER_OF_PEOPLE';
                        askForField('FIELD__NUMBER_OF_PEOPLE');
                        break;
                    case 'FIELD__NUMBER_OF_PEOPLE':
                        window.reservationData.numberOfPeople = message;
                        reservationState = 'FIELD__ADDITIONAL_INFORMATION';
                        askForField('FIELD__ADDITIONAL_INFORMATION');
                        break;
                    case 'FIELD__ADDITIONAL_INFORMATION':
                        window.reservationData.additionalInfo = message;
                        completeReservation();
                        break;
                }
            }

            function completeReservation() {
                // Send final reservation data to server
                const reservationSummary = {
                    date: selectedDate,
                    time: selectedTime,
                    name: window.reservationData.name,
                    numberOfPeople: window.reservationData.numberOfPeople,
                    additionalInfo: window.reservationData.additionalInfo
                };
                
                fetch('/chatbot/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                    body: JSON.stringify({
                        message: 'COMPLETE_RESERVATION',
                        reservation_data: reservationSummary
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.response) {
                        addMessage(data.response, 'bot');
                    }
                    // Reset reservation state
                    reservationState = null;
                    selectedDate = null;
                    selectedTime = null;
                    window.reservationData = null;
                })
                .catch(error => {
                    console.error('Error:', error);
                    addMessage('Sorry, there was an error completing your reservation.', 'bot');
                });
            }

            function hideCalendar() {
                const calendarContainer = document.getElementById('calendarContainer');
                if (calendarContainer) {
                    calendarContainer.remove();
                }
                
                // Re-enable chat input
                setFormState(true);
                messageInput.focus();
            }

            // Chat history management functions
            function loadChatHistory() {
                try {
                    const saved = localStorage.getItem(CHAT_HISTORY_KEY);
                    if (saved) {
                        chatHistory = JSON.parse(saved);
                        // Restore chat messages
                        chatHistory.forEach(message => {
                            if (message.type !== 'system') {
                                addMessageToDOM(message.text, message.sender, false);
                            }
                        });
                        scrollToBottom();
                    }
                } catch (error) {
                    console.error('Error loading chat history:', error);
                    chatHistory = [];
                }
            }

            function saveChatHistory() {
                try {
                    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
                } catch (error) {
                    console.error('Error saving chat history:', error);
                }
            }

            function addToHistory(text, sender, type = 'message') {
                chatHistory.push({
                    text: text,
                    sender: sender,
                    type: type,
                    timestamp: new Date().toISOString()
                });
                saveChatHistory();
            }

            function clearChatHistory() {
                chatHistory = [];
                localStorage.removeItem(CHAT_HISTORY_KEY);
                // Clear DOM messages except welcome message
                const messages = chatMessages.querySelectorAll('.message');
                messages.forEach(msg => msg.remove());
            }

            function detectUserLanguage(message) {
                // Simple language detection based on common words
                const indonesianWords = ['tolong', 'buatkan', 'reservasi', 'meja', 'nama', 'saya', 'untuk', 'orang', 'jam', 'tanggal'];
                const lowerMessage = message.toLowerCase();
                
                let indonesianCount = 0;
                indonesianWords.forEach(word => {
                    if (lowerMessage.includes(word)) {
                        indonesianCount++;
                    }
                });
                
                if (indonesianCount >= 2) {
                    userLanguage = 'id';
                } else {
                    userLanguage = 'en';
                }
            }

            function getLastUserMessage() {
                for (let i = chatHistory.length - 1; i >= 0; i--) {
                    if (chatHistory[i].sender === 'user' && chatHistory[i].type === 'message') {
                        return chatHistory[i].text;
                    }
                }
                return null;
            }
        });
    </script>
</body>
</html>