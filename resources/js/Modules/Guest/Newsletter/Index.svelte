<script context="module" lang="ts">
    import { CONTAINER_SECTION } from "@/Const/Guest/UI/Container";
    import { NewsletterService } from "./Services/Newsletter.service";
    import newsletterStore from "./Stores/Newsletter";
    import SocialMedia from "./Parts/SocialMedia.svelte";
    import { Button, Input } from "@Components/Guest/Atoms/Index";
</script>

<script lang="ts">
    let emailInput = NewsletterService.getEmailValue(newsletterStore);
</script>

<div class={CONTAINER_SECTION.footer.main.newsletter.base}>
    <div>
        <h3 class={CONTAINER_SECTION.footer.main.newsletter.title}>
            {("newsletter.title")}
        </h3>
        <p class={CONTAINER_SECTION.footer.main.newsletter.description}>
            {("newsletter.description")}
        </p>
    </div>

    <form
        on:submit={(e) => NewsletterService.handleSubmit(e, newsletterStore)}
        class={CONTAINER_SECTION.footer.main.newsletter.form}
    >
        <Input
            type="email"
            placeholder={("newsletter.forms.email.placeholder")}
            bind:value={emailInput}
            variant="elegant"
            size="md"
            required
            disabled={$newsletterStore.isSubscribing}
            error={$newsletterStore.error || undefined}
            class={CONTAINER_SECTION.footer.main.newsletter.input}
        />

        <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={$newsletterStore.isSubscribing ||
                !$newsletterStore.isFormValid}
            className={CONTAINER_SECTION.footer.main.newsletter.button}
        >
            {$newsletterStore.isSubscribing
                ? ("newsletter.forms.submit.loadingLabel")
                : ("newsletter.forms.submit.label")}
        </Button>
    </form>

    <!-- Social Media Links -->
    <SocialMedia />
</div>
