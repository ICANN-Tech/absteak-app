# MongoDB Service Documentation

## Overview

The MongoDB service provides a comprehensive, production-ready interface for interacting with MongoDB databases in the ABSteak application. It includes CRUD operations, error handling, connection management, and seamless integration with Laravel's service container.

## Features

- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Error Handling**: Robust exception handling with detailed logging
- **Connection Management**: Automatic connection handling with health checks
- **Validation**: Built-in data validation and sanitization
- **Performance**: Optimized queries with proper indexing
- **Security**: Secure connection handling and input validation
- **Laravel Integration**: Full integration with Laravel's dependency injection

## Installation

### 1. Composer Dependencies

The MongoDB PHP driver is already included in `composer.json`:

```bash
composer install
```

### 2. Environment Configuration

Add MongoDB configuration to your `.env` file:

```env
# MongoDB Configuration
MONGO_HOST=mongodb
MONGO_PORT=27017
MONGO_DATABASE=absteak_db
MONGO_USERNAME=absteak_app
MONGO_PASSWORD=your_secure_password
```

### 3. Docker Setup

Start the MongoDB service using Docker Compose:

```bash
docker-compose up -d mongodb
```

## Usage

### Basic Usage

#### Dependency Injection

```php
use App\Services\Mongo;

class ReservationController extends Controller
{
    public function __construct(
        private Mongo $mongo
    ) {}
    
    public function store(Request $request)
    {
        $reservation = $this->mongo->insert('reservations', [
            'customer_name' => $request->name,
            'email' => $request->email,
            'date' => $request->date,
            'time' => $request->time,
            'party_size' => $request->party_size,
            'created_at' => new \DateTime()
        ]);
        
        return response()->json($reservation);
    }
}
```

#### Service Container Resolution

```php
// Using app() helper
$mongo = app(Mongo::class);

// Using resolve() helper
$mongo = resolve('mongo');

// Using facade pattern
$mongo = app('mongo');
```

### CRUD Operations

#### Create (Insert)

```php
// Insert single document
$result = $mongo->insert('users', [
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'role' => 'customer'
]);

// Insert multiple documents
$result = $mongo->insertMany('users', [
    ['name' => 'Jane Doe', 'email' => 'jane@example.com'],
    ['name' => 'Bob Smith', 'email' => 'bob@example.com']
]);
```

#### Read (Find)

```php
// Find single document
$user = $mongo->findOne('users', ['email' => 'john@example.com']);

// Find multiple documents
$users = $mongo->find('users', ['role' => 'customer']);

// Find with options
$users = $mongo->find('users', [], [
    'limit' => 10,
    'skip' => 0,
    'sort' => ['created_at' => -1]
]);

// Find by ID
$user = $mongo->findById('users', '507f1f77bcf86cd799439011');
```

#### Update

```php
// Update single document
$result = $mongo->updateOne('users', 
    ['email' => 'john@example.com'],
    ['$set' => ['last_login' => new \DateTime()]]
);

// Update multiple documents
$result = $mongo->updateMany('users',
    ['role' => 'customer'],
    ['$set' => ['status' => 'active']]
);

// Upsert (update or insert)
$result = $mongo->upsert('users',
    ['email' => 'new@example.com'],
    ['name' => 'New User', 'email' => 'new@example.com']
);
```

#### Delete

```php
// Delete single document
$result = $mongo->deleteOne('users', ['email' => 'john@example.com']);

// Delete multiple documents
$result = $mongo->deleteMany('users', ['status' => 'inactive']);

// Delete by ID
$result = $mongo->deleteById('users', '507f1f77bcf86cd799439011');
```

### Advanced Operations

#### Counting Documents

```php
// Count all documents
$total = $mongo->count('users');

// Count with filter
$activeUsers = $mongo->count('users', ['status' => 'active']);
```

#### Indexing

```php
// Create single field index
$mongo->createIndex('users', ['email' => 1]);

// Create compound index
$mongo->createIndex('reservations', [
    'date' => 1,
    'time' => 1
]);

// Create text index for search
$mongo->createIndex('users', [
    'name' => 'text',
    'email' => 'text'
]);
```

#### Aggregation

```php
// Simple aggregation
$pipeline = [
    ['$match' => ['status' => 'active']],
    ['$group' => [
        '_id' => '$role',
        'count' => ['$sum' => 1]
    ]]
];

$result = $mongo->aggregate('users', $pipeline);
```

## Error Handling

The service includes comprehensive error handling:

```php
try {
    $result = $mongo->insert('users', $userData);
} catch (\App\Exceptions\MongoConnectionException $e) {
    // Handle connection errors
    Log::error('MongoDB connection failed: ' . $e->getMessage());
} catch (\App\Exceptions\MongoValidationException $e) {
    // Handle validation errors
    return response()->json(['error' => $e->getMessage()], 422);
} catch (\App\Exceptions\MongoOperationException $e) {
    // Handle operation errors
    Log::error('MongoDB operation failed: ' . $e->getMessage());
}
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_HOST` | `mongodb` | MongoDB host address |
| `MONGO_PORT` | `27017` | MongoDB port |
| `MONGO_DATABASE` | `absteak_db` | Database name |
| `MONGO_USERNAME` | `absteak_app` | Database username |
| `MONGO_PASSWORD` | - | Database password |

### Docker Configuration

The MongoDB service is configured in `docker-compose.yml` with:

- **Replica Set**: Configured for high availability
- **Authentication**: Secure user authentication
- **Health Checks**: Automatic health monitoring
- **Persistence**: Data persistence with Docker volumes
- **Resource Limits**: Memory and CPU limits for production

## Collections Schema

### Users Collection

```javascript
{
  "_id": ObjectId,
  "name": String,
  "email": String, // Unique index
  "role": String, // Enum: admin, staff, customer
  "status": String, // Enum: active, inactive
  "created_at": Date,
  "updated_at": Date
}
```

### Reservations Collection

```javascript
{
  "_id": ObjectId,
  "customer_name": String,
  "email": String,
  "phone": String,
  "date": Date, // Compound index with time
  "time": String, // Compound index with date
  "party_size": Number,
  "status": String, // Enum: pending, confirmed, cancelled
  "special_requests": String,
  "created_at": Date,
  "updated_at": Date
}
```

### Chat Sessions Collection

```javascript
{
  "_id": ObjectId,
  "session_id": String, // Unique index
  "user_id": String,
  "messages": Array,
  "status": String, // Enum: active, ended
  "created_at": Date,
  "updated_at": Date
}
```

## Performance Optimization

### Indexing Strategy

```php
// Create performance indexes
$mongo->createIndex('users', ['email' => 1]); // Unique queries
$mongo->createIndex('reservations', ['date' => 1, 'time' => 1]); // Date/time queries
$mongo->createIndex('chat_sessions', ['session_id' => 1]); // Session lookups
$mongo->createIndex('analytics', ['timestamp' => -1]); // Time-series data
```

### Query Optimization

- Use specific field projections to reduce data transfer
- Implement proper pagination with `limit` and `skip`
- Use compound indexes for multi-field queries
- Avoid regex queries on large collections

## Security Best Practices

1. **Authentication**: Always use authenticated connections
2. **Authorization**: Implement role-based access control
3. **Input Validation**: Validate all input data before operations
4. **Connection Security**: Use secure connection strings
5. **Error Handling**: Don't expose sensitive information in errors

## Testing

### Unit Testing

```php
use Tests\TestCase;
use App\Services\Mongo;

class MongoServiceTest extends TestCase
{
    public function test_can_insert_document()
    {
        $mongo = app(Mongo::class);
        
        $result = $mongo->insert('test_collection', [
            'name' => 'Test User',
            'email' => 'test@example.com'
        ]);
        
        $this->assertNotNull($result);
        $this->assertArrayHasKey('_id', $result);
    }
}
```

### Integration Testing

```bash
# Test MongoDB connection
docker-compose exec app php artisan tinker
>>> app('mongo')->ping()
=> true

# Test basic operations
>>> $mongo = app('mongo')
>>> $result = $mongo->insert('test', ['name' => 'Test'])
>>> $mongo->findOne('test', ['name' => 'Test'])
```

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check MongoDB container is running: `docker-compose ps mongodb`
   - Verify environment variables in `.env`
   - Check network connectivity

2. **Authentication Failed**
   - Verify username/password in `.env`
   - Check user permissions in MongoDB

3. **Database Not Found**
   - Ensure database name matches `MONGO_DATABASE`
   - Check initialization script execution

### Debugging

```php
// Enable debug logging
Log::debug('MongoDB operation', [
    'collection' => $collection,
    'operation' => 'insert',
    'data' => $data
]);

// Check connection status
if (!$mongo->ping()) {
    Log::error('MongoDB connection failed');
}
```

## Migration from Other Databases

If migrating from PostgreSQL or MySQL:

1. **Schema Design**: Convert relational schemas to document structure
2. **Data Migration**: Use Laravel commands to migrate existing data
3. **Query Conversion**: Convert SQL queries to MongoDB operations
4. **Index Migration**: Recreate indexes for optimal performance

## Support

For issues or questions:

1. Check the logs: `docker-compose logs mongodb`
2. Review Laravel logs: `storage/logs/laravel.log`
3. Test connection: `php artisan tinker` → `app('mongo')->ping()`
4. Verify configuration: Check `.env` and `docker-compose.yml`

## Version History

- **v1.0.0**: Initial MongoDB service implementation
- Features: CRUD operations, error handling, Laravel integration
- Collections: Users, Reservations, Chat Sessions, Analytics