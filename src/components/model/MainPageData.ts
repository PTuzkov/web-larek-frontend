import { IItemData, ICatalogPage } from '../../types';
import { IEvents } from '../base/events';

export class ProductsData implements ICatalogPage {
	protected store: IItemData[];
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}
	// Инициализация массива товаров
	set pageStore(products: IItemData[]) {
		this.store = products;
		this.events.emit('products:set');
	}

	get pageStore() {
		return this.store;
	}

	getProduct(productId: string) {
		return this.store.find((item) => item.id === productId);
	}
}
