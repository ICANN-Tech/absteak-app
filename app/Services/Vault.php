<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use RuntimeException;

/**
 * Vault Service
 * 
 * A secure service for managing and retrieving secrets from vault configuration files.
 * Supports dynamic file path selection and provides robust error handling.
 * 
 * Usage Examples:
 * 
 * // Basic usage with default vault file
 * $vault = new Vault();
 * $secret = $vault->getSecret('database.password');
 * 
 * // Using custom vault file
 * $vault = new Vault('/path/to/custom/vault.json');
 * $apiKey = $vault->getSecret('api.stripe.secret_key');
 * 
 * // With fallback values
 * $secret = $vault->getSecret('optional.key', 'default_value');
 * 
 * // Checking if secret exists
 * if ($vault->hasSecret('some.key')) {
 *     $value = $vault->getSecret('some.key');
 * }
 * 
 * @package App\Services
 * @author ABSteak Development Team
 * @version 1.0.0
 */
class Vault
{
    /**
     * The path to the vault configuration file
     */
    private string $vaultPath;

    /**
     * Cached vault data to avoid repeated file reads
     */
    private ?array $vaultData = null;

    /**
     * Default vault file name
     */
    private const DEFAULT_VAULT_FILE = 'vault.json';

    /**
     * Maximum file size allowed for vault files (in bytes)
     */
    private const MAX_FILE_SIZE = 1048576; // 1MB

    /**
     * Create a new Vault service instance
     *
     * @param string|null $vaultPath Custom path to vault file. If null, uses default location.
     * @throws InvalidArgumentException If the provided path is invalid
     */
    public function __construct(?string $vaultPath = null)
    {
        $this->vaultPath = $this->resolvePath($vaultPath);
        $this->validatePath();
    }

    /**
     * Retrieve a secret value by its key
     *
     * @param string $key The secret key using dot notation (e.g., 'database.password')
     * @param mixed $default Default value to return if key is not found
     * @return mixed The secret value or default if not found
     * @throws RuntimeException If vault file cannot be read or parsed
     */
    public function getSecret(string $key, $default = null)
    {
        try {
            $data = $this->loadVaultData();
            return $this->getNestedValue($data, $key, $default);
        } catch (Exception $e) {
            Log::error('Vault: Failed to retrieve secret', [
                'key' => $key,
                'vault_path' => $this->vaultPath,
                'error' => $e->getMessage()
            ]);
            
            if ($default !== null) {
                return $default;
            }
            
            throw new RuntimeException(
                "Failed to retrieve secret '{$key}': " . $e->getMessage(),
                0,
                $e
            );
        }
    }

