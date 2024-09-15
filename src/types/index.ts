import { IEvents } from '../components/base/events';

//Общие данные о приложении
export interface IAppData {
    catalog: IProduct[];
    basket: IProduct[];
    order: IUser;
    events: IEvents;
    formError: TFormError;
}

// Карточка товара
export interface IProduct {
	getStateIsNull: boolean;
    id: string;
    category: string;
    title: string;
    image: string;
    description: string;
    price: number | null;
    index?: number;
}

// Категории товара
export enum EProductCategory {
	'софт-скил' = 'soft',
	'хард-скил' = 'hard',
	'другое' = 'other',
	'дополнительное' = 'additional',
	'кнопка' = 'button'
}

// Данные пользователя/покупателя
export interface IUser {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

// Данные для отправки заказа на сервер
export interface IShoppingPost extends IUser{
    total: number;
    items: string[];
}

//Форма оплаты и адреса
export type TOrder =  Pick<IUser, 'payment' | 'address'>;

//Форма контактных данных пользователя
export type TBuyerInfo =  Pick<IUser, 'email' | 'phone'>;

//Форма корзины
export type TBasket = Pick<IProduct, 'title' | 'price'>;

//Текстовые ошибки форм
export type TFormError = Partial<IUser>;

//Форма успешной оплаты
export interface ISuccessfulOrder {
    id: string;
    total: number;
}


