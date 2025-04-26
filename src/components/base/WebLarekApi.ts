import { IOrderData, IItemData } from '../../types';
import { Api } from './Api';
import { API_URL, CDN_URL, settings } from '../../utils/constants';

export type OrderResponse = {
	id: string;
	total: number;
};

export type ProductsResponse<T> = {
	total: number;
	items: T[];
};

export class MainApi extends Api {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProduct(id: string): Promise<IItemData> {
		return this.get(`/product/${id}`).then((item: IItemData) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	getProducts(): Promise<IItemData[]> {
		return this.get('/product/').then((data: ProductsResponse<IItemData>) =>
			data.items.map((item: IItemData) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	placeOrder(data: IOrderData): Promise<OrderResponse> {
		return this.post(`/order`, data).then((res: OrderResponse) => res);
	}
}

export const WebLarekApi = new MainApi(CDN_URL, API_URL, settings);
