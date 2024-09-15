import { Form } from '../general/form';
import { TBuyerInfo } from '../../types';
import { IEvents } from '../base/events';

export class ContactsForm extends Form<TBuyerInfo> {
  protected _email: HTMLInputElement;
  protected _phone: HTMLInputElement;
  
	constructor(
    container: HTMLFormElement,
    events: IEvents) {
		super(container, events);
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value = value;
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
	}
}