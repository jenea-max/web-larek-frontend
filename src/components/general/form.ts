import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { IUser } from '../../types';

// Данные формы
interface IFormInfo extends IUser {
  valid: boolean;
  errors: string[];
}

export class Form<T> extends Component<IFormInfo> {
  protected _submitButton: HTMLButtonElement;
  protected _formError: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
  super(container);

  this._submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
  this._formError = ensureElement<HTMLElement>('.form__errors', this.container);
  
  this.container.addEventListener('submit', (evt: Event) => {
    evt.preventDefault();
    this.events.emit(`${this.container.name}:submit`);
  }); 
    
  this.container.addEventListener('input', (evt: Event) => {
      const target = evt.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.onInputChange(field, value);
    });
  }
  
  //Изменение данных
  onInputChange(name: keyof T, value: string) {
      this.events.emit(`${this.container.name}.${String(name)}:change`, {
          field: name,
          value,
      })
  }

  //Установка состояния кнопки
  set valid(value: boolean) {
    this._submitButton.disabled = !value;
  }

  //Установка сообщения об ошибке
  set errors(value: string) {
      this.setText(this._formError, value)
  }

  // Сброс значения всех полей формы
  resetForm(): void {
      this.container.reset();
  }

  // Рендер формы
  render(state: Partial<T> & IFormInfo) {
		const {valid, errors, ...inputs} = state;
		super.render({ valid, errors});
		Object.assign(this, inputs);
		return this.container;
	}
}