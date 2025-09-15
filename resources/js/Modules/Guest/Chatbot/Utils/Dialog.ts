export function toggleDialog(open: boolean, disabled = false): boolean {
    if (disabled) return open; // tidak berubah kalau disabled
    return !open;
}

export function closeDialog(open: boolean): boolean {
    return open ? false : open;
}

export function openDialog(open: boolean): boolean {
    return !open;
}

// Chat dialog specific functions
export function toggleChat(open: boolean, disabled = false): boolean {
    if (disabled) return open;
    return !open;
}

export function closeChat(open: boolean): boolean {
    if (open) return false;
    return open;
}

// Click outside handler untuk menutup dialog
export function handleClickOutside(
    event: MouseEvent, 
    dialogElement: HTMLElement | null, 
    onClose: () => void
): void {
    if (!dialogElement) return;
    
    // Cek apakah klik terjadi di luar dialog
    if (!dialogElement.contains(event.target as Node)) {
        onClose();
    }
}

// Setup click outside listener
export function setupClickOutsideListener(
    dialogElement: HTMLElement | null,
    onClose: () => void
): () => void {
    if (!dialogElement) return () => {};
    
    const handleClick = (event: MouseEvent) => {
        handleClickOutside(event, dialogElement, onClose);
    };
    
    // Tambahkan event listener ke document
    document.addEventListener('mousedown', handleClick);
    
    // Return cleanup function
    return () => {
        document.removeEventListener('mousedown', handleClick);
    };
}