    /**
     * Check if a secret key exists in the vault
     *
     * @param string $key The secret key to check
     * @return bool True if the key exists, false otherwise
     */
    public function hasSecret(string $key): bool
    {
        try {
            $data = $this->loadVaultData();
            return $this->hasNestedKey($data, $key);
        } catch (Exception $e) {
            Log::warning('Vault: Failed to check secret existence', [
                'key' => $key,
                'vault_path' => $this->vaultPath,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Get all available secret keys (for debugging purposes only)
     * Note: This method should be used carefully and never in production logs
     *
     * @return array Array of available keys
     * @throws RuntimeException If vault cannot be loaded
     */
    public function getAvailableKeys(): array
    {
        $data = $this->loadVaultData();
        return $this->flattenKeys($data);
    }

    /**
     * Reload vault data from file (clears cache)
     *
     * @return self For method chaining
     */
    public function reload(): self
    {
        $this->vaultData = null;
        return $this;
    }

    /**
     * Get the current vault file path
     *
     * @return string The vault file path
     */
    public function getVaultPath(): string
    {
        return $this->vaultPath;
    }

    /**
     * Resolve the vault file path
     *
     * @param string|null $customPath Custom path provided by user
     * @return string Resolved absolute path
     */
    private function resolvePath(?string $customPath): string
    {
        if ($customPath !== null) {
            // If custom path is provided, use it as-is if absolute, or relative to storage
            return $this->isAbsolutePath($customPath) 
                ? $customPath 
                : storage_path($customPath);
        }

        // Default to storage/app/vault.json
        return storage_path('app/' . self::DEFAULT_VAULT_FILE);
    }

    /**
     * Check if a path is absolute
     *
     * @param string $path Path to check
     * @return bool True if absolute, false if relative
     */
    private function isAbsolutePath(string $path): bool
    {
        return str_starts_with($path, '/') || preg_match('/^[A-Za-z]:\\/', $path);
    }

    /**
     * Validate the vault file path
     *
     * @throws InvalidArgumentException If path is invalid
     */
    private function validatePath(): void
    {
        if (empty($this->vaultPath)) {
            throw new InvalidArgumentException('Vault path cannot be empty');
        }

        $directory = dirname($this->vaultPath);
        if (!is_dir($directory)) {
            throw new InvalidArgumentException(
                "Vault directory does not exist: {$directory}"
            );
        }

        if (!is_writable($directory)) {
            throw new InvalidArgumentException(
                "Vault directory is not writable: {$directory}"
            );
        }
    }

    /**
     * Load and parse vault data from file
     *
     * @return array Parsed vault data
     * @throws RuntimeException If file cannot be read or parsed
     */
    private function loadVaultData(): array
    {
        if ($this->vaultData !== null) {
            return $this->vaultData;
        }

        if (!File::exists($this->vaultPath)) {
            throw new RuntimeException(
                "Vault file not found: {$this->vaultPath}"
            );
        }

        $fileSize = File::size($this->vaultPath);
        if ($fileSize > self::MAX_FILE_SIZE) {
            throw new RuntimeException(
                "Vault file too large: {$fileSize} bytes (max: " . self::MAX_FILE_SIZE . ")"
            );
        }

        $content = File::get($this->vaultPath);
        if ($content === false) {
            throw new RuntimeException(
                "Failed to read vault file: {$this->vaultPath}"
            );
        }

        $data = json_decode($content, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new RuntimeException(
                "Invalid JSON in vault file: " . json_last_error_msg()
            );
        }

        if (!is_array($data)) {
            throw new RuntimeException(
                "Vault file must contain a JSON object"
            );
        }

        $this->vaultData = $data;
        return $this->vaultData;
    }

    /**
     * Get nested value from array using dot notation
     *
     * @param array $data The data array
     * @param string $key Dot notation key
     * @param mixed $default Default value
     * @return mixed The found value or default
     */
    private function getNestedValue(array $data, string $key, $default = null)
    {
        $keys = explode('.', $key);
        $current = $data;

        foreach ($keys as $segment) {
            if (!is_array($current) || !array_key_exists($segment, $current)) {
                return $default;
            }
            $current = $current[$segment];
        }

        return $current;
    }

    /**
     * Check if nested key exists using dot notation
     *
     * @param array $data The data array
     * @param string $key Dot notation key
     * @return bool True if key exists
     */
    private function hasNestedKey(array $data, string $key): bool
    {
        $keys = explode('.', $key);
        $current = $data;

        foreach ($keys as $segment) {
            if (!is_array($current) || !array_key_exists($segment, $current)) {
                return false;
            }
            $current = $current[$segment];
        }

        return true;
    }

    /**
     * Flatten nested array keys to dot notation
     *
     * @param array $data The data array
     * @param string $prefix Current prefix for recursion
     * @return array Flattened keys
     */
    private function flattenKeys(array $data, string $prefix = ''): array
    {
        $keys = [];

        foreach ($data as $key => $value) {
            $fullKey = $prefix ? "{$prefix}.{$key}" : $key;
            
            if (is_array($value)) {
                $keys = array_merge($keys, $this->flattenKeys($value, $fullKey));
            } else {
                $keys[] = $fullKey;
            }
        }

        return $keys;
    }
}