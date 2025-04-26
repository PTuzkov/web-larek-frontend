import {
	FormErrors,
	IUserData,
	OrderMethodPay,
	OrderContact,
} from '../../types/index';
import { IEvents } from '../base/events';

export class UserData implements IUserData {
	protected _clientData: OrderMethodPay & OrderContact;
	protected events: IEvents;
	formErrors: FormErrors = {};

	constructor(events: IEvents) {
		this.events = events;
		this._clientData = {
			payment: '',
			address: '',
			email: '',
			phone: '',
		};
	}

	get clientData() {
		return this._clientData;
	}

	setOrderField(field: keyof OrderMethodPay, value: string) {
		this._clientData[field] = value;
		if (this.validateOrder()) {
			return;
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};

		if (!this._clientData.payment) {
			errors.payment = 'Установите способ оплаты';
		}
		if (!this._clientData.address) {
			errors.address = 'Укажите ваш адрес';
		}

		console.log(errors);

		this.formErrors = errors;
		this.events.emit('orderForm:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setContactsField(field: keyof OrderContact, value: string) {
		this._clientData[field] = value;

		if (this.validateContacts()) {
			return;
		}
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};
		if (!this._clientData.email) {
			errors.email = 'Укажите ваш email';
		}
		if (!this._clientData.phone) {
			errors.phone = 'Укажите ваш телефон';
		}
		this.formErrors = errors;
		this.events.emit('contacts:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}
}
