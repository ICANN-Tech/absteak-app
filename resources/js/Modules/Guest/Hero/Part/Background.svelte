<script context="module" lang="ts">
	import { IMAGES } from '../Const/Image.const';
</script>

{#if IMAGES && IMAGES[0]}
    <div
        class="absolute inset-0 bg-cover bg-center opacity-50"
        style="background-image: url('{IMAGES[0].url}')"
    ></div>
{/if}
