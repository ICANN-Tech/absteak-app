# AutoHide Example

This demonstrates how to use the `autoHide` utility in a real Svelte component.

## What it does

- Auto-hides the element after the user is idle.
- Re-shows it on scroll up or mouse movement.
- Only activates after scrolling past a threshold.

## Usage

```ts
import { autoHide } from '$lib/utils/autoHide';
import { onMount } from 'svelte';
import { writable } from 'svelte/store';

const isVisible = writable(true);

onMount(() => {
  autoHide((visible) => {
    isVisible.set(visible);
  });
});
