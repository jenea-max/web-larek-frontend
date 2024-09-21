import './scss/styles.scss';
import { EventEmitter} from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { AppApi } from './components/appApi';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IUser, IProduct, EProductCategory, TFormError, ISuccessfulOrder } from './types';
import { AppState} from './components/appModelData';
import { Page } from './components/elements.ts/page';
import { Modal } from './components/general/modal';
import { Basket} from './components/elements.ts/basket';
import { OrderForm } from './components/elements.ts/orderForm';
import { ContactsForm } from './components/elements.ts/contactsForm';
import { SuccessfulForm } from './components/elements.ts/success';
import { CardCatalog, CardOpen, CardBasket } from './components/elements.ts/card';

const api = new AppApi(CDN_URL, API_URL);
const events = new EventEmitter();

// Глобальные контейнеры
const pageElement = new Page(document.body, events);;
const modalElement = ensureElement<HTMLElement>('#modal-container');

const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных приложения
const appState = new AppState({}, events);

// Экземпляры классов
const modal = new Modal (modalElement, events);
const basketView = new Basket(cloneTemplate(basketTemplate), events);

const orderView = new OrderForm(cloneTemplate(orderFormTemplate), events);
const contactsView = new ContactsForm(cloneTemplate(contactsFormTemplate), events);
const successView = new SuccessfulForm(cloneTemplate(successTemplate), events);

// Получаем товары с сервера
api.getProductList()
	.then((result) => {
		appState.updateCatalog(result);
	})
	.catch((err) => {
		console.error(err);
	});

// Изменились элементы каталога
events.on('items:changed', () => {
	pageElement.catalog = appState.catalog.map((item) => {
		const product = new CardCatalog(cloneTemplate(catalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return product.render({
			title: item.title,
			price: item.price,
			image: item.image,
			category: item.category as EProductCategory,
		});
	});
  pageElement.counter = appState.basket.length;
});

// Открыть товар
events.on('card:select', (item: IProduct) => {
	const card = new CardOpen (cloneTemplate(cardPreviewTemplate),events, {
		onClick: () => {
			if (item.price === null) {
        return;
      }
			if (!appState.isInBasket(item)) {
        appState.addInBasket(item);
        card.updateButtonState({ inBasket: true, isPriceless: item.price === null });
				modal.close();
      } else {
        appState.removeFromBasket(item);
        card.updateButtonState({ inBasket: false, isPriceless: item.price === null });
      }
      card.inBasket = appState.isInBasket(item);
    }
  });
	
  const isPriceless = item.price === null;
	modal.render({
		content: card.render({
      price: item.price,
			title: item.title,
			description: item.description,
      image: item.image,
			buttonState: {
				stateIsNull: item.getStateIsNull,
				stateInBasket: appState.isInBasket(item),
				isPriceless: isPriceless, 
			},
		}),
	});
	// Устанавливаем правильное состояние кнопки при открытии карточки
  card.buttonState = {
    stateIsNull: item.getStateIsNull,  
    inBasket: appState.isInBasket(item),
		isPriceless: isPriceless,
  };
});

// Добавить товар в корзину
events.on('card:add', (item: IProduct) => {
	appState.addInBasket(item);
});

// Удалить товар из корзины
events.on('product:delete-from-basket', (item: IProduct) => {
	appState.removeFromBasket(item);
	events.emit('basket:changed');
	pageElement.counter = appState.basket.length;
});

//Открыть корзину
events.on('basket:open', () => {
	const items = basketView.items || [];
  const total = basketView.total || 0;
	appState
	modal.render({ 
		content: basketView.render({ items, total }) });
		events.emit('basket:changed');
});

//Изменить данные корзины
events.on('basket:changed', () => {
	pageElement.counter = appState.getBasketSize();
	const items = appState.basket.map((item, index) => {
		const card = new CardBasket (cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('product:delete-from-basket', item);
				events.emit('basket:change');
			},
		});
		return card.render({
			id: item.id,
			index: index + 1,
			title: item.title,
			price: item.price,
		});
	});

	basketView.render({
		items,
		total: appState.getTotalBasket(),
	});
	
});

// Открыть форму ввода адреса и выбора способа оплаты
events.on('order:open', () => modal.render({
	content: orderView.render({
		valid: false,
		errors: [],
		payment: '',
		address: '',
		email: '',
		phone: ''
	}),
}));

// Отправить форму заказа 
events.on('order:submit', () => modal.render({
	content: contactsView.render({
		valid: false,
		errors: [],
		email: '',
		phone: '',
		payment: '',
		address: ''
	}),
}));

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: TFormError) => {
	const { payment, address, email, phone } = errors;
    orderView.valid = !payment && !address;
    contactsView.valid = !email && !phone;
    orderView.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
    contactsView.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

// Открыть форму ввода контактных данных
events.on('contacts:submit', () => {
	api
	.postOrder({
		...appState.order,
		total: appState.getTotalBasket(),
		items: appState.getBasketId(),
	})
		.then((result) => {
			orderView.resetForm();
			contactsView.resetForm();
			events.emit('order:complete',result)
			appState.emptyBasket();
			pageElement.counter = appState.getBasketSize();
		})
		.catch(console.error);
})

// Отправить форму с контактными данными
events.on('order:complete', (res:ISuccessfulOrder) => {modal.render({content: successView.render({total: res.total})})});

// Успешный заказ
events.on('success:finish', () => modal.close());

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	pageElement.wrapperLocked = true;
});

// Разблокируем прокрутку страницы
events.on('modal:close', () => {
	pageElement.wrapperLocked = false;
});

// Изменилось одно из полей
events.on(
	/^(order|contacts)\..*:change/, (data: { field: keyof IUser; value: string }) => {
		appState.setOrderField(data.field, data.value);
	}
);

