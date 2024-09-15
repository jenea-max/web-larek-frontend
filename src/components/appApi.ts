import { Api, ApiListResponse } from './base/api';
import { IProduct, ISuccessfulOrder, IShoppingPost} from '../types';

export class AppApi extends Api {
	protected _cdn: string;

	constructor(cdn: string, baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
		this._cdn = cdn;
	}
  // Получение данных одной карточки продукта
	async getProductItem(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then(
            (item: IProduct) => ({
                ...item,
                image: `${this._cdn}${item.image}`,
            })
        );
    }
  // Получение данных всех карточек
	async getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map(item => ({
				...item,
				image: `${this._cdn}${item.image}`,
			}))
		);
	}
  // Отправление данных заказа на сервер
	async postOrder(orderData: IShoppingPost): Promise<ISuccessfulOrder> {
        return this.post(`/order`, orderData).then((orderResult: ISuccessfulOrder) => orderResult)
	}
}