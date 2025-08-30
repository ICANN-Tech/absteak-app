<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use MongoDB\Client;
use MongoDB\Collection;
use MongoDB\Database;
use RuntimeException;
use Carbon\Carbon;

/**
 * MongoDB Service Class
 * 
 * Note: MongoDB\BSON\ObjectId type is used but may not be recognized by some IDEs.
 * This is a valid MongoDB PHP driver type. UTCDateTime has been replaced with Carbon for better Laravel integration.
 * 
 * @phpstan-type MongoObjectId \MongoDB\BSON\ObjectId
 */

/**
 * MongoDB Service
 * 
 * A clean, reusable service for MongoDB operations providing comprehensive database functionality.
 * Implements proper error handling, connection management, and follows SOLID principles.
 * 
 * Usage Examples:
 * 
 * // Basic usage
 * $mongo = new Mongo();
 * $result = $mongo->insert('users', ['name' => 'John', 'email' => 'john@example.com']);
 * $user = $mongo->findById('users', $result->getInsertedId());
 * 
 * // Query operations
 * $users = $mongo->find('users', ['status' => 'active']);
 * $count = $mongo->count('users', ['created_at' => ['$gte' => new \DateTime('-30 days')]]);
 * 
 * // Update operations
 * $mongo->updateById('users', $userId, ['last_login' => new \DateTime()]);
 * $mongo->updateMany('users', ['status' => 'inactive'], ['status' => 'archived']);
 * 
 * // Delete operations
 * $mongo->deleteById('users', $userId);
 * $mongo->deleteMany('users', ['status' => 'archived']);
 * 
 * @package App\Services
 * @author ABSteak Development Team
 * @version 1.0.0
 */
class Mongo
{
    /**
     * MongoDB client instance
     */
    private Client $client;

    /**
     * MongoDB database instance
     */
    private Database $database;

    /**
     * Default database name
     */
    private string $databaseName;

    /**
     * Connection timeout in milliseconds
     */
    private const CONNECTION_TIMEOUT = 5000;

    /**
     * Socket timeout in milliseconds
     */
    private const SOCKET_TIMEOUT = 30000;

    /**
     * Maximum number of connections in the pool
     */
    private const MAX_POOL_SIZE = 100;

    /**
     * Create a new MongoDB service instance
     *
     * @param string|null $connectionString Custom MongoDB connection string
     * @param string|null $databaseName Custom database name
     * @throws RuntimeException If MongoDB connection fails
     */
    public function __construct(?string $connectionString = null, ?string $databaseName = null)
    {
        $this->databaseName = $databaseName ?? env('MONGO_DATABASE', 'absteak_db');
        $this->initializeConnection($connectionString);
    }

    /**
     * Insert a single document into a collection
     *
     * @param string $collection Collection name
     * @param array $document Document to insert
     * @return \MongoDB\InsertOneResult Insert result
     * @throws InvalidArgumentException If collection name or document is invalid
     * @throws RuntimeException If insert operation fails
     */
    public function insert(string $collection, array $document)
    {
        $this->validateCollectionName($collection);
        $this->validateDocument($document);

        try {
            $collection = $this->getCollection($collection);
            $now = Carbon::now()->toDateTime();
            $document['created_at'] = $now;
            $document['updated_at'] = $now;
            
            $result = $collection->insertOne($document);
            
            Log::debug('MongoDB: Successfully inserted document', [
                'collection' => $collection->getCollectionName(),
                'inserted_id' => (string) $result->getInsertedId()
            ]);
            
            return $result;
        } catch (Exception $e) {
            Log::error('MongoDB: Failed to insert document', [
                'collection' => $collection,
                'error' => $e->getMessage()
            ]);
            
            throw new RuntimeException(
                "Failed to insert document into {$collection}: " . $e->getMessage(),
                0,
                $e
            );
        }
    }

