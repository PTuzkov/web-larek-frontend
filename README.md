# Проектная работа "Веб-ларек"

**Стек технологий**: HTML, SCSS, TypeScript, Webpack

**Описание**: Веб-ларек — это веб-приложение для онлайн-покупок с каталогом товаров, корзиной, модальными окнами 
и оформлением заказа. Проект построен по архитектуре MVP (Model-View-Presenter) для обеспечения модульности 
и удобства масштабирования.

## Структура проекта

- `src/` — исходные файлы проекта
- `src/components/` — компоненты TypeScript
- `src/components/core/` — базовые утилиты и классы
- `src/pages/index.html` — HTML-файл главной страницы
- `src/types/index.ts` — интерфейсы и типы
- `src/index.ts` — точка входа приложения
- `src/styles/main.scss` — основной файл стилей
- `src/utils/config.ts` — конфигурации и константы
- `src/utils/helpers.ts` — вспомогательные функции

## Установка и запуск

Для установки зависимостей и запуска проекта:

```bash
npm install
npm run dev
```

Или с использованием Yarn:

```bash
yarn
yarn dev
```

Для сборки продакшн-версии:

```bash
npm run build
```

или

```bash
yarn build
```

---

# Документация "Веб-ларек"

## Типы данных

### Главная страница

```typescript
export interface ICatalogPage {
	items: ItemData[];
	getItem(id: string): ItemData;
}
```

### Товар

```typescript
export interface ItemData {
	id: string;
	type: string;
	name: string;
	details: string;
	thumbnail: string;
	price: number;
}
```

### Корзина

```typescript
export interface ICartData {
	cartItems: ItemData[];
	cartGetItems: ItemData[];
	addItem(item: ItemData): void;
	removeItem(itemId: string): void;
	clearCart(): void;
	getTotalPrice(cartSumPrice: number): number;
	inCart(id: string): boolean;
}
```

### Пользователь

```typescript
export interface ICustomerData {
	paymentInfo: PaymentDetails & ContactInfo;
}
```

### Контакты

```typescript
export interface IContactInfo {
	phone: string;
	email: string;
	isValid: boolean;
}
```

---

## Архитектура приложения

Приложение разделено на три слоя по парадигме MVP:

- **Слой данных (Model)**: Хранит и обрабатывает данные (товары, корзина, заказы).
- **Слой интерфейса (View)**: Отвечает за визуальное отображение данных.
- **Координатор (Presenter)**: Связывает данные и интерфейс, управляя событиями.

---

## Базовые компоненты

### Класс `ApiCore`

Базовый класс для работы с сервером.  
**Конструктор**: Принимает базовый URL сервера и необязательный объект с заголовками.

**Методы**:
- `fetchGet(endpoint: string)`: Выполняет GET-запрос и возвращает промис с данными.
- `fetchPost(endpoint: string, data: object, method?: string)`: Отправляет POST-запрос (или другой метод) 
- с данными в формате JSON.

### Класс `EventBus`

Реализует брокер событий для обработки и передачи событий в приложении.  
**Интерфейс** `IEventBus`:

- `subscribe(event: string, callback: Function)`: Подписка на событие.
- `unsubscribe(event: string, callback: Function)`: Отписка от события.
- `trigger(event: string, data?: any)`: Запуск события с данными.

---

## Слой данных

### Класс `CatalogData`

Реализует интерфейс `ICatalogPage`. Хранит список товаров и позволяет получать товар по ID.  
**Поля**:
- `items: ItemData[]`
- `events: IEventBus`

**Методы**:
- `setItems(items: ItemData[])`: Устанавливает список товаров.
- `getItem(itemId: string)`: Возвращает товар по ID.

### Класс `CartData`

Реализует интерфейс `ICartData`. Управляет товарами в корзине.  
**Поля**:
- `cartItems: ItemData[]`

**Методы**:
- `addItem(item: ItemData)`: Добавляет товар в корзину.
- `removeItem(itemId: string)`: Удаляет товар.
- `clearCart()`: Очищает корзину.
- `getTotalPrice()`: Возвращает общую стоимость.
- `hasItem(id: string)`: Проверяет наличие товара.

### Класс `OrderInfo`

