import { TOrder } from '../../types';
import { Form } from '../general/form';
import { ensureAllElements } from '../../utils/utils';
import { IEvents } from '../base/events';

export class OrderForm extends Form<TOrder> {
	protected _payment: HTMLButtonElement[];
  protected _address: HTMLInputElement;

	constructor(
    container: HTMLFormElement,
    events: IEvents) {
		super(container, events);

    // Инициализация элементов формы
		this._payment = ensureAllElements('.button_alt', this.container);
		this._address = this.container.elements.namedItem('address') as HTMLInputElement;

		// Обработчики событий для кнопок оплаты
		this._payment.forEach((button) => {
			button.addEventListener('click', this.onPaymentClick.bind(this, button));
		});
	}

  // Метод обработки клика по кнопке оплаты
	protected onPaymentClick(button: HTMLButtonElement) {
		const field = 'payment';
		const value = button.name as keyof TOrder;
		this.onPaymentChange(value, field);

	// Устанавливаем выбранную кнопку активной
		if (!button.classList.contains('button_alt-active')) {
			this.selectedPayment = value;
		}
	}

  // Метод для обработки изменений выбора оплаты
	protected onPaymentChange(value: string, field: keyof TOrder) {
		this.events.emit(`${this.container.name}.${field}:change`, {
			field,
			value,
		});
	}

  // Свойство для установки активной кнопки оплаты
	set selectedPayment(name: string) {
		this._payment.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
			this.setDisabled(button, button.name === name);
		});
	}
}