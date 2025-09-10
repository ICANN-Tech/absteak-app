<?php

namespace App\Repositories\General;

use Prettus\Repository\Contracts\RepositoryInterface;
use Prettus\Repository\Contracts\CacheableInterface;

/**
 * Interface ConfigurationRepository.
 *
 * @package namespace App\Repositories\General;
 */
interface ConfigurationRepository extends RepositoryInterface, CacheableInterface
{
    /**
     * Get configuration by key with cache
     *
     * @param string $key
     * @return mixed
     */
    public function getByKey($key);

    /**
     * Get all configurations with cache
     *
     * @return mixed
     */
    public function getAllConfigurations();

    /**
     * Create or update configuration with cache support
     *
     * @param array $attributes
     * @param array $values
     * @return mixed
     */
    public function updateOrCreate(array $attributes, array $values = []);
}
