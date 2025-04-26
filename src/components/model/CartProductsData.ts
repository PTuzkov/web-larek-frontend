import { ICartData, IItemData } from '../../types';
import { IEvents } from '../base/events';

export class CartProductsData implements ICartData {
	protected _basketProducts: IItemData[];
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
		this._basketProducts = [];
	}

	get cartItems() {
		return this._basketProducts;
	}

	get cartGetItems() {
		return this._basketProducts.filter((product) => product.price !== null);
	}

	cartAddItem(product: IItemData): void {
		if (
			product &&
			typeof product.id === 'string' &&
			typeof product.title === 'string' &&
			typeof product.category === 'string' &&
			typeof product.description === 'string' &&
			typeof product.image === 'string' &&
			(typeof product.price === 'number' || product.price === null)
		) {
			this._basketProducts = [product, ...this._basketProducts];
			this.events.emit('basket:changed');
		}
	}

	cartRemoveItem(productId: string): void {
		this._basketProducts = this._basketProducts.filter(
			(product) => product.id !== productId
		);
		this.events.emit('basket:changed');
	}

	isEmptyBasket(): boolean {
		return this.cartGetTotalPrice() === 0;
	}

	getNumber() {
		return this._basketProducts.length;
	}

	cartClear(): void {
		this._basketProducts = [];
		this.events.emit('basket:changed');
	}

	cartHasItem(id: string): boolean {
		return this._basketProducts.some((product) => {
			return product.id === id;
		});
	}

	cartGetTotalPrice(): number {
		return this._basketProducts.reduce((total, product) => {
			if (product.price === null) {
				return total;
			}
			return (total += product.price);
		}, 0);
	}
}
