import { IEvents } from '../base/events';
import { Product } from '../common/Product';

export class cartItems extends Product {
	protected _button: HTMLButtonElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected events: IEvents;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container, events);
		this._button = this.container.querySelector('.card__button');
	}

	addEventListeners(): void {
		this._button.addEventListener('click', () =>
			this.events.emit('basketProduct:delete', { id: this.id })
		);
	}
}
