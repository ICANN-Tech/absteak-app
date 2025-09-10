/**
 * Example usage of ConfigurationTranslation utility
 * This file demonstrates how to use the reusable translation functions
 * for configuration data that automatically responds to language changes.
 */

import { 
	createMultilingualStore, 
	createConfigurationTranslation, 
	createConfigurationField, 
	createAllConfigurationsTranslation 
} from './ConfigurationTranslation';

// Example 1: Using createMultilingualStore - General approach
// Case 1a: Direct translation by language key (en, id, etc.)
const directTranslation = createMultilingualStore('welcome_message');
// Usage: <h1>{$directTranslation.text}</h1>

// Case 1b: Translation with specific fields
const experienceTranslation = createMultilingualStore('experience', ['title', 'description', 'subtitle']);
// Usage: <h2>{$experienceTranslation.title}</h2>
//        <h3>{$experienceTranslation.subtitle}</h3>
//        <p>{$experienceTranslation.description}</p>

// Example 2: Using createConfigurationTranslation (backward compatibility)
// This creates a reactive store that automatically updates when language changes
const legacyExperienceTranslation = createConfigurationTranslation('experience');
// Usage: <h2>{$legacyExperienceTranslation.title}</h2>
//        <p>{$legacyExperienceTranslation.description}</p>

// Example 3: Using createConfigurationField for specific fields
// This is useful when you only need one field from a configuration
const experienceTitle = createConfigurationField('experience', 'title', 'Default Experience Title');
const experienceDescription = createConfigurationField('experience', 'description', 'Default Description');
// Usage: <h2>{$experienceTitle}</h2>
//        <p>{$experienceDescription}</p>

// Example 4: Using createAllConfigurationsTranslation for multiple configurations
// This creates a store with all configurations translated
const allConfigurations = createAllConfigurationsTranslation();
// Usage: <h2>{$allConfigurations.experience?.title}</h2>
//        <h3>{$allConfigurations.menu?.title}</h3>
//        <h4>{$allConfigurations.about?.title}</h4>

// Example 5: Advanced createMultilingualStore usage
// For complex configurations with multiple fields
const menuTranslation = createMultilingualStore('menu', ['title', 'subtitle', 'description', 'note']);
const heroTranslation = createMultilingualStore('hero', ['headline', 'tagline', 'cta_text']);
// Usage: <h1>{$menuTranslation.title}</h1>
//        <h2>{$menuTranslation.subtitle}</h2>
//        <p>{$menuTranslation.description}</p>
//        <small>{$menuTranslation.note}</small>

// Example 6: Component implementation with createMultilingualStore
/*
<script lang="ts">
	import { createMultilingualStore } from '../../../Utils/Global/ConfigurationTranslation';

	// Create reactive stores for different configurations
	const menuTranslation = createMultilingualStore('menu', ['title', 'description', 'subtitle']);
	const aboutTranslation = createMultilingualStore('about', ['title', 'description']);
	const contactTranslation = createMultilingualStore('contact', ['title', 'description', 'address']);
	
	// For direct translation by language key
	const welcomeMessage = createMultilingualStore('welcome');

	// These will automatically update when user changes language
	// via the LanguageSwitch component
</script>

<div>
	<h1>{$menuTranslation.title}</h1>
	<h2>{$menuTranslation.subtitle}</h2>
	<p>{$menuTranslation.description}</p>
	
	<h2>{$aboutTranslation.title}</h2>
	<p>{$aboutTranslation.description}</p>
	
	<h3>{$contactTranslation.title}</h3>
	<p>{$contactTranslation.description}</p>
	<address>{$contactTranslation.address}</address>
	
	<p>{$welcomeMessage.text}</p>
</div>
*/

// Example 5: Advanced usage with custom fallbacks and error handling
/*
<script lang="ts">
	import { createConfigurationTranslation, getTranslatedText } from '../../../Utils/Global/ConfigurationTranslation';
	import { localeStore } from '../../Stores/Global/Locale';
	import { page } from '@inertiajs/svelte';

	const configTranslation = createConfigurationTranslation('custom_config');

	// Manual translation with custom fallback
	$: customTitle = getTranslatedText(
		$page.props.configurations?.custom_config?.value?.title,
		$localeStore.current,
		'Custom Fallback Title'
	);
</script>
*/

export {
	experienceTranslation,
	experienceTitle,
	experienceDescription,
	allConfigurations
};