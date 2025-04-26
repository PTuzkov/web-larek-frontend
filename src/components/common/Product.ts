import { IEvents } from '../base/events';
import { ensureElement, formatNumber } from '../../utils/utils';
import { Component } from '../base/Component';

export interface IProductView {
	id: string;
	category: string;
	title: string;
	description: string;
	image: string;
	price: number;
	inCart: boolean;
}

export abstract class Product extends Component<IProductView> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected events: IEvents;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = this.container.querySelector('.card__button');

		this.addEventListeners();
	}

	abstract addEventListeners(): void;

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		if (value === null) {
			this.setText(this._price, 'бесценно');
		} else {
			this.setText(this._price, `${formatNumber(value, ' ')} синапсов`);
		}
	}
}
