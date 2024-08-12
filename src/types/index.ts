// Карточка товара
export interface IProduct {
    id: string;
    category: string;
    title: string;
    image: string;
    description: string;
    price: number | null;
    //index?: number;
}
// Данные пользователя/покупателя
export interface IUser {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

//Форма оплаты и адреса
export type TOrder =  Pick<IUser, 'payment' | 'address'>;

//Форма контактных данных пользователя
export type TBuyerInfo =  Pick<IUser, 'email' | 'phone'>;

//Форма корзины
export type TBasket = Pick<IProduct, 'title' | 'price'>;

//Форма успешной оплаты
export interface ISuccessfulOrder {
    id: string;
    total: number;
}

// Интерфейс по работе с карточками товаров
export interface IProductCardData {
    items: IProduct[];
    preview: string | null;
    addCardProduct(card:IProduct):void;
    deleteCardProduct(cardId: string, payload: Function | null): void;
    updateCardProduct(card: IProduct, payload: Function | null): void;
    getCardProduct(cardId: string): IProduct;
    checkProductValidation(data: Record<keyof IProduct, string>): boolean;
}
// Интерфейс по работе с данными пользователя
export interface IUserData {
    getUserInfo(): IUser;
    setUserInfo(userData:IUser): void;
    checkUserValidation(data: Record<keyof IUser, string>): boolean;
}