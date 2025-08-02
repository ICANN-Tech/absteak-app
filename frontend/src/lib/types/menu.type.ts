
	export interface MenuItem {
		name: string;
		desc: string;
		price: string;
		img: string;
	}

	export interface MenuCategory {
		category: string;
		items: MenuItem[];
	}