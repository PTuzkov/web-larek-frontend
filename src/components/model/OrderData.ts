import { IEvents } from '../base/events';
import { IOrderData } from '../../types/index';
import { ensureAllElements } from '../../utils/utils';
import { Form } from '../common/Form';

export class OrderData extends Form<IOrderData> {
	protected _paymentBtns: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._paymentBtns = ensureAllElements('.button_alt', this.container);

		this._paymentBtns.forEach((button) => {
			button.addEventListener('click', () => {
				this.orderMethodPay = button.name;
				this.onInputChange('payment', button.name);
			});
		});
	}

	set orderMethodPay(name: string) {
		this._paymentBtns.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}

	set orderAddress(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	set valid(value: boolean) {
		this.setDisabled(this._submit, !value);
	}
}
