export type EventName = string | RegExp;
export type Subscriber = Function;
export type EmitterEvent = { eventName: string; data: unknown };

// Типы данных для API
export interface IItemData {
	id: string;
	category: string;
	title: string;
	description: string;
	image: string;
	price: number | null;
}

export interface ICatalogPage {
	pageStore: IItemData[];
	getProduct(id: string): IItemData;
}

export interface IOrderData {
	payment: string;
	address: string;
	email: string;
	phone: string;
	total: number;
	items: string[];
}

export interface IOrderResponse {
	id: string;
	total: number;
}

// Типы данных для отображения
export interface IModalData {
	content: HTMLElement;
}

// Интерфейс API-клиента
export interface IShopApi {
	getItems(): Promise<ICatalogPage>;
	submitOrder(data: IOrderData): Promise<IOrderResponse>;
}

// Интерфейсы модели данных
export interface ICartData {
	cartItems: IItemData[];
	cartGetItems: IItemData[];
	cartAddItem(item: IItemData): void;
	cartRemoveItem(itemId: string): void;
	cartClear(): void;
	cartGetTotalPrice(cartTotalPrice: number): number;
	cartHasItem(id: string): boolean;
}

export interface IOrderModel {
	setPayment(method: string): void;
	setAddress(address: string): void;
	setPhone(phone: string): void;
	setEmail(email: string): void;
	setItems(items: string[]): void;
	setTotal(total: number): void;
	validate(): boolean;
	getOrderData(): IOrderData;
}

// Интерфейсы отображений
export interface ICatalogView {
	items: IItemData[];
	render(data: Partial<ICatalogPage>): HTMLElement;
}

export interface IItemCard {
	id: string;
	title: string;
	price: number | null;
	image: string;
	category: string;
	description: string;
	render(data: Partial<IItemData>): HTMLElement;
}

export interface ICartView {
	items: IItemData[];
	total: number;
	render(data: Partial<ICartData>): HTMLElement;
}

export interface IOrderForm {
	payment: string;
	address: string;
	phone: string;
	email: string;
	valid: boolean;
	errors: string;
	render(data: Partial<IOrderData>): HTMLElement;
}

export interface ISuccessView {
	total: number;
	render(data: { total: number }): HTMLElement;
}

export interface IModal {
	content: HTMLElement;
	open(): void;
	close(): void;
	render(data: Partial<IModalData>): HTMLElement;
}

export interface IHomePage {
	items: IItemData[];
	counter: number;
	render(data: Partial<ICatalogPage>): HTMLElement;
}

// Интерфейсы базовых классов
export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
	onAll(callback: (event: EmitterEvent) => void): void;
	off(event: EventName, callback: Subscriber): void;
	offAll(): void;
}

export interface IComponent<T> {
	toggleClass(element: HTMLElement, className: string, force?: boolean): void;
	setText(element: HTMLElement, value: unknown): void;
	setDisabled(element: HTMLElement, state: boolean): void;
	setHidden(element: HTMLElement): void;
	setVisible(element: HTMLElement): void;
	setImage(element: HTMLImageElement, src: string, alt?: string): void;
	render(data?: Partial<T>): HTMLElement;
}

export type OrderMethodPay = Pick<IOrderData, 'payment' | 'address'>;

export type OrderContact = Pick<IOrderData, 'email' | 'phone'>;

export interface IUserData {
	clientData: OrderMethodPay & OrderContact;
}

export interface IContactsData {
	contactsPhone: string;
	contactsEmail: string;
	contactsIsValid: boolean;
}

// Перечисления событий
export enum ModelEvents {
	ItemsLoaded = 'items:loaded',
	CartUpdated = 'cart:updated',
	OrderChanged = 'order:changed',
	OrderValid = 'order:valid',
}

export enum ViewEvents {
	ItemSelect = 'item:select',
	ItemAdd = 'item:add',
	CartOpen = 'cart:open',
	OrderOpen = 'order:open',
	OrderSubmit = 'order:submit',
	ModalOpen = 'modal:open',
	ModalClose = 'modal:close',
}

// Дополнительные типы
export type FormErrors = Partial<Record<keyof IOrderData, string>>;
