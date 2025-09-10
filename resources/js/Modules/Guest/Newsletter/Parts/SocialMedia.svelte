<script context="module" lang="ts">
    import { page } from "@inertiajs/svelte";
    import { CONTAINER_SECTION } from "@/Const/Guest/UI/Index";
    import { SocialMediaContact } from "@/Components/Guest/Molecules/Contact/Index";
</script>

<script lang="ts">
    type SocialPlatform = "facebook" | "twitter" | "instagram" | "youtube";
    const socials = $page.props.contact?.social as
        | Record<SocialPlatform, string>
        | undefined;
</script>

<div class={CONTAINER_SECTION.footer.main.newsletter.social}>
    {#if socials}
        {#each Object.entries(socials) as [platform, url]}
            <SocialMediaContact
                platform={platform as SocialPlatform}
                url={url as string}
            />
        {/each}
    {/if}
</div>
