import { type Page } from '@inertiajs/core';
type SveltePage = Omit<Page, 'props'> & {
    props: Page['props'] & {
        [key: string]: any;
    };
};
export declare const setPage: (this: void, value: SveltePage) => void;
declare const _default: {
    subscribe: (this: void, run: import("svelte/store").Subscriber<SveltePage>, invalidate?: import("svelte/store").Invalidator<SveltePage> | undefined) => import("svelte/store").Unsubscriber;
};
export default _default;
