<script context="module" lang="ts">
import Newsletter from "@Modules/Guest/Newsletter/Index.svelte"
import QuickLink from "@Modules/Guest/QuickLink/Index.svelte";
import Map from "./Parts/Map.svelte";
import Copyright from "./Parts/Copyright.svelte";
import { CONTAINER_SECTION } from "../../../Const/Guest/UI/Container";
import BackgroundDecorative from "./Parts/BackgroundDecorative.svelte";
import RestaurantInfo from "./Parts/RestaurantInfo.svelte";
</script>

<script lang="ts">
</script>

<footer id="footer" class={CONTAINER_SECTION.footer.base}>
    <!-- Background decorative elements -->
    <BackgroundDecorative />

    <!-- Map Section -->
     <Map />

    <div class={CONTAINER_SECTION.footer.main.section}>
        <div class={CONTAINER_SECTION.footer.main.container}>
            <!-- Main Footer Content -->
            <div class={CONTAINER_SECTION.footer.main.grid}>
                <!-- Restaurant Info -->
                <RestaurantInfo />

                <!-- Quick Links -->
                <QuickLink />

                <!-- Newsletter Subscription -->
                <Newsletter />
            </div>

            <!-- Bottom Footer -->
			<Copyright />
        </div>
    </div>
</footer>
