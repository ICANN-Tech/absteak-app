<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis as RedisManager;
use InvalidArgumentException;
use RuntimeException;

/**
 * Redis Service
 * 
 * A clean, reusable service for Redis operations providing simple set/get functionality.
 * Implements proper error handling, connection management, and follows SOLID principles.
 * 
 * Usage Examples:
 * 
 * // Basic usage
 * $redis = new Redis();
 * $redis->set('user:123', ['name' => 'John', 'email' => 'john@example.com']);
 * $user = $redis->get('user:123');
 * 
 * // With TTL (time to live)
 * $redis->set('session:abc123', $sessionData, 3600); // Expires in 1 hour
 * 
 * // Check if key exists
 * if ($redis->exists('user:123')) {
 *     $user = $redis->get('user:123');
 * }
 * 
 * // Delete a key
 * $redis->delete('user:123');
 * 
 * @package App\Services
 * @author ABSteak Development Team
 * @version 1.0.0
 */
class Redis
{
    /**
     * Redis connection instance
     */
    private $connection;

    /**
     * Default TTL for keys (in seconds)
     */
    private const DEFAULT_TTL = 3600; // 1 hour

    /**
     * Maximum key length allowed
     */
    private const MAX_KEY_LENGTH = 512;

    /**
     * Maximum value size allowed (in bytes)
     */
    private const MAX_VALUE_SIZE = 1048576; // 1MB

    /**
     * Create a new Redis service instance
     *
     * @param string|null $connection Redis connection name (defaults to 'default')
     * @throws RuntimeException If Redis connection fails
     */
    public function __construct(?string $connection = null)
    {
        $this->initializeConnection($connection ?? 'default');
    }

    /**
     * Store a value in Redis with optional TTL
     *
     * @param string $key The key to store the value under
     * @param mixed $value The value to store (will be JSON encoded)
     * @param int|null $ttl Time to live in seconds (null for no expiration)
     * @return bool True on success, false on failure
     * @throws InvalidArgumentException If key or value is invalid
     */
    public function set(string $key, $value, ?int $ttl = null): bool
    {
        $this->validateKey($key);
        $this->validateValue($value);

        try {
            $serializedValue = $this->serializeValue($value);
            
            if ($ttl !== null) {
                $this->validateTtl($ttl);
                $result = $this->connection->setex($key, $ttl, $serializedValue);
            } else {
                $result = $this->connection->set($key, $serializedValue);
            }

            $success = $result === true || $result === 'OK';
            
            if ($success) {
                Log::debug('Redis: Successfully stored key', [
                    'key' => $key,
                    'ttl' => $ttl,
                    'value_type' => gettype($value)
                ]);
            }

            return $success;
        } catch (Exception $e) {
            Log::error('Redis: Failed to set key', [
                'key' => $key,
                'ttl' => $ttl,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Retrieve a value from Redis
     *
     * @param string $key The key to retrieve
     * @param mixed $default Default value to return if key doesn't exist
     * @return mixed The stored value or default if not found
     * @throws InvalidArgumentException If key is invalid
     */
    public function get(string $key, $default = null)
    {
        $this->validateKey($key);

        try {
            $value = $this->connection->get($key);
            
            if ($value === null || $value === false) {
                Log::debug('Redis: Key not found', ['key' => $key]);
                return $default;
            }

            $deserializedValue = $this->deserializeValue($value);
            
            Log::debug('Redis: Successfully retrieved key', [
                'key' => $key,
                'value_type' => gettype($deserializedValue)
            ]);

            return $deserializedValue;
        } catch (Exception $e) {
            Log::error('Redis: Failed to get key', [
                'key' => $key,
                'error' => $e->getMessage()
            ]);
            return $default;
        }
    }

    /**
     * Check if a key exists in Redis
     *
     * @param string $key The key to check
     * @return bool True if key exists, false otherwise
     * @throws InvalidArgumentException If key is invalid
     */
    public function exists(string $key): bool
    {
        $this->validateKey($key);

        try {
            $result = $this->connection->exists($key);
            return $result > 0;
        } catch (Exception $e) {
            Log::error('Redis: Failed to check key existence', [
                'key' => $key,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Delete a key from Redis
     *
     * @param string $key The key to delete
     * @return bool True if key was deleted, false otherwise
     * @throws InvalidArgumentException If key is invalid
     */
    public function delete(string $key): bool
    {
        $this->validateKey($key);

        try {
            $result = $this->connection->del($key);
            $success = $result > 0;
            
            if ($success) {
                Log::debug('Redis: Successfully deleted key', ['key' => $key]);
            }

            return $success;
        } catch (Exception $e) {
            Log::error('Redis: Failed to delete key', [
                'key' => $key,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Set TTL for an existing key
     *
     * @param string $key The key to set TTL for
     * @param int $ttl Time to live in seconds
     * @return bool True on success, false on failure
     * @throws InvalidArgumentException If key or TTL is invalid
     */
    public function expire(string $key, int $ttl): bool
    {
        $this->validateKey($key);
        $this->validateTtl($ttl);

        try {
            $result = $this->connection->expire($key, $ttl);
            return $result === 1;
        } catch (Exception $e) {
            Log::error('Redis: Failed to set TTL for key', [
                'key' => $key,
                'ttl' => $ttl,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Get TTL for a key
     *
     * @param string $key The key to get TTL for
     * @return int|null TTL in seconds, null if key doesn't exist or has no expiration
     * @throws InvalidArgumentException If key is invalid
     */
    public function getTtl(string $key): ?int
    {
        $this->validateKey($key);

        try {
            $ttl = $this->connection->ttl($key);
            
            // Redis returns -1 for keys that exist but have no expiration
            // Redis returns -2 for keys that don't exist
            if ($ttl === -1 || $ttl === -2) {
                return null;
            }

            return $ttl;
        } catch (Exception $e) {
            Log::error('Redis: Failed to get TTL for key', [
                'key' => $key,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Test Redis connection
     *
     * @return bool True if connection is working, false otherwise
     */
    public function ping(): bool
    {
        try {
            $result = $this->connection->ping();
            return $result === 'PONG' || $result === true;
        } catch (Exception $e) {
            Log::error('Redis: Connection test failed', [
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Initialize Redis connection
     *
     * @param string $connectionName The connection name to use
     * @throws RuntimeException If connection fails
     */
    private function initializeConnection(string $connectionName): void
    {
        try {
            $this->connection = RedisManager::connection($connectionName);
            
            // Test the connection
            if (!$this->ping()) {
                throw new RuntimeException('Redis connection test failed');
            }
            
            Log::info('Redis: Connection established successfully', [
                'connection' => $connectionName
            ]);
        } catch (Exception $e) {
            Log::error('Redis: Failed to establish connection', [
                'connection' => $connectionName,
                'error' => $e->getMessage()
            ]);
            
            throw new RuntimeException(
                "Failed to connect to Redis: {$e->getMessage()}",
                0,
                $e
            );
        }
    }

    /**
     * Validate Redis key
     *
     * @param string $key The key to validate
     * @throws InvalidArgumentException If key is invalid
     */
    private function validateKey(string $key): void
    {
        if (empty($key)) {
            throw new InvalidArgumentException('Redis key cannot be empty');
        }

        if (strlen($key) > self::MAX_KEY_LENGTH) {
            throw new InvalidArgumentException(
                "Redis key too long: {strlen($key)} bytes (max: " . self::MAX_KEY_LENGTH . ")"
            );
        }

        // Check for invalid characters that might cause issues
        if (strpos($key, "\0") !== false) {
            throw new InvalidArgumentException('Redis key cannot contain null bytes');
        }
    }

    /**
     * Validate value before storing
     *
     * @param mixed $value The value to validate
     * @throws InvalidArgumentException If value is invalid
     */
    private function validateValue($value): void
    {
        if (is_resource($value)) {
            throw new InvalidArgumentException('Cannot store resource values in Redis');
        }

        $serialized = $this->serializeValue($value);
        if (strlen($serialized) > self::MAX_VALUE_SIZE) {
            throw new InvalidArgumentException(
                "Value too large: " . strlen($serialized) . " bytes (max: " . self::MAX_VALUE_SIZE . ")"
            );
        }
    }

    /**
     * Validate TTL value
     *
     * @param int $ttl The TTL to validate
     * @throws InvalidArgumentException If TTL is invalid
     */
    private function validateTtl(int $ttl): void
    {
        if ($ttl <= 0) {
            throw new InvalidArgumentException('TTL must be a positive integer');
        }

        // Redis maximum TTL is approximately 68 years in seconds
        if ($ttl > 2147483647) {
            throw new InvalidArgumentException('TTL too large (max: 2147483647 seconds)');
        }
    }

    /**
     * Serialize value for storage
     *
     * @param mixed $value The value to serialize
     * @return string Serialized value
     */
    private function serializeValue($value): string
    {
        if (is_string($value)) {
            return $value;
        }

        return json_encode($value, JSON_THROW_ON_ERROR);
    }

    /**
     * Deserialize value from storage
     *
     * @param string $value The serialized value
     * @return mixed Deserialized value
     */
    private function deserializeValue(string $value)
    {
        // Try to decode as JSON first
        $decoded = json_decode($value, true);
        
        // If JSON decode failed and it's not a JSON error, return as string
        if ($decoded === null && json_last_error() !== JSON_ERROR_NONE) {
            return $value;
        }

        return $decoded;
    }
}