Хранит данные заказа (способ оплаты, адрес).  
**Конструктор**: `constructor(form: HTMLFormElement, events: IEventBus)`

**Поля**:
- `paymentMethod: string`
- `address: string`
- `isValid: boolean`

### Класс `ContactDetails`

Хранит контактные данные пользователя.  
**Поля**:
- `phone: string`
- `email: string`
- `isValid: boolean`

---

## Слой интерфейса

### Класс `Component`

Базовый класс для всех компонентов интерфейса.  
**Конструктор**: `constructor(protected container: HTMLElement)`

**Методы**:
- `addClass(className: string)`: Добавляет CSS-класс.
- `setEnabled(state: boolean)`: Изменяет состояние блокировки.
- `setContent(element: HTMLElement, content: string)`: Устанавливает текст.
- `hide()`: Скрывает элемент.
- `show()`: Показывает элемент.
- `setImage(src: string)`: Устанавливает изображение.

### Класс `Popup`

Управляет модальными окнами.  
**Поля**:
- `closeBtn: HTMLButtonElement`
- `contentArea: HTMLElement`

**Методы**:
- `open()`: Открывает попап.
- `close()`: Закрывает попап (по клику, кнопке или Esc).
- `render(data: IPopupData)`: Отрисовывает содержимое.

### Класс `ItemCard`

Отображает карточку товара.  
**Поля**:
- `name: HTMLElement`
- `price: HTMLElement`
- `btn: HTMLButtonElement`

**Методы**:
- `setName(value: string)`: Устанавливает название.
- `setPrice(value: number)`: Устанавливает цену.
- `addClickListener()`: Добавляет обработчик клика.

### Класс `CartItem`

Отображает товар в корзине.  
**Методы**:
- `renderItem(item: ItemData)`: Отрисовывает товар.
- `removeItem()`: Удаляет товар из корзины.

### Класс `CheckoutForm`

Обрабатывает формы заказа и контактов.  
**Поля**:
- `submitBtn: HTMLButtonElement`
- `errorField: HTMLElement`

**Методы**:
- `setValid(state: boolean)`: Управляет активностью кнопки.
- `setError(message: string)`: Отображает ошибку.
- `onChange(field: string, value: string)`: Обрабатывает ввод данных.

### Класс `SuccessPopup`

Отображает модальное окно успешного заказа.  
**Поля**:
- `totalPrice: HTMLElement`

**Методы**:
- `setTotal(value: number)`: Устанавливает итоговую сумму.

### Класс `CatalogView`

Отображает каталог товаров.  
**Методы**:
- `renderItems(items: ItemData[])`: Отрисовывает товары.
- `setCategory(value: string)`: Устанавливает категорию.

### Класс `HomePage`

Управляет главной страницей.  
**Поля**:
- `cartCounter: HTMLElement`
- `catalogContainer: HTMLElement`

**Методы**:
- `setItems(items: ItemData[])`: Устанавливает товары.
- `updateCartCount(count: number)`: Обновляет счетчик корзины.

---

## Презентер

### Логика взаимодействия

Координация между слоями происходит в файле `index.ts`.  
**Процесс**:
1. При загрузке страницы запрашивается список товаров с сервера.
2. Каталог отображается на главной странице.
3. Клик по товару открывает попап с деталями.
4. Добавление товара в корзину обновляет счетчик и содержимое корзины.
5. При оформлении заказа открываются формы оплаты и контактов.
6. После успешной отправки заказа показывается попап успеха, корзина очищается.

### События

- `cart:updated`: Изменение корзины.
- `cart:open`: Открытие корзины.
- `items:loaded`: Загрузка товаров.
- `form:changed`: Изменение данных формы.
- `popup:open/close`: Открытие/закрытие попапа.
- `order:submit`: Отправка заказа.
- `item:add`: Добавление товара в корзину.

---

## API

### Класс `ShopApi`

Расширяет `ApiCore` для работы с сервером.  
**Конструктор**: `constructor(cdn: string, baseUrl: string, options?: RequestInit)`

**Методы**:
- `fetchItem(id: string)`: Получает данные товара по ID.
- `fetchItems()`: Получает список товаров.
- `submitOrder(data: IOrderInfo)`: Отправляет заказ на сервер。