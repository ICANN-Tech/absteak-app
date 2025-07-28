// src/lib/stores/visibility.ts
import { writable, type Writable } from 'svelte/store';

const visibilityMap = new Map<string | null, Writable<boolean>>();
const lockMap = new Map<string | null, { locked: boolean; lockedValue: boolean }>();

export function getVisibilityStore(id: string | null = null): Writable<boolean> {
	if (!visibilityMap.has(id)) {
		visibilityMap.set(id, writable(true));
	}
	return visibilityMap.get(id)!;
}

function isLocked(id: string | null = null): boolean {
	return lockMap.get(id)?.locked || false;
}

export function createVisibilityHandler(id: string | null = null) {
	const store = getVisibilityStore(id);

	// Return the handler function that respects lock state
	const handler = (visible: boolean) => {
		if (isLocked(id)) {
			// If locked, ignore attempts to change visibility to true
			if (visible === true) {
				return; // Ignore the change
			}
			// Allow setting to false even when locked
			store.set(visible);
		} else {
			// Normal behavior when not locked
			store.set(visible);
		}
	};

	return handler;
}

export function createVisibilityToggle(id: string | null = null) {
	const store = getVisibilityStore(id);

	// Return the toggle function that respects lock state
	const toggle = () => {
		if (isLocked(id)) {
			// If locked, ignore toggle attempts that would set to true
			store.update(current => {
				if (!current) {
					// Currently false, would toggle to true - ignore if locked
					return current;
				} else {
					// Currently true, would toggle to false - allow
					return !current;
				}
			});
		} else {
			// Normal toggle behavior when not locked
			store.update(current => !current);
		}
	};

	return toggle;
}

export function lockVisibility(id?: string | null, lockedValue: boolean = false) {
	if (id === undefined) {
		// Lock all visibility stores
		for (const [storeId, store] of visibilityMap) {
			lockMap.set(storeId, { locked: true, lockedValue });
			store.set(lockedValue);
		}
	} else {
		// Lock specific visibility store
		const store = getVisibilityStore(id);
		
		// Set the lock state
		lockMap.set(id, { locked: true, lockedValue });
		
		// Set the store to the locked value
		store.set(lockedValue);
	}
}

export function unlockVisibility(id?: string | null) {
	if (id === undefined) {
		// Unlock all visibility stores
		for (const [storeId] of visibilityMap) {
			lockMap.set(storeId, { locked: false, lockedValue: false });
		}
	} else {
		// Unlock specific visibility store
		lockMap.set(id, { locked: false, lockedValue: false });
	}
}

export function isVisibilityLocked(id?: string | null): boolean {
	if (id === undefined) {
		// Check if all visibility stores are locked
		for (const [storeId] of visibilityMap) {
			if (!isLocked(storeId)) {
				return false;
			}
		}
		return visibilityMap.size > 0; // Return true only if there are stores and all are locked
	} else {
		// Check specific visibility store
		return isLocked(id);
	}
}

export function getAllVisibilityStores(): Map<string | null, Writable<boolean>> {
	return new Map(visibilityMap);
}

export function getAllLockStates(): Map<string | null, { locked: boolean; lockedValue: boolean }> {
	return new Map(lockMap);
}
