import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

interface IPageView {
  counter: number;
  catalog: HTMLElement[];
  wrapperLocked: boolean;
}

export class Page extends Component<IPageView> {
	protected _catalog: HTMLElement;
  protected _counter: HTMLElement;
  protected _basketButton: HTMLButtonElement;
  protected _wrapper: HTMLElement;
	locked: boolean;

  constructor(container: HTMLElement, protected events: IEvents) {
	  super(container);
    
    // Инициализация элементов
	  this._catalog = ensureElement<HTMLElement>('.gallery', this.container);
	  this._wrapper = ensureElement<HTMLElement>('.page__wrapper', this.container);      
    this._counter = ensureElement<HTMLElement>('.header__basket-counter',  this.container);
    this._basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);      
  		
    // Обработчик клика по кнопке корзины
    this._basketButton.addEventListener('click', () => {
      this.events.emit(`basket:open`);
    });
  }

  // Установка элементов каталога
  set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

  // Установка значения счетчика
	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

  // Управление блокировкой страницы
	set wrapperLocked(value: boolean) {
		this.toggleClass(this._wrapper,'page__wrapper_locked', value);
	}
}
