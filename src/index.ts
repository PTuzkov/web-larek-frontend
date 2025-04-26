import './scss/styles.scss';
import { WebLarekApi } from './components/base/WebLarekApi';
import { EventEmitter } from './components/base/events';
import { ProductsData } from './components/model/MainPageData';
import { Cart } from './components/common/Cart';
import { ContactsUser } from './components/common/ContactsUser';
import { MainPage } from './components/common/MainPage';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ProductModal } from './components/common/ProductModal';
import { ProductView } from './components/common/ProductView';
import { Success } from './components/common/Success';
import { CartProductsData } from './components/model/CartProductsData';
import { IItemData, OrderMethodPay, OrderContact } from './types';
import { Modal } from './components/common//Modal';
import { cartItems } from './components/common/CartProducts';
import { UserData } from './components/model/UserData';
import { OrderData } from './components/model/OrderData';

const productCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const productModal = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const itemCart = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const eventEmitter = new EventEmitter();
const productsData = new ProductsData(eventEmitter);
const page = new MainPage(document.querySelector('.page'), eventEmitter);
const basket = new Cart(cloneTemplate(basketTemplate), eventEmitter);
const basketProductsData = new CartProductsData(eventEmitter);
const productModalData = new ProductModal(
	cloneTemplate(productModal),
	eventEmitter
);
const userData = new UserData(eventEmitter);
const order = new OrderData(cloneTemplate(orderTemplate), eventEmitter);
const contacts = new ContactsUser(
	cloneTemplate(contactsTemplate),
	eventEmitter
);
const modal = new Modal(
	ensureElement<HTMLElement>('#modal-container'),
	eventEmitter
);

const success = new Success(cloneTemplate(successTemplate), eventEmitter);

eventEmitter.on('products:set', () => {
	const productsArray = productsData.pageStore.map((pageStoreItem) =>
		new ProductView(cloneTemplate(productCatalog), eventEmitter).render(
			pageStoreItem
		)
	);

	page.render({
		products: productsArray,
	});
});

eventEmitter.on('product:select', (data: { id: string }) => {
	const preview = productsData.getProduct(data.id);
	eventEmitter.emit('product:selected', preview);
});

eventEmitter.on('product:selected', (preview: IItemData) => {
	console.log('select');

	const previewElement = productModalData.render({
		...preview,
		inCart: basketProductsData.cartHasItem(preview.id),
	});

	modal.render({ content: previewElement });
});

eventEmitter.on('product:buy', (data: { id: string }) => {
	const product = productsData.getProduct(data.id);

	basketProductsData.cartAddItem(product);
	modal.closeModal();
});

eventEmitter.on('basket:changed', () => {
	const productsinCartArray = basketProductsData.cartItems.map((product) =>
		new cartItems(cloneTemplate(itemCart), eventEmitter).render(product)
	);

	basket.render({
		products: productsinCartArray,
		total: basketProductsData.cartGetTotalPrice(),
		index: productsinCartArray,
		isEmpty: basketProductsData.isEmptyBasket(),
	});
	page.render({ counter: basketProductsData.getNumber() });
});

eventEmitter.on('basket:open', () => {
	modal.render({
		content: basket.render({
			isEmpty: basketProductsData.isEmptyBasket(),
		}),
	});
});

eventEmitter.on('basketProduct:delete', (data: { id: string }) => {
	basketProductsData.cartRemoveItem(data.id);
});

eventEmitter.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

eventEmitter.on(
	/^order\..*:change/,
	(data: { field: keyof OrderMethodPay; value: string }) => {
		userData.setOrderField(data.field, data.value);
	}
);

eventEmitter.on('orderForm:change', (errors: Partial<OrderMethodPay>) => {
	const { address, payment } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

eventEmitter.on('contacts:change', (errors: Partial<OrderContact>) => {
	const { email, phone } = errors;
	contacts.valid = !phone && !email;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

eventEmitter.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			contactsPhone: '',
			contactsEmail: '',
			valid: false,
			errors: [],
		}),
	});
});

eventEmitter.on(
	/^contacts\..*:change/,
	(data: { field: keyof OrderContact; value: string }) => {
		userData.setContactsField(data.field, data.value);
	}
);

eventEmitter.on('contacts:change', (errors: Partial<OrderContact>) => {
	const { email, phone } = errors;
	contacts.valid = !phone && !email;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

eventEmitter.on('contacts:submit', () => {
	(async () => {
		try {
			const order = await WebLarekApi.placeOrder({
				...userData.clientData,
				items: basketProductsData.cartItems
					.map((product) => product?.id)
					.filter((id): id is string => typeof id === 'string'),
				total: basketProductsData.cartGetTotalPrice(),
			});
			basketProductsData.cartClear();
			modal.render({
				content: success.render({
					total: order.total,
				}),
			});
		} catch (error) {
			console.log(error);
		}
	})();
});

eventEmitter.on('success:submit', () => {
	modal.closeModal();
});

eventEmitter.on('modal:open', () => {
	page.lock = true;
});

eventEmitter.on('modal:close', () => {
	page.lock = false;
});

(async () => {
	try {
		const data = await WebLarekApi.getProducts();
		console.log(data);

		productsData.pageStore = data;
	} catch (error) {
		console.log(error);
	}
})();
