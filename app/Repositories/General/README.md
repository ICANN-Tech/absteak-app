# Configuration Repository with Cache

This repository implements caching functionality using the `prettus/l5-repository` package.

## Features

- **Cache Support**: Implements `CacheableInterface` and uses `CacheableRepository` trait
- **Automatic Cache Management**: Cache is automatically cleared on create, update, and delete operations
- **Custom Methods**: Includes specialized methods for configuration retrieval

## Configuration

Cache is configured in `config/repository.php`:

```php
'cache' => [
    'enabled' => true,
    'minutes' => 30,
    'repository' => 'cache',
    'clean' => [
        'enabled' => true,
        'on' => [
            'create' => true,
            'update' => true,
            'delete' => true,
        ]
    ]
]
```

## Usage Examples

### Basic Repository Methods (with cache)

```php
// Get all configurations (cached)
$configurations = app('App\\Repositories\\General\\ConfigurationRepository')->all();

// Find by ID (cached)
$config = app('App\\Repositories\\General\\ConfigurationRepository')->find(1);

// Create new configuration (clears cache)
$newConfig = app('App\\Repositories\\General\\ConfigurationRepository')->create([
    'key' => 'app_name',
    'value' => 'My Application'
]);
```

### Custom Methods

```php
// Get configuration by key (cached)
$config = app('App\\Repositories\\General\\ConfigurationRepository')->getByKey('app_name');

// Get all configurations (cached)
$allConfigs = app('App\\Repositories\\General\\ConfigurationRepository')->getAllConfigurations();
```

### Skip Cache

You can skip cache by adding `skipCache=true` parameter:

```php
// Skip cache for this request
$configs = app('App\\Repositories\\General\\ConfigurationRepository')
    ->skipCache()
    ->all();
```

## Cache Behavior

- **Read Operations**: `all()`, `find()`, `findByField()`, `findWhere()`, `getByCriteria()` are cached
- **Write Operations**: `create()`, `update()`, `delete()` automatically clear related cache
- **Cache Duration**: 30 minutes (configurable)
- **Cache Key**: Automatically generated based on method name and parameters

## Benefits

1. **Performance**: Reduces database queries for frequently accessed configurations
2. **Automatic Management**: Cache is automatically invalidated when data changes
3. **Flexible**: Can be enabled/disabled via configuration
4. **Transparent**: Works seamlessly with existing repository methods