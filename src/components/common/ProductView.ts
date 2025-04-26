import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { Product } from '../common/Product';

export class ProductView extends Product {
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected events: IEvents;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container, events);

		this._category = ensureElement<HTMLElement>('.card__category', container);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
	}

	addEventListeners() {
		this.container.addEventListener('click', () =>
			this.events.emit<{ id: string }>('product:select', { id: this.id })
		);
	}

	CategoryProd: { [key: string]: string } = {
		'софт-скил': 'card__category_soft',
		'хард-скил': 'card__category_hard',
		дополнительное: 'card__category_additional',
		другое: 'card__category_other',
		кнопка: 'card__category_button',
	};

	set category(value: string) {
		this.setText(this._category, value);
		if (this._category) {
			this._category.className = `card__category ${this.CategoryProd[value]}`;
		}
	}

	set image(value: string) {
		this.setImage(this._image, value);
	}
}
