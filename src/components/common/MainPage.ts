import { IEvents } from '../../components/base/events';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface IPage {
	counter: number;
	products: HTMLElement[];
	lock: boolean;
}

export class MainPage extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _basketBtn: HTMLButtonElement;
	protected _store: HTMLElement;
	protected _parent: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>(
			'.header__basket-counter',
			container
		);
		this._basketBtn = ensureElement<HTMLButtonElement>(
			'.header__basket',
			container
		);
		this._store = ensureElement<HTMLElement>('.gallery', container);
		this._parent = ensureElement<HTMLElement>('.page__wrapper', container);

		this._basketBtn.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}
	set products(items: HTMLElement[]) {
		this._store.replaceChildren(...items);
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set lock(value: boolean) {
		if (value) {
			this.toggleClass(this._parent, 'page__wrapper_locked', true);
		} else {
			this.toggleClass(this._parent, 'page__wrapper_locked', false);
		}
	}
}
