<script context="module" lang="ts">
    import { page } from "@inertiajs/svelte";
    import { CONTAINER_SECTION } from "@Const/Guest/UI/Container";
    import { createMultilingualTranslation } from "@Utils/Global/Translation";
    import CategoryTab from "../tab/Category.svelte";
    import ItemList from "../list/Item.svelte";
</script>

<script lang="ts">
    const translation = createMultilingualTranslation(
        () => $page.props.menu.general,
        ["title", "subtitle"],
    );
</script>

<div
    class={`${CONTAINER_SECTION.menu.content.left} ${CONTAINER_SECTION.menu.text.base}`}
>
    <div class={CONTAINER_SECTION.experience.flex}>
        <h2 class={`${CONTAINER_SECTION.menu.text.title} drop-shadow-2xl`}>
            {$translation?.title || "MENU SIGNATURE KAMI"}
        </h2>
        <p class={`${CONTAINER_SECTION.menu.text.description} drop-shadow-lg`}>
            {$translation?.subtitle ||
                "Rasakan keunggulan kuliner dengan pilihan hidangan yang dikurasi dengan cermat, dibuat oleh chef kelas dunia menggunakan bahan-bahan terbaik."}
        </p>

        <!-- Category Tabs -->
        <CategoryTab />

        <!-- Menu Items with Menu Scrollbar -->
        <ItemList />
    </div>
</div>
