import { Component } from '../base/component';
import { createElement, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

interface IBasketView {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _orderButton: HTMLButtonElement;

  constructor(protected container: HTMLElement, events: IEvents) {
    super(container);
    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = ensureElement<HTMLElement>('.basket__price', this.container);
    this._orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this._orderButton.addEventListener('click', ()=> {
      events.emit('order:open');
  });
  }

  // Управление доступностью кнопки заказа
  disabledOrderButton(isDisabled: boolean) {
    this.setDisabled(this._orderButton, isDisabled);
  }

  // Управление элементами корзины
  set items(items: HTMLElement[]) {
    if (items.length) {
      this._list.replaceChildren(...items);
      this.disabledOrderButton(false);
    } else {
      this._list.replaceChildren(
        createElement<HTMLParagraphElement>('p', {
          textContent: 'Корзина пуста',
        }));
      this.disabledOrderButton(true);
    }
  }

  // Управление общей стоимостью
  set total(total: number) {
    this.setText(this._total, `${String(total)} синапсов`);
  }

  
  // Метод рендера для обновления данных корзины
  render(data?: IBasketView) {
    if (!data) return this.container;
    this.items = data.items;
    this.total = data.total;
    return this.container;
  } 
}
