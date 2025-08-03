import type { Outlet } from "$lib/components/organisms/reservation/form/OutletSelector.svelte";

export const OUTLET_DUMMY: Outlet[] = [
		{
			id: 'outlet-1',
			name: 'Main Dining Room',
			branchId: 'branch-1',
			type: 'indoor',
			capacity: 80,
			features: ['AC', 'Live Music', 'City View'],
			available: true,
			priceRange: 'Premium'
		},
		{
			id: 'outlet-2',
			name: 'Garden Terrace',
			branchId: 'branch-1',
			type: 'outdoor',
			capacity: 40,
			features: ['Garden View', 'Fresh Air', 'Romantic Setting'],
			available: true,
			priceRange: 'Premium'
		},
		{
			id: 'outlet-3',
			name: 'Private Room VIP',
			branchId: 'branch-1',
			type: 'private',
			capacity: 12,
			features: ['Private', 'Karaoke', 'Projector'],
			available: true,
			priceRange: 'Luxury'
		},
		{
			id: 'outlet-4',
			name: 'Main Hall',
			branchId: 'branch-2',
			type: 'indoor',
			capacity: 60,
			features: ['AC', 'Traditional Decor'],
			available: true,
			priceRange: 'Standard'
		},
		{
			id: 'outlet-5',
			name: 'Rooftop Dining',
			branchId: 'branch-2',
			type: 'outdoor',
			capacity: 30,
			features: ['Mountain View', 'Sunset View'],
			available: false,
			priceRange: 'Premium'
		}
	];