    /**
     * Insert multiple documents into a collection
     *
     * @param string $collection Collection name
     * @param array $documents Array of documents to insert
     * @return \MongoDB\InsertManyResult Insert result
     * @throws InvalidArgumentException If collection name or documents are invalid
     * @throws RuntimeException If insert operation fails
     */
    public function insertMany(string $collection, array $documents)
    {
        $this->validateCollectionName($collection);
        
        if (empty($documents)) {
            throw new InvalidArgumentException('Documents array cannot be empty');
        }

        try {
            $collection = $this->getCollection($collection);
            $timestamp = Carbon::now()->toDateTime();
            
            // Add timestamps to all documents
            foreach ($documents as &$document) {
                $this->validateDocument($document);
                $document['created_at'] = $timestamp;
                $document['updated_at'] = $timestamp;
            }
            
            $result = $collection->insertMany($documents);
            
            Log::debug('MongoDB: Successfully inserted multiple documents', [
                'collection' => $collection->getCollectionName(),
                'count' => count($result->getInsertedIds())
            ]);
            
            return $result;
        } catch (Exception $e) {
            Log::error('MongoDB: Failed to insert multiple documents', [
                'collection' => $collection,
                'count' => count($documents),
                'error' => $e->getMessage()
            ]);
            
            throw new RuntimeException(
                "Failed to insert documents into {$collection}: " . $e->getMessage(),
                0,
                $e
            );
        }
    }

    /**
     * Find documents in a collection
     *
     * @param string $collection Collection name
     * @param array $filter Query filter
     * @param array $options Query options (limit, sort, projection, etc.)
     * @return array Array of documents
     * @throws InvalidArgumentException If collection name is invalid
     * @throws RuntimeException If find operation fails
     */
    public function find(string $collection, array $filter = [], array $options = []): array
    {
        $this->validateCollectionName($collection);

        try {
            $collection = $this->getCollection($collection);
            $cursor = $collection->find($filter, $options);
            $documents = iterator_to_array($cursor);
            
            Log::debug('MongoDB: Successfully found documents', [
                'collection' => $collection->getCollectionName(),
                'filter' => $filter,
                'count' => count($documents)
            ]);
            
            return $documents;
        } catch (Exception $e) {
            Log::error('MongoDB: Failed to find documents', [
                'collection' => $collection,
                'filter' => $filter,
                'error' => $e->getMessage()
            ]);
            
            throw new RuntimeException(
                "Failed to find documents in {$collection}: " . $e->getMessage(),
                0,
                $e
            );
        }
    }

    /**
     * Find a single document by ID
     *
     * @param string $collection Collection name
     * @param string|mixed $id Document ID
     * @return array|null Document or null if not found
     * @throws InvalidArgumentException If collection name or ID is invalid
     * @throws RuntimeException If find operation fails
     */
    public function findById(string $collection, $id): ?array
    {
        $this->validateCollectionName($collection);
        $objectId = $this->convertToObjectId($id);

        try {
            $collection = $this->getCollection($collection);
            $document = $collection->findOne(['_id' => $objectId]);
            
            if ($document) {
                Log::debug('MongoDB: Successfully found document by ID', [
                    'collection' => $collection->getCollectionName(),
                    'id' => (string) $objectId
                ]);
                return iterator_to_array($document);
            }
            
            return null;
        } catch (Exception $e) {
            Log::error('MongoDB: Failed to find document by ID', [
                'collection' => $collection,
                'id' => (string) $objectId,
                'error' => $e->getMessage()
            ]);
            
            throw new RuntimeException(
                "Failed to find document by ID in {$collection}: " . $e->getMessage(),
                0,
                $e
            );
        }
    }

    /**
     * Find a single document matching the filter
     *
     * @param string $collection Collection name
     * @param array $filter Query filter
     * @param array $options Query options
     * @return array|null Document or null if not found
     * @throws InvalidArgumentException If collection name is invalid
     * @throws RuntimeException If find operation fails
     */
    public function findOne(string $collection, array $filter = [], array $options = []): ?array
    {
        $this->validateCollectionName($collection);

        try {
            $collection = $this->getCollection($collection);
            $document = $collection->findOne($filter, $options);
            
            if ($document) {
                Log::debug('MongoDB: Successfully found single document', [
                    'collection' => $collection->getCollectionName(),
                    'filter' => $filter
                ]);
                return $document;
            }
            
            return null;
        } catch (Exception $e) {
            Log::error('MongoDB: Failed to find single document', [
                'collection' => $collection,
                'filter' => $filter,
                'error' => $e->getMessage()
            ]);
            
            throw new RuntimeException(
                "Failed to find document in {$collection}: " . $e->getMessage(),
                0,
                $e
            );
        }
    }

