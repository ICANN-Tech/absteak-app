<script context="module" lang="ts">
    import { CONTAINER_SECTION, UI_LAYOUT } from "@/Const/Guest/UI/Index";
</script>

<div class={CONTAINER_SECTION.footer.map.section}>
    <div class="mx-auto {UI_LAYOUT.maxWidth.content}">
        <div class={`${CONTAINER_SECTION.footer.map.content.base}`}>
            <div
                class={`${CONTAINER_SECTION.footer.map.content.info.location.base}`}
            >
                <div
                    class={`${CONTAINER_SECTION.footer.map.content.info.base}`}
                >
                    <h2
                        class={`${CONTAINER_SECTION.footer.map.content.info.title}`}
                    >
                        {title}
                    </h2>
                    <p
                        class={`${CONTAINER_SECTION.footer.map.content.info.description}`}
                    >
                        {description}
                    </p>
                </div>
                <DetailContact {address} {phone} {email} />
            </div>

            <div
                class={`${CONTAINER_SECTION.footer.map.content.info.location.base}`}
            >
                <LandmarkMap restaurantName="ABSteak" />
                <ControlMap {address} />
            </div>
        </div>
    </div>
</div>
