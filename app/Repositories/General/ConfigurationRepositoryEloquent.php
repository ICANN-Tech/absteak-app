<?php

namespace App\Repositories\General;

use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Contracts\CacheableInterface;
use Prettus\Repository\Traits\CacheableRepository;
use App\Repositories\General\ConfigurationRepository;
use App\Models\Configuration;
use App\Validators\General\ConfigurationValidator;

/**
 * Class ConfigurationRepositoryEloquent.
 *
 * @package namespace App\Repositories\General;
 */
class ConfigurationRepositoryEloquent extends BaseRepository implements ConfigurationRepository, CacheableInterface
{
    use CacheableRepository;
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Configuration::class;
    }

    

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Get configuration by key with cache
     *
     * @param string $key
     * @return mixed
     */
    public function getByKey($key)
    {
        return $this->findWhere(['key' => $key])->first();
    }

    /**
     * Get all configurations with cache
     *
     * @return mixed
     */
    public function getAllConfigurations()
    {
        return $this->all();
    }

    /**
     * Create or update configuration with cache support
     *
     * @param array $attributes
     * @param array $values
     * @return mixed
     */
    public function updateOrCreate(array $attributes, array $values = []): mixed
    {
        // Find existing record
        $existing = $this->findWhere($attributes)->first();
        
        if ($existing) {
            // Update existing record
            return $this->update($values, $existing->id);
        } else {
            // Create new record with merged attributes and values
            return $this->create(array_merge($attributes, $values));
        }
    }

}