    /**
     * Update a single document by ID
     *
     * @param string $collection Collection name
     * @param string|mixed $id Document ID
     * @param array $update Update operations
     * @param array $options Update options
     * @return \MongoDB\UpdateResult Update result
     * @throws InvalidArgumentException If collection name, ID, or update is invalid
     * @throws RuntimeException If update operation fails
     */
    public function updateById(string $collection, $id, array $update, array $options = [])
    {
        $this->validateCollectionName($collection);
        $objectId = $this->convertToObjectId($id);
        $this->validateUpdate($update);

        try {
            $collection = $this->getCollection($collection);
            
            // Add updated_at timestamp
            if (!isset($update['$set'])) {
                $update['$set'] = [];
            }
            $timestamp = Carbon::now()->toDateTime();
            $update['$set']['updated_at'] = $timestamp;
            
            $result = $collection->updateOne(['_id' => $objectId], $update, $options);
            
            Log::debug('MongoDB: Successfully updated document by ID', [
                'collection' => $collection->getCollectionName(),
                'id' => (string) $objectId,
                'modified_count' => $result->getModifiedCount()
            ]);
            
            return $result;
        } catch (Exception $e) {
            Log::error('MongoDB: Failed to update document by ID', [
                'collection' => $collection,
                'id' => (string) $objectId,
                'error' => $e->getMessage()
            ]);
            
            throw new RuntimeException(
                "Failed to update document by ID in {$collection}: " . $e->getMessage(),
                0,
                $e
            );
        }
    }

    /**
     * Update multiple documents matching the filter
     *
     * @param string $collection Collection name
     * @param array $filter Query filter
     * @param array $update Update operations
     * @param array $options Update options
     * @return \MongoDB\UpdateResult Update result
     * @throws InvalidArgumentException If collection name, filter, or update is invalid
     * @throws RuntimeException If update operation fails
     */
    public function updateMany(string $collection, array $filter, array $update, array $options = [])
    {
        $this->validateCollectionName($collection);
        $this->validateUpdate($update);

        try {
            $collection = $this->getCollection($collection);
            
            // Add updated_at timestamp
            if (!isset($update['$set'])) {
                $update['$set'] = [];
            }
            $update['$set']['updated_at'] = Carbon::now()->toDateTime();
            
            $result = $collection->updateMany($filter, $update, $options);
            
            Log::debug('MongoDB: Successfully updated multiple documents', [
                'collection' => $collection->getCollectionName(),
                'filter' => $filter,
                'modified_count' => $result->getModifiedCount()
            ]);
            
            return $result;
        } catch (Exception $e) {
            Log::error('MongoDB: Failed to update multiple documents', [
                'collection' => $collection,
                'filter' => $filter,
                'error' => $e->getMessage()
            ]);
            
            throw new RuntimeException(
                "Failed to update documents in {$collection}: " . $e->getMessage(),
                0,
                $e
            );
        }
    }

    /**
     * Delete a single document by ID
     *
     * @param string $collection Collection name
     * @param string|mixed $id Document ID
     * @return \MongoDB\DeleteResult Delete result
     * @throws InvalidArgumentException If collection name or ID is invalid
     * @throws RuntimeException If delete operation fails
     */
    public function deleteById(string $collection, $id)
    {
        $this->validateCollectionName($collection);
        $objectId = $this->convertToObjectId($id);

        try {
            $collection = $this->getCollection($collection);
            $result = $collection->deleteOne(['_id' => $objectId]);
            
            Log::debug('MongoDB: Successfully deleted document by ID', [
                'collection' => $collection->getCollectionName(),
                'id' => (string) $objectId,
                'deleted_count' => $result->getDeletedCount()
            ]);
            
            return $result;
        } catch (Exception $e) {
            Log::error('MongoDB: Failed to delete document by ID', [
                'collection' => $collection,
                'id' => (string) $objectId,
                'error' => $e->getMessage()
            ]);
            
            throw new RuntimeException(
                "Failed to delete document by ID in {$collection}: " . $e->getMessage(),
                0,
                $e
            );
        }
    }

