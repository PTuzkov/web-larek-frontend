import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { ProductView } from './ProductView';

export class ProductModal extends ProductView {
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _description: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this._description = ensureElement<HTMLElement>('.card__text', container);
	}

	addEventListeners(): void {
		this._button.addEventListener('click', () =>
			this.events.emit('product:buy', { id: this.id })
		);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set inCart(value: boolean) {
		this.setDisabled(this._button, value);
		if (value === true) {
			this.setText(this._button, 'Уже в корзине');
		} else {
			this.setText(this._button, 'В корзину');
		}
	}
}
