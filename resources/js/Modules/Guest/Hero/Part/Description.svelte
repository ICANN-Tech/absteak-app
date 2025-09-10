<script module lang="ts">
    import { createTranslationStore } from "@/Utils/Global/Translation";
    import { CONTAINER_SECTION } from "@Const/Guest/UI/Container";
</script>

<script lang="ts">
    const t = createTranslationStore();
</script>

<p class={CONTAINER_SECTION.hero.text.description}>
    {$t(
        "hero.description",
        "Experience the finest culinary journey with premium steaks grilled to perfection.",
    )}
</p>
