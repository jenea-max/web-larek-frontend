export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {
	}

	// Переключение класса
	toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

  // Скрытие элемента
	protected setHidden(element: HTMLElement) {
		element.style.display = 'none';
	}

	// Показ элемента
	protected setVisible(element: HTMLElement) {
		element.style.removeProperty('display');
	}

	// Установка текстового содержимого для элемента
	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

  // Установка изображения с алтернативным текстом для элемента
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	// Смена статуса блокировки
	setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

	//Вернуть корневой DOM-элемент и обновить свойства класса
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}