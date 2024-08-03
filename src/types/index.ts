import { IEvents } from '../components/base/events';
// карточка товара
interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number
    index?: number;
}

// массив карточек на главной странице
interface IProductsList {
    items: IProduct[];
    preview: string | null;
}

// информация о товарах в корзине
type IBasket = Pick<IProduct, 'title' | 'price'>;

//форма ввода информации о способе оплаты и адресе 
interface IOrder {
    payment: string;
    address: string;
}

//форма ввода контактных данных пользователя
interface IBuyerInfo {
    email: string;
    phone: string;
}

//общие данные для заказа
type IShoppingInfo = IOrder & IBuyerInfo;

type IShoppingPost = IShoppingInfo & {
    total: number;
    items: string[];
}

//вывод текста ошибок
type IFormError = Partial<IShoppingInfo>;

//валидация форм
interface IOrderData {
    CheckValidation(data: Record<keyof IOrder, string>): boolean;
}

interface IBuyerInfoData {
    CheckValidation(data: Record<keyof IBuyerInfo, string>): boolean;
}

//форма успешной оплаты
interface ISuccessfulOrder {
    id: string;
    total: number;
}

//общие данные о магазине
interface IAppInfo {
    catalog: IProduct[];
    basket: IProduct[];
    order: IShoppingInfo;
    formError: IFormError;
    events: IEvents;
}