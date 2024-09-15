import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { ISuccessfulOrder } from '../../types/index';

interface ISuccessActions {
	onClick?: () => void;
}

export class SuccessfulForm extends Component<ISuccessfulOrder> {
  protected _description: HTMLElement;
	protected _closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents,  actions?: ISuccessActions) {
		super(container);

    // Инициализация элементов
		this._description = ensureElement<HTMLElement>('.order-success__description', this.container);
		this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

		// Обработка события нажатия на кнопку закрытия
		this._closeButton.addEventListener('click', () => {
			this.events.emit('success:finish');
			actions?.onClick?.();
		});
	}

	set total(value: number) {
		this.setText(this._description,`Списано ${value} синапсов `) ;
	}
}