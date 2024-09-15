import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

// Данные модального окна
interface IModalInfo {
	content: HTMLElement;
}

// Класс по работе с базовым модальным окном
export class Modal extends Component<IModalInfo> {
	protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
	  super(container);

		this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

    this._content.addEventListener('click', (evt) => evt.stopPropagation());
    this.container.addEventListener('click', this.close.bind(this));
    this._closeButton.addEventListener('click', this.close.bind(this));
	}

  // Получение контента
	set content(content: HTMLElement) {
		this._content.replaceChildren(content);
	}

  // Открыть мод.окно
  open() {
    this.container.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  // Закрыть мод.окно
  close() {
    this.container.classList.remove('modal_active');
    this.events.emit('modal:close');
  }

  // Рендер мод.окна
	render(data: IModalInfo): HTMLElement {
		super.render(data);
		this.content= data.content;
		this.open();
		return this.container;
	}
}