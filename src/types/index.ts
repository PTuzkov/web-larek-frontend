export interface ICatalogPage {
	items: ItemData[];
	getItem(id: string): ItemData;
}

export interface ItemData {
	id: string;
	type: string;
	name: string;
	details: string;
	thumbnail: string;
	price: number;
}

export interface ICartData {
	cartItems: ItemData[];
	cartGetItems: ItemData[];
	addItem(item: ItemData): void;
	removeItem(itemId: string): void;
	clearCart(): void;
	getTotalPrice(cartSumPrice: number): number;
	inCart(id: string): boolean;
}

export interface ICustomerData {
	paymentInfo: PaymentDetails & ContactInfo;
}

export interface IContactInfo {
	phone: string;
	email: string;
	isValid: boolean;
}

export type PaymentDetails = Pick<ICartData, 'payment' | 'address'>;

export type ContactInfo = Pick<ICartData, 'email' | 'phone'>;

export type FormErrors = Partial<Record<keyof ICartData, string>>;
