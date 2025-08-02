// Interface ini berfungsi sebagai blueprint untuk semua komponen
export interface Props {
    size: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'white' | 'black';
}

// Anda juga bisa membuat tipe untuk nilai default
export const defaultProps: Props = {
    size: 'md' as const,
    color: 'primary' as const
};

