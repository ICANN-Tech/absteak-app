import type { Branch } from "$lib/components/organisms/reservation/form/BranchSelector.svelte";

export const BRANCH_DUMMY: Branch[] = [
		{
			id: 'branch-1',
			name: 'ABSteak Jakarta Pusat',
			address: 'Jl. Sudirman No. 123, Jakarta Pusat',
			phone: '+62 21 1234 5678',
			available: true
		},
		{
			id: 'branch-2',
			name: 'ABSteak Bandung',
			address: 'Jl. Braga No. 45, Bandung',
			phone: '+62 22 8765 4321',
			available: true
		},
		{
			id: 'branch-3',
			name: 'ABSteak Surabaya',
			address: 'Jl. Pemuda No. 67, Surabaya',
			phone: '+62 31 9876 5432',
			available: false
		}
	];