    /**
     * Delete multiple documents matching the filter
     *
     * @param string $collection Collection name
     * @param array $filter Query filter
     * @return \MongoDB\DeleteResult Delete result
     * @throws InvalidArgumentException If collection name is invalid
     * @throws RuntimeException If delete operation fails
     */
    public function deleteMany(string $collection, array $filter)
    {
        $this->validateCollectionName($collection);

        try {
            $collection = $this->getCollection($collection);
            $result = $collection->deleteMany($filter);
            
            Log::debug('MongoDB: Successfully deleted multiple documents', [
                'collection' => $collection->getCollectionName(),
                'filter' => $filter,
                'deleted_count' => $result->getDeletedCount()
            ]);
            
            return $result;
        } catch (Exception $e) {
            Log::error('MongoDB: Failed to delete multiple documents', [
                'collection' => $collection,
                'filter' => $filter,
                'error' => $e->getMessage()
            ]);
            
            throw new RuntimeException(
                "Failed to delete documents in {$collection}: " . $e->getMessage(),
                0,
                $e
            );
        }
    }

    /**
     * Count documents in a collection
     *
     * @param string $collection Collection name
     * @param array $filter Query filter
     * @param array $options Count options
     * @return int Document count
     * @throws InvalidArgumentException If collection name is invalid
     * @throws RuntimeException If count operation fails
     */
    public function count(string $collection, array $filter = [], array $options = []): int
    {
        $this->validateCollectionName($collection);

        try {
            $collection = $this->getCollection($collection);
            $count = $collection->countDocuments($filter, $options);
            
            Log::debug('MongoDB: Successfully counted documents', [
                'collection' => $collection->getCollectionName(),
                'filter' => $filter,
                'count' => $count
            ]);
            
            return $count;
        } catch (Exception $e) {
            Log::error('MongoDB: Failed to count documents', [
                'collection' => $collection,
                'filter' => $filter,
                'error' => $e->getMessage()
            ]);
            
            throw new RuntimeException(
                "Failed to count documents in {$collection}: " . $e->getMessage(),
                0,
                $e
            );
        }
    }

    /**
     * Create an index on a collection
     *
     * @param string $collection Collection name
     * @param array $keys Index specification
     * @param array $options Index options
     * @return string Index name
     * @throws InvalidArgumentException If collection name or keys are invalid
     * @throws RuntimeException If index creation fails
     */
    public function createIndex(string $collection, array $keys, array $options = []): string
    {
        $this->validateCollectionName($collection);
        
        if (empty($keys)) {
            throw new InvalidArgumentException('Index keys cannot be empty');
        }

        try {
            $collection = $this->getCollection($collection);
            $indexName = $collection->createIndex($keys, $options);
            
            Log::info('MongoDB: Successfully created index', [
                'collection' => $collection->getCollectionName(),
                'keys' => $keys,
                'index_name' => $indexName
            ]);
            
            return $indexName;
        } catch (Exception $e) {
            Log::error('MongoDB: Failed to create index', [
                'collection' => $collection,
                'keys' => $keys,
                'error' => $e->getMessage()
            ]);
            
            throw new RuntimeException(
                "Failed to create index on {$collection}: " . $e->getMessage(),
                0,
                $e
            );
        }
    }

