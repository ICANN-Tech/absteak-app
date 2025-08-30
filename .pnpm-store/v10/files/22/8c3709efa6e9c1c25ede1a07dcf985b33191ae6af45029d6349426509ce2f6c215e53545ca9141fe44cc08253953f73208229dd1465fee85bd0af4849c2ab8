import { SvelteComponent } from "svelte";
import { type Errors, type FormDataConvertible } from '@inertiajs/core';
declare const __propDef: {
    props: {
        [x: string]: any;
        action?: string | import("@inertiajs/core").UrlMethodPair | undefined;
        method?: import("@inertiajs/core").Method | "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | undefined;
        headers?: Record<string, string> | undefined;
        queryStringArrayFormat?: "indices" | "brackets" | undefined;
        errorBag?: string | null | undefined;
        showProgress?: boolean | undefined;
        transform?: ((data: Record<string, FormDataConvertible>) => Record<string, FormDataConvertible>) | undefined;
        options?: import("@inertiajs/core").FormComponentOptions | undefined;
        onCancelToken?: (({ cancel }: {
            cancel: VoidFunction;
        }) => void) | undefined;
        onBefore?: import("@inertiajs/core").GlobalEventCallback<"before", import("@inertiajs/core").RequestPayload> | undefined;
        onStart?: import("@inertiajs/core").GlobalEventCallback<"start", import("@inertiajs/core").RequestPayload> | undefined;
        onProgress?: import("@inertiajs/core").GlobalEventCallback<"progress", import("@inertiajs/core").RequestPayload> | undefined;
        onFinish?: import("@inertiajs/core").GlobalEventCallback<"finish", import("@inertiajs/core").RequestPayload> | undefined;
        onCancel?: import("@inertiajs/core").GlobalEventCallback<"cancel", import("@inertiajs/core").RequestPayload> | undefined;
        onSuccess?: import("@inertiajs/core").GlobalEventCallback<"success", import("@inertiajs/core").RequestPayload> | undefined;
        onError?: import("@inertiajs/core").GlobalEventCallback<"error", import("@inertiajs/core").RequestPayload> | undefined;
        onSubmitComplete?: ((props: import("@inertiajs/core").FormComponentonSubmitCompleteArguments) => void) | undefined;
        disableWhileProcessing?: boolean | undefined;
        invalidateCacheTags?: string | string[] | undefined;
        resetOnError?: boolean | string[] | undefined;
        resetOnSuccess?: boolean | string[] | undefined;
        setDefaultsOnSuccess?: boolean | undefined;
        submit?: (() => void) | undefined;
        reset?: ((...fields: string[]) => void) | undefined;
        clearErrors?: ((...fields: string[]) => void) | undefined;
        resetAndClearErrors?: ((...fields: string[]) => void) | undefined;
        setError?: ((field: string | object, value?: string) => void) | undefined;
        defaults?: (() => void) | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            errors: Errors;
            hasErrors: boolean;
            processing: boolean;
            progress: import("axios").AxiosProgressEvent | null;
            wasSuccessful: boolean;
            recentlySuccessful: boolean;
            clearErrors: (...fields: string[]) => void;
            resetAndClearErrors: (...fields: string[]) => void;
            setError: (field: string | object, value?: string) => void;
            isDirty: boolean;
            submit: () => void;
            defaults: () => void;
        };
    };
    exports?: undefined;
    bindings?: undefined;
};
export type FormProps = typeof __propDef.props;
export type FormEvents = typeof __propDef.events;
export type FormSlots = typeof __propDef.slots;
export default class Form extends SvelteComponent<FormProps, FormEvents, FormSlots> {
    get submit(): () => void;
    get reset(): (...fields: string[]) => void;
    get clearErrors(): (...fields: string[]) => void;
    get resetAndClearErrors(): (...fields: string[]) => void;
    get setError(): (field: string | object, value?: string) => void;
    get defaults(): () => void;
}
export {};
