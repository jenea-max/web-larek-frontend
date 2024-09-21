import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { ProductCardData } from '../appModelData';
import { IEvents } from '../base/events';
import { EProductCategory } from '../../types';

interface ICardActions {
	onClick: (Event: MouseEvent) => void;
}
// Базовый класс карты товара
export class Card extends Component<ProductCardData> {
	protected _titleElement: HTMLElement;
	protected _priceElement: HTMLElement;
	protected _actionButton: HTMLButtonElement;

	constructor(
		protected _container: HTMLElement,
		protected _actions?: ICardActions
	) {
		super(_container);
		this._titleElement = ensureElement<HTMLElement>('.card__title', this.container);
		this._priceElement = ensureElement<HTMLElement>('.card__price', this.container);

		this._actionButton = _container.querySelector('.card__button');
	}

	set title(value: string) {
		this.setText(this._titleElement, value);
	}

	set price(value: number | null) {
		if (value !== null) {
			this.setText(this._priceElement, `${value} синапсов`);
		} else {
			this.setText(this._priceElement, 'Бесценно');
		}
	}

	set productId(value: string) {
		this.container.dataset.productId = value;
	}

	get productId(): string {
		return this.container.dataset.productId || '';
	}
}

// Класс карты товара в каталоге
export class CardCatalog extends Card {
	protected _imageElement: HTMLImageElement;
	protected _categoryElement: HTMLElement;

	constructor(
		protected _container: HTMLElement,
		protected _actions?: ICardActions) {
		super(_container);

		this._imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
		this._categoryElement = ensureElement<HTMLElement>('.card__category', this.container);

		if (_actions?.onClick) {
			if (this._actionButton) {
				this._actionButton.addEventListener('click', _actions.onClick);
			} else {
				_container.addEventListener('click', _actions.onClick);
			}
		}
	}

	set image(valueUrl: string) {
		this.setImage(this._imageElement, valueUrl, this.title);
	}

	set category(valuecategory: keyof typeof EProductCategory) {
		if (this._categoryElement) {
			this.setText(this._categoryElement, valuecategory);
			this._categoryElement.classList.add(
				`card__category_${EProductCategory[valuecategory]}`
			);
		}
	}
}

// Класс карты товара в при раскрытии
export class CardOpen extends CardCatalog {
	protected _descriptionElement: HTMLElement;
  inBasket: boolean;
	isUnavailable: boolean;

	constructor(
		protected _container: HTMLElement,
		protected _events: IEvents,
		protected _actions?: ICardActions
	) {
		super(_container, _actions);

		this._descriptionElement = ensureElement<HTMLElement>(
			'.card__text',
			this.container
		);
	}

	set description(value: string) {
		this.setText(this._descriptionElement, value);
	}

	set buttonState(state: { stateIsNull: boolean; inBasket: boolean; isPriceless: boolean }) {
		if (this._actionButton) {
			// Если товар бесценен
			if (state.isPriceless) {
				this.setDisabled(this._actionButton, true);
				this.setText(this._actionButton, 'Невозможно купить');
			} else if (state.stateIsNull) {
				this.setDisabled(this._actionButton, true);
				this.setText(this._actionButton, 'Недоступно');
			} else {
				// Если товар в корзине
				this.setText(this._actionButton, state.inBasket ? 'Удалить из корзины' : 'В корзину');
				this.setDisabled(this._actionButton, false); // Разблокируем кнопку, если товар не бесценен
			}
		}
	}
	
	updateButtonState({ inBasket }: { inBasket: boolean; isPriceless: boolean }) {
		if (this._actionButton) {
			this.setText(this._actionButton, inBasket ? 'Убрать из корзины' : 'В корзину');
				this._actionButton.disabled = false;
		}
	}
}

// Класс карты товара в корзине
export class CardBasket extends Card {
	protected _indexElement: HTMLElement;
	protected actions?: ICardActions

	constructor(
		protected _container: HTMLElement,
		protected _actions?: ICardActions) {
		super(_container);

		this._indexElement = ensureElement<HTMLElement>(`.basket__item-index`, _container);
		this._actionButton.addEventListener('click', _actions.onClick);
	}

	set index(value: number) {
		this.setText(this._indexElement, value);
	}
}