    /**
     * Test MongoDB connection
     *
     * @return bool True if connection is working, false otherwise
     */
    public function ping(): bool
    {
        try {
            $this->database->command(['ping' => 1]);
            return true;
        } catch (Exception $e) {
            Log::error('MongoDB: Connection test failed', [
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Get database statistics
     *
     * @return array Database statistics
     * @throws RuntimeException If stats retrieval fails
     */
    public function getStats(): array
    {
        try {
            $result = $this->database->command(['dbStats' => 1]);
            $stats = $result->toArray()[0];
            return $stats->toArray();
        } catch (Exception $e) {
            Log::error('MongoDB: Failed to get database stats', [
                'error' => $e->getMessage()
            ]);
            
            throw new RuntimeException(
                "Failed to get database statistics: " . $e->getMessage(),
                0,
                $e
            );
        }
    }

    /**
     * Initialize MongoDB connection
     *
     * @param string|null $connectionString Custom connection string
     * @throws RuntimeException If connection fails
     */
    private function initializeConnection(?string $connectionString): void
    {
        try {
            $uri = $connectionString ?? $this->buildConnectionString();
            
            $this->client = new Client($uri, [
                'connectTimeoutMS' => self::CONNECTION_TIMEOUT,
                'socketTimeoutMS' => self::SOCKET_TIMEOUT,
                'maxPoolSize' => self::MAX_POOL_SIZE,
            ]);
            
            $this->database = $this->client->selectDatabase($this->databaseName);
            
            // Test the connection
            if (!$this->ping()) {
                throw new RuntimeException('MongoDB connection test failed');
            }
            
            Log::info('MongoDB: Connection established successfully', [
                'database' => $this->databaseName
            ]);
        } catch (Exception $e) {
            Log::error('MongoDB: Failed to establish connection', [
                'database' => $this->databaseName,
                'error' => $e->getMessage()
            ]);
            
            throw new RuntimeException(
                "Failed to connect to MongoDB: {$e->getMessage()}",
                0,
                $e
            );
        }
    }

    /**
     * Build MongoDB connection string from environment variables
     *
     * @return string Connection string
     */
    private function buildConnectionString(): string
    {
        $host = env('MONGO_HOST', 'mongodb');
        $port = env('MONGO_PORT', 27017);
        $username = env('MONGO_USERNAME', 'absteak_app');
        $password = env('MONGO_PASSWORD', 'absteak_app_password_2024');
        
        return "mongodb://{$username}:{$password}@{$host}:{$port}/{$this->databaseName}?authSource={$this->databaseName}";
    }

    /**
     * Get a collection instance
     *
     * @param string $collectionName Collection name
     * @return Collection Collection instance
     */
    private function getCollection(string $collectionName): Collection
    {
        return $this->database->selectCollection($collectionName);
    }

    /**
     * Validate collection name
     *
     * @param string $collection Collection name
     * @throws InvalidArgumentException If collection name is invalid
     */
    private function validateCollectionName(string $collection): void
    {
        if (empty($collection)) {
            throw new InvalidArgumentException('Collection name cannot be empty');
        }
        
        if (strlen($collection) > 120) {
            throw new InvalidArgumentException('Collection name too long (max: 120 characters)');
        }
        
        if (preg_match('/[\\/$\x00]/', $collection)) {
            throw new InvalidArgumentException('Collection name contains invalid characters');
        }
    }

    /**
     * Validate document before insertion
     *
     * @param array $document Document to validate
     * @throws InvalidArgumentException If document is invalid
     */
    private function validateDocument(array $document): void
    {
        if (empty($document)) {
            throw new InvalidArgumentException('Document cannot be empty');
        }
        
        // Check for reserved field names
        if (isset($document['_id'])) {
            $isValidId = is_string($document['_id']) || is_object($document['_id']);
            if (!$isValidId) {
                throw new InvalidArgumentException('Invalid _id field type');
            }
        }
    }

    /**
     * Validate update operations
     *
     * @param array $update Update operations
     * @throws InvalidArgumentException If update is invalid
     */
    private function validateUpdate(array $update): void
    {
        if (empty($update)) {
            throw new InvalidArgumentException('Update operations cannot be empty');
        }
        
        // Ensure update uses proper operators
        $validOperators = ['$set', '$unset', '$inc', '$push', '$pull', '$addToSet', '$rename'];
        $hasValidOperator = false;
        
        foreach (array_keys($update) as $key) {
            if (in_array($key, $validOperators)) {
                $hasValidOperator = true;
                break;
            }
        }
        
        if (!$hasValidOperator) {
            throw new InvalidArgumentException('Update must use valid MongoDB operators');
        }
    }

    /**
     * Convert string or ObjectId to appropriate format
     * 
     * @param string|mixed $id The ID to convert
     * @return mixed Converted ID
     * @throws InvalidArgumentException If ID is invalid
     */
    private function convertToObjectId($id)
    {
        // If already an object (likely ObjectId), return as-is
        if (is_object($id)) {
            return $id;
        }
        
        if (!is_string($id)) {
            throw new InvalidArgumentException('ID must be a string or object');
        }
        
        // Try to create ObjectId if class exists
        if (class_exists('\MongoDB\BSON\ObjectId')) {
            try {
                $objectIdClass = '\MongoDB\BSON\ObjectId';
                if (method_exists($objectIdClass, 'isValid') && !$objectIdClass::isValid($id)) {
                    throw new InvalidArgumentException('Invalid ObjectId format');
                }
                return new $objectIdClass($id);
            } catch (Exception $e) {
                // Fallback to string if ObjectId creation fails
                return $id;
            }
        }
        
        // Fallback: return string ID if ObjectId class not available
        return $id;
    }
}