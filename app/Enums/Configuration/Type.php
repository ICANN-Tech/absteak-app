<?php

namespace App\Enums\Configuration;

enum Type: string
{
    case String = 'string';
    case Integer = 'integer';
    case Float = 'float';
    case Boolean = 'boolean';
    case Array = 'array';
    case Object = 'object';

    public function castValue(mixed $value): mixed
    {
        return match ($this) {
            self::String => (string) $value,
            self::Integer => (int) $value,
            self::Float => (float) $value,
            self::Boolean => (bool) $value,
            self::Array => (array) $value,
            self::Object => (object) $value,
        };
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function getLabel(): string
    {
        return match ($this) {
            self::String => 'String',
            self::Integer => 'Integer',
            self::Float => 'Float',
            self::Boolean => 'Boolean',
            self::Array => 'Array',
            self::Object => 'Object',
        };
    }
}
