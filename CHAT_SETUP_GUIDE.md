# ABSteak Chat System Setup Guide

This guide explains how to set up and use the real-time chat system for customer service in the ABSteak application.

## Overview

The chat system enables:
- **Guest users** (not logged in) to chat with customer service representatives
- **Authenticated users** to have enhanced chat experiences
- **Customer service staff** to handle multiple chat sessions simultaneously
- Real-time messaging using XMPP protocol via ejabberd server

## Architecture

The system consists of:
- **ejabberd**: XMPP server for real-time messaging
- **Laravel Backend**: API endpoints and business logic
- **Frontend Interface**: Web-based chat interface
- **Repository Pattern**: Clean data access layer
- **Service Layer**: Business logic abstraction

## Setup Instructions

### 1. Start the Services

```bash
# Start all services including ejabberd
docker-compose up -d

# Check if ejabberd is running
docker-compose ps ejabberd
```

### 2. Environment Configuration

The ejabberd service is already configured in `docker-compose.yml` with:
- **Image**: `ejabberd/ecs:25.08`
- **Ports**: 
  - 5222 (XMPP Client)
  - 5269 (XMPP Server)
  - 5280 (HTTP/BOSH)
  - 5443 (HTTPS)
- **Admin credentials**: admin/admin_password_2024
- **Domain**: absteak.local

### 3. Laravel Configuration

Add these variables to your `.env` file:

```env
# Ejabberd Chat Configuration
EJABBERD_HOST=ejabberd
EJABBERD_PORT=5280
EJABBERD_ADMIN_USER=admin
EJABBERD_ADMIN_PASSWORD=admin_password_2024
EJABBERD_DOMAIN=absteak.local

# Chat Settings
CHAT_GUEST_PREFIX=guest_
CHAT_CS_GROUP=customer_service
CHAT_DEFAULT_ROOM=support
CHAT_WEBSOCKET_URL=ws://localhost:5280/ws
CHAT_BOSH_URL=http://localhost:5280/http-bind
CHAT_ALLOW_GUEST=true
CHAT_AUTO_ASSIGN_CS=true
CHAT_MAX_CONCURRENT=5
CHAT_TIMEOUT=1800
```

## Usage Guide

### For Guests (Non-logged in users)

1. **Access the chat interface**:
   ```
   http://localhost:8000/chat
   ```

2. **Start a chat session**:
   - Enter your name (optional)
   - Click "Start Chat"
   - System automatically assigns available customer service

3. **Chat features**:
   - Real-time messaging
   - Connection status indicator
   - Assigned customer service info
   - End chat functionality

### For Customer Service Staff

1. **Initialize CS chat session** (API):
   ```bash
   curl -X POST http://localhost:8000/api/chat/cs/initialize \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{}'
   ```

2. **Get available CS staff**:
   ```bash
   curl -X GET http://localhost:8000/api/chat/cs/available \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

3. **View chat statistics**:
   ```bash
   curl -X GET http://localhost:8000/api/chat/statistics \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

### For Authenticated Users

1. **Initialize user chat**:
   ```bash
   curl -X POST http://localhost:8000/api/chat/user/initialize \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{}'
   ```

## API Endpoints

### Guest Chat
- `POST /api/chat/guest/initialize` - Initialize guest chat session
- `POST /api/chat/guest/assign-cs` - Manually assign customer service

### Authenticated User Chat
- `POST /api/chat/user/initialize` - Initialize user chat session
- `POST /api/chat/cs/initialize` - Initialize customer service chat
- `GET /api/chat/cs/available` - Get available customer service staff
- `GET /api/chat/statistics` - Get chat statistics

### Common Chat Operations
- `POST /api/chat/send-message` - Send a message
- `POST /api/chat/end-session` - End chat session

## Code Structure

### Repository Layer
```php
// app/Repositories/Chat/ChatRepository.php
$chatRepo = new ChatRepository();
$chatRepo->createUser('username', 'password');
$chatRepo->sendMessage('from', 'to', 'message');
```

### Service Layer
```php
// app/Services/Chat.php
$chatService = new Chat($chatRepository);
$guestData = $chatService->initializeGuestChat('Guest Name');
$csData = $chatService->initializeCustomerServiceChat($user);
```

### Controller Layer
```php
// app/Http/Controllers/ChatController.php
// Handles HTTP requests and responses
// Validates input and calls service methods
```

## Configuration Files

### Chat Configuration
```php
// config/chat.php
return [
    'ejabberd_host' => env('EJABBERD_HOST', 'ejabberd'),
    'admin_user' => env('EJABBERD_ADMIN_USER', 'admin'),
    // ... other settings
];
```

## Frontend Integration

The chat interface uses:
- **Strophe.js**: XMPP client library
- **BOSH**: HTTP binding for XMPP
- **Tailwind CSS**: Styling
- **Vanilla JavaScript**: No framework dependencies

### Key Frontend Features
- Auto-connection to XMPP server
- Real-time message display
- Connection status monitoring
- Responsive design
- Error handling

## Troubleshooting

### Common Issues

1. **ejabberd not starting**:
   ```bash
   # Check logs
   docker-compose logs ejabberd
   
   # Restart service
   docker-compose restart ejabberd
   ```

2. **Connection refused**:
   - Verify ejabberd is running on port 5280
   - Check firewall settings
   - Ensure BOSH module is enabled

3. **Authentication failed**:
   - Verify admin credentials in docker-compose.yml
   - Check domain configuration

4. **Messages not sending**:
   - Check XMPP connection status
   - Verify user exists in ejabberd
   - Check roster (contact list)

### Debug Commands

```bash
# Check ejabberd status
docker exec -it absteak_ejabberd ejabberdctl status

# List registered users
docker exec -it absteak_ejabberd ejabberdctl registered_users absteak.local

# Check connected users
docker exec -it absteak_ejabberd ejabberdctl connected_users_info

# Test BOSH endpoint
curl -X POST http://localhost:5280/http-bind \
  -H "Content-Type: text/xml" \
  -d '<body rid="1" xmlns="http://jabber.org/protocol/httpbind"/>'
```

## Security Considerations

1. **Production Setup**:
   - Change default admin password
   - Use HTTPS for BOSH connections
   - Implement proper authentication
   - Set up SSL certificates

2. **Rate Limiting**:
   - Implement message rate limits
   - Limit concurrent connections
   - Monitor resource usage

3. **Data Privacy**:
   - Consider message encryption
   - Implement chat history cleanup
   - Follow GDPR compliance if applicable

## Performance Optimization

1. **Caching**:
   - User sessions cached in Redis
   - Connection pooling
   - Efficient roster management

2. **Scaling**:
   - ejabberd clustering for high availability
   - Load balancing for multiple instances
   - Database optimization

## Monitoring

The system includes:
- Connection status monitoring
- Chat statistics API
- Error logging
- Performance metrics via Prometheus (if configured)

## Next Steps

1. **Customize the UI** to match your brand
2. **Implement file sharing** capabilities
3. **Add chat history** persistence
4. **Create admin dashboard** for managing chats
5. **Implement push notifications** for mobile
6. **Add chatbot integration** for automated responses

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review ejabberd logs
3. Test API endpoints with curl
4. Verify environment configuration

---

**Note**: This chat system is designed for customer service use cases. For production deployment, ensure proper security measures, monitoring, and backup strategies are in place.