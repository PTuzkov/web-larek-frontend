import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export abstract class Form<T extends object> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', container);

		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;

			this.onInputChange(field as keyof T, value);
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}

	set valid(value: boolean) {
		this.setDisabled(this._submit, value);
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		this.setDisabled(this._submit, !valid);
		return this.container;
	}
}
