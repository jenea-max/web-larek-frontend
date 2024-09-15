import { IProduct, IShoppingPost, TFormError, EProductCategory, IAppData} from '../types';
import { Model } from '../components/base/model';

export class ProductCardData extends Model<IProduct> {
  id: string;
  category: EProductCategory;
  title: string;
  image: string;
  description: string;
  price: number | null;
	buttonState: { stateIsNull: boolean; stateInBasket: boolean };
	index: number;

	getStateIsNull() {
		return this.price === null;
	}
};

export class AppState extends Model<IAppData> {

  catalog: IProduct[] = [];
  basket: IProduct[] = [];
  order: IShoppingPost = {
    payment: '',
    address: '',
    email: '',
    phone: '',
    total: null,
		items: []
  };
  formErrors: TFormError = {};
  formType: 'order' | 'contacts';
  preview: string | null;

  updateCatalog(items: IProduct[]) {
    this.catalog = items;
    this.emitChanges('items:changed', { catalog: this.catalog });
  };

  // Добавить продукт в корзину
  addInBasket(item: IProduct): boolean {
    this.basket.push(item);
    console.log('Текущая корзина:', this.basket);
    this.emitChanges('basket:changed', this.basket);
    return true;
  };

  // Удалить продукт из корзины
  removeFromBasket(item: IProduct) {
    this.basket = this.basket.filter((basketItem) => basketItem.id !== item.id);
    this.emitChanges('basket:changed', this.basket);
  };

  // Проверка на наличие в корзине товара
  isInBasket(item: IProduct) {
    return this.basket.findIndex(basketItem => basketItem.id === item.id)!== -1;
  };

  //Получить число продуктов в корзине
  getBasketSize(): number {
    return this.basket.length;
  };
  
  // Получить общую стоимость корзины
  getTotalBasket(): number {
    return this.basket.reduce((total, item) => {
      return total + (item.price || 0)
    }, 0);
  };
  
  // Получить массив id всех продуктов в корзине
  getBasketId(){
    return this.basket.map((item) => item.id)
  };

  // Очистить корзину товаров
  emptyBasket() {
    this.basket = [];
    this.emitChanges('basket:changed', this.basket);
  };

  // Очистить заказ
  emptyOrder() {
		this.order = {
			payment: '',
      address: '',
      email: '',
      phone: '',
      total: null,
		  items: []
		}
	};

  setOrderField<K extends keyof IShoppingPost>(field: K, value: IShoppingPost[K])  {
    this.order[field] = value;
    if (field === 'address' || field === 'payment'){
      this.orderErrors();
    }
    if (field === 'phone' || field === 'email'){
      this.contactErrors();
    }
  };

  orderErrors() {
    const errorMessage: TFormError = {};

    if (!this.order.address) {
      errorMessage.address = 'Адрес обязателен для заполнения';
    }
    if (!this.order.payment) {
      errorMessage.payment = 'Необходимо выбрать способ оплаты';
    }

    this.formErrors = errorMessage;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errorMessage).length === 0;
    };

  contactErrors() {
    const errorMessage: TFormError = {};
    const isEmailValid = (email: string): boolean => {
      const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      return emailPattern.test(email);
    };

    const isPhoneValid = (phone: string): boolean => {
      const phonePattern = /^\+?[1-9]\d{1,14}$/;
      return phonePattern.test(phone);
    };

    if (!this.order.phone) {
      errorMessage.phone = 'Введите номер телефона';
    } else if (!isPhoneValid (this.order.phone)) {
      errorMessage.phone = 'Телефон имеет неверный формат';
    }

    if (!this.order.email) {
      errorMessage.email = 'Введите email';
    } else if (!isEmailValid(this.order.email)) {
      errorMessage.email = 'Email неверного формата';
    }

    this.formErrors = errorMessage;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errorMessage).length === 0;
  };

  clearErrors(): void {
    this.formErrors = null;
  };
};