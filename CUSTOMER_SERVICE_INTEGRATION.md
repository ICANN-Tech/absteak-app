# Customer Service Integration Documentation

## Overview

This system integrates Flowise chatbot with customer service functionality, allowing seamless transfer from automated chat to human customer service representatives.

## Architecture

The system consists of three main repositories:

1. **Chat Repository** (`app/Repositories/Chat/`)
   - `ChatRepository.php`: Handles ejabberd chat server operations
   - `ChatIntegrationRepository.php`: Manages Flowise and CS integration
   - `ChatServiceInterface.php`: Defines the contract for chat services

2. **Flowise Repository** (`app/Repositories/Flowise/`)
   - `FlowiseRepository.php`: Manages Flowise chatbot interactions

3. **Customer Support Repository** (`app/Repositories/CustomerSupport/`)
   - `CustomerSupportRepository.php`: Handles CS agent management and ticket operations

## Database Structure

### Customer Services Table
```sql
customer_services:
- id (UUID, Primary Key)
- user_id (Foreign Key to users table)
- name (String)
- email (String)
- department (String)
- skills (JSON)
- is_available (Boolean)
- max_concurrent_tickets (Integer)
- working_hours (JSON)
- created_at/updated_at (Timestamps)
```

### Tickets Table
```sql
tickets:
- id (UUID, Primary Key)
- ticket_number (String, Unique)
- customer_service_id (Foreign Key to customer_services)
- user_id (Foreign Key to users, nullable)
- status (Enum: open, in_progress, resolved, closed)
- priority (Enum: low, medium, high, urgent)
- category (String)
- subject (String)
- description (Text)
- customer_name (String)
- customer_email (String, nullable)
- customer_phone (String, nullable)
- customer_id (String, nullable)
- chat_session_data (JSON, nullable)
- resolution_notes (Text, nullable)
- assigned_at/resolved_at/closed_at (Timestamps, nullable)
- created_at/updated_at (Timestamps)
```

## Installation & Setup

### 1. Run Database Migration

```bash
php artisan migrate
```

This will create the `customer_services` and `tickets` tables using the existing migration file.

### 2. Seed Customer Service Representatives

```bash
php artisan db:seed --class=CustomerServiceSeeder
```

This will create:
- 5 test customer service representatives
- Associated user accounts with proper roles
- Sample departments: Technical Support, Billing, General Inquiry
- Various skill sets and working hours

### 3. Register the Seeder (if needed)

Add to `database/seeders/DatabaseSeeder.php`:

```php
public function run()
{
    $this->call([
        CustomerServiceSeeder::class,
        // ... other seeders
    ]);
}
```

## Usage

### 1. Initialize Chat Session

#### For Guest Users:
```php
$chatService = new ChatIntegrationRepository(
    new FlowiseRepository(),
    new CustomerSupportRepository()
);

$session = $chatService->initializeGuestChat([
    'name' => 'John Doe',
    'email' => 'john@example.com'
]);
```

#### For Authenticated Users:
```php
$session = $chatService->initializeUserChat($userId, [
    'name' => 'Jane Smith',
    'email' => 'jane@example.com'
]);
```

### 2. Send Messages to Chatbot

```php
$response = $chatService->sendMessageToBot(
    $sessionId,
    'I need help with my order',
    ['context' => 'order_inquiry']
);
```

### 3. Transfer to Customer Service

The system automatically detects when to transfer to CS based on:
- Keywords in user messages
- Chatbot responses indicating need for human assistance
- User explicitly requesting customer service

```php
$transfer = $chatService->transferToCustomerService(
    $sessionId,
    [
        'name' => 'Customer Name',
        'email' => 'customer@example.com',
        'user_id' => $userId // optional
    ],
    'Complex billing inquiry'
);
```

### 4. Send Messages to Customer Service

```php
$response = $chatService->sendMessageToCs(
    $sessionId,
    $ticketId,
    'Customer message to CS agent'
);
```

## Customer Service Management

### Find Available Agents

```php
$csRepository = new CustomerSupportRepository();
$availableAgents = $csRepository->findAvailableCustomerService();
```

### Create and Assign Tickets

```php
$ticket = $csRepository->createTicket([
    'subject' => 'Order Issue',
    'description' => 'Customer needs help with order #12345',
    'customer_name' => 'John Doe',
    'customer_email' => 'john@example.com',
    'priority' => 'medium',
    'category' => 'order_support'
]);

$csRepository->assignTicket($ticket->id, $agentId);
```

### Get Statistics

```php
// Agent statistics
$stats = $csRepository->getAgentStatistics($agentId);

// Ticket statistics
$ticketStats = $csRepository->getTicketStatistics();
```

## Configuration

### Customer Service Detection Keywords

The system detects customer service requests based on keywords. You can customize these in the `shouldTransferToCustomerService` method:

```php
private function shouldTransferToCustomerService(array $response, string $message): bool
{
    $csKeywords = [
        'customer service', 'human agent', 'speak to someone',
        'representative', 'help desk', 'support agent',
        'billing issue', 'refund', 'complaint'
    ];
    
    // Check message content
    foreach ($csKeywords as $keyword) {
        if (stripos($message, $keyword) !== false) {
            return true;
        }
    }
    
    // Check bot response for transfer indicators
    return isset($response['transfer_to_cs']) && $response['transfer_to_cs'] === true;
}
```

## Testing

### Test Customer Service Representatives

After running the seeder, you can test with these accounts:

1. **Alice Johnson** - Technical Support
   - Email: alice.johnson@company.com
   - Skills: Technical Issues, Product Support

2. **Bob Smith** - Billing Department
   - Email: bob.smith@company.com
   - Skills: Billing, Payments, Refunds

3. **Carol Davis** - General Inquiry
   - Email: carol.davis@company.com
   - Skills: General Support, Order Status

### API Testing

You can test the integration using the following endpoints (if implemented):

```bash
# Initialize chat session
POST /api/chat/initialize
{
    "user_type": "guest",
    "guest_data": {
        "name": "Test User",
        "email": "test@example.com"
    }
}

# Send message
POST /api/chat/message
{
    "session_id": "session-uuid",
    "message": "I need customer service help"
}

# Get available CS agents
GET /api/chat/cs/available
```

## Best Practices

1. **Error Handling**: Always wrap chat operations in try-catch blocks
2. **Logging**: Use the built-in logging for debugging and monitoring
3. **Session Management**: Properly manage chat session lifecycle
4. **Security**: Validate all user inputs and sanitize data
5. **Performance**: Monitor ticket assignment and agent workload

## Troubleshooting

### Common Issues

1. **No Available Agents**: Check agent availability status and working hours
2. **Failed Ticket Assignment**: Verify agent capacity and skills matching
3. **Chat Session Errors**: Ensure Flowise repository methods are properly implemented
4. **Database Errors**: Check foreign key constraints and data types

### Logs

Check Laravel logs for detailed error information:
```bash
tail -f storage/logs/laravel.log
```

## Extending the System

### Adding New CS Departments

1. Update the seeder to include new departments
2. Add department-specific skills and routing logic
3. Update the ticket assignment algorithm

### Custom Transfer Logic

1. Modify `shouldTransferToCustomerService()` method
2. Add new detection patterns or AI-based classification
3. Implement priority-based routing

### Integration with External Systems

1. Add webhook support for external CS platforms
2. Implement real-time notifications
3. Add CRM integration capabilities