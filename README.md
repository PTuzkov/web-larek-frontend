# "Веб-ларек"

**Стек технологий**: HTML, SCSS, TypeScript, Webpack

**Описание**: "Веб-ларек" — это веб-приложение для онлайн-покупок с каталогом товаров, корзиной, модальными окнами и оформлением заказа. Проект построен по архитектуре MVP (Model-View-Presenter), обеспечивая модульность и простоту масштабирования.

## Структура проекта

- `src/` — исходные файлы проекта
- `src/components/` — TypeScript-компоненты
- `src/components/base/` — базовые утилиты и классы
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

## Архитектура приложения

Приложение построено по парадигме **MVP**:

- **Model**: Хранит данные (товары, корзина, заказы) и управляет их изменениями.
- **View**: Отвечает за отображение данных в интерфейсе.
- **Presenter**: Координирует взаимодействие между Model и View через события.

**Особенности**:
- Используется брокер событий (`EventEmitter`) для передачи сообщений между слоями.
- Все компоненты интерфейса наследуются от абстрактного класса `Component`.
- Данные заказа и контактов объединены в единый класс `OrderModel` для упрощения структуры.

## Типы данных

### Главная страница

```typescript
export interface ICatalogPage {
	total: number;
	items: IItemData[];
}
```

### Товар

```typescript
export interface IItemData {
	id: string;
	category: string;
	name: string;
	description: string;
	image: string;
	price: number | null;
}
```

### Корзина

```typescript
export interface ICartData {
	items: IItemData[];
	addItem(item: IItemData): void;
	removeItem(itemId: string): void;
	clear(): void;
	getTotalPrice(): number;
	hasItem(id: string): boolean;
}
```

### Заказ

```typescript
export interface IOrderData {
	payment: string;
	address: string;
	email: string;
	phone: string;
	total: number;
	items: string[];
}
```

### Ответ сервера

```typescript
export interface IOrderResponse {
	id: string;
	total: number;
}
```

### Типы данных для модальных окон
```typescript
export interface IModalData {
	content: HTMLElement;
}
```

### Интерфейс API-клиента
```typescript
export interface IShopApi {
	getItems(): Promise<ICatalogPage>;
	submitOrder(data: IOrderData): Promise<IOrderResponse>;
}
```

### Ошибки формы
```typescript
export type FormErrors = Partial<Record<keyof IOrderData, string>>;
```


## Интерфейсы компонентов

### `ICartView`
> Для отображения корзины.

```typescript
export interface ICartView {
  items: IItemData[];
  total: number;
  render(data: Partial<ICartData>): HTMLElement;
}
```

---

### `IOrderForm`
> Для формы заказа и контактов.

```typescript
export interface IOrderForm {
  payment: string;
  address: string;
  phone: string;
  email: string;
  valid: boolean;
  errors: string;
  render(data: Partial<IOrderData>): HTMLElement;
}
```

---

### `ISuccessView`
> Для окна успешного заказа.

```typescript
export interface ISuccessView {
  total: number;
  render(data: { total: number }): HTMLElement;
}
```

---

### `IModal`
> Для модального окна.

```typescript
export interface IModal {
  content: HTMLElement;
  open(): void;
  close(): void;
  render(data: Partial<IModalData>): HTMLElement;
}
```

---

### `IHomePage`
> Для главной страницы.

```typescript
export interface IHomePage {
  items: IItemData[];
  counter: number;
  render(data: Partial<ICatalogPage>): HTMLElement;
}
```

---

## Интерфейсы базовых классов

### `IEvents`
> Для брокера событий (EventEmitter).

```typescript
export interface IEvents {
  on<T extends object>(event: EventName, callback: (data: T) => void): void;
  emit<T extends object>(event: string, data?: T): void;
  trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
  onAll(callback: (event: EmitterEvent) => void): void;
  off(event: EventName, callback: Subscriber): void;
  offAll(): void;
}
```

---

### `IComponent<T>`
> Для базового класса компонентов (Component).

```typescript
export interface IComponent<T> {
  toggleClass(element: HTMLElement, className: string, force?: boolean): void;
  setText(element: HTMLElement, value: unknown): void;
  setDisabled(element: HTMLElement, state: boolean): void;
  setHidden(element: HTMLElement): void;
  setVisible(element: HTMLElement): void;
  setImage(element: HTMLImageElement, src: string, alt?: string): void;
  render(data?: Partial<T>): HTMLElement;
}
```

---

### `IModel<T>`
> Для базового класса моделей (Model).

```typescript
export interface IModel<T> {
  emitChanges(event: string, data?: Partial<T>): void;
}
```


### Перечисления событий
```typescript
export enum ModelEvents {
	ItemsLoaded = 'items:loaded',
	CartUpdated = 'cart:updated',
	OrderChanged = 'order:changed',
	OrderValid = 'order:valid'
}

export enum ViewEvents {
	ItemSelect = 'item:select',
	ItemAdd = 'item:add',
	CartOpen = 'cart:open',
	OrderOpen = 'order:open',
	OrderSubmit = 'order:submit',
	ModalOpen = 'modal:open',
	ModalClose = 'modal:close'
}
```

## Базовый код

### Класс `Api`

Базовый класс для отправки HTTP-запросов.

**Свойства**:
- `protected baseUrl: string` — Базовый URL сервера
- `protected options: RequestInit` — Параметры запросов

**Конструктор**:
```typescript
constructor(baseUrl: string, options?: RequestInit)
```

**Методы**:
```typescript
get(endpoint: string): Promise<object> // Выполняет GET-запрос
post(endpoint: string, data: object, method?: string): Promise<object> // Выполняет POST-запрос
```

### Класс `EventEmitter`

Реализует брокер событий для передачи сообщений. Название отражает его роль как эмиттера событий, стандартное для стартер-кита.

**Интерфейс**:
```typescript
interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```

**Свойства**:
- `_events: Map<EventName, Set<Subscriber>>` — Хранилище подписчиков

**Конструктор**:
```typescript
constructor()
```

**Методы**:
```typescript
on<T extends object>(eventName: EventName, callback: (event: T) => void): void // Подписаться на событие
off(eventName: EventName, callback: Subscriber): void // Отписаться от события
emit<T extends object>(eventName: string, data?: T): void // Инициировать событие
onAll(callback: (event: EmitterEvent) => void): void // Слушать все события
offAll(): void // Сбросить все обработчики
trigger<T extends object>(eventName: string, context?: Partial<T>): (data: T) => void // Создать триггер события
```

### Класс `Component<T>`

Абстрактный базовый класс для компонентов интерфейса.

**Свойства**:
- `protected readonly container: HTMLElement` — Корневой DOM-элемент

**Конструктор**:
```typescript
protected constructor(container: HTMLElement)
```

**Методы**:
```typescript
toggleClass(element: HTMLElement, className: string, force?: boolean): void // Переключить класс
protected setText(element: HTMLElement, value: unknown): void // Установить текст
setDisabled(element: HTMLElement, state: boolean): void // Изменить статус блокировки
protected setHidden(element: HTMLElement): void // Скрыть элемент
protected setVisible(element: HTMLElement): void // Показать элемент
protected setImage(element: HTMLImageElement, src: string, alt?: string): void // Установить изображение
render(data?: Partial<T>): HTMLElement // Вернуть DOM-элемент
```

### Класс `Model<T>`

Абстрактный базовый класс для моделей данных.

**Свойства**:
- `protected events: IEvents` — Брокер событий

**Конструктор**:
```typescript
constructor(events: IEvents)
```

**Методы**:
```typescript
emitChanges(event: string, data?: Partial<T>): void // Инициировать событие изменения данных
```

## Слой данных (Model)

### Класс `CatalogModel`

Реализует интерфейс `ICatalogPage`. Хранит список товаров.

**Свойства**:
- `protected total: number` — Общее количество товаров
- `protected items: IItemData[]` — Список товаров
- `protected events: IEvents` — Брокер событий
- `protected preview: string | null` — ID товара для предпросмотра

**Конструктор**:
```typescript
constructor(events: IEvents)
```

**Методы**:
```typescript
setItems(items: IItemData[]): void // Установить список товаров
getItem(itemId: string): IItemData // Получить товар по ID
setPreview(itemId: string | null): void // Установить ID для предпросмотра
```

### Класс `CartModel`

Реализует интерфейс `ICartData`. Управляет корзиной. `ICartData` описывает данные корзины (от англ. *cart* — корзина).

**Свойства**:
- `protected items: IItemData[]` — Товары в корзине
- `protected events: IEvents` — Брокер событий

**Конструктор**:
```typescript
constructor(events: IEvents)
```

**Методы**:
```typescript
addItem(item: IItemData): void // Добавить товар
removeItem(itemId: string): void // Удалить товар
clear(): void // Очистить корзину
getTotalPrice(): number // Подсчитать общую стоимость
hasItem(id: string): boolean // Проверить наличие товара
```

### Класс `OrderModel`

Хранит данные заказа и контактов, включая валидацию.

**Свойства**:
- `protected payment: string` — Способ оплаты
- `protected address: string` — Адрес доставки
- `protected phone: string` — Телефон
- `protected email: string` — Email
- `protected total: number` — Общая сумма
- `protected items: string[]` — Список ID товаров
- `protected events: IEvents` — Брокер событий

**Конструктор**:
```typescript
constructor(events: IEvents)
```

**Методы**:
```typescript
setPayment(method: string): void // Установить способ оплаты
setAddress(address: string): void // Установить адрес
setPhone(phone: string): void // Установить телефон
setEmail(email: string): void // Установить email
setItems(items: string[]): void // Установить список ID товаров
setTotal(total: number): void // Установить общую сумму
validate(): boolean // Проверить валидность данных
getOrderData(): IOrderData // Получить данные заказа
```

## Слой интерфейса (View)

### Класс `Modal`

Управляет единым модальным окном для всех типов контента.

**Свойства**:
- `protected container: HTMLElement` — Корневой элемент модалки
- `protected closeBtn: HTMLButtonElement` — Кнопка закрытия
- `protected contentArea: HTMLElement` — Контейнер для контента
- `protected events: IEvents` — Брокер событий

**Конструктор**:
```typescript
constructor(container: HTMLElement, events: IEvents)
```

**Методы**:
```typescript
set content(value: HTMLElement): void // Установить содержимое модалки
open(): void // Открыть модалку
close(): void // Закрыть модалку
render(data: Partial<IModalData>): HTMLElement // Отрисовать модалку
```

### Класс `ItemCard`

Отображает карточку товара (喧噪

**Свойства**:
- `protected container: HTMLElement` — Корневой элемент
- `protected title: HTMLElement` — Элемент названия
- `protected price: HTMLElement` — Элемент цены
- `protected image: HTMLImageElement` — Изображение
- `protected category: HTMLElement` — Категория
- `protected description: HTMLElement` — Описание
- `protected button: HTMLButtonElement` — Кнопка действия
- `protected events: IEvents` — Брокер событий

**Конструктор**:
```typescript
constructor(container: HTMLElement, events: IEvents)
```

**Методы**:
```typescript
set id(value: string): void // Установить ID
set title(value: string): void // Установить название
set price(value: number): void // Установить цену
set image(src: string): void // Установить изображение
set category(value: string): void // Установить категорию
set description(value: string): void // Установить описание
render(data: Partial<IItemData>): HTMLElement // Отрисовать карточку
```

### Класс `CartView`

Отображает содержимое корзины.

**Свойства**:
- `protected container: HTMLElement` — Корневой элемент
- `protected items: HTMLElement` — Контейнер для товаров
- `protected total: HTMLElement` — Элемент общей суммы
- `protected button: HTMLButtonElement` — Кнопка оформления
- `protected events: IEvents` — Брокер событий

**Конструктор**:
```typescript
constructor(container: HTMLElement, events: IEvents)
```

**Методы**:
```typescript
set items(items: IItemData[]): void // Установить товары
set total(value: number): void // Установить общую сумму
render(data: Partial<ICartData>): HTMLElement // Отрисовать корзину
```

### Класс `OrderForm`

Обрабатывает форму заказа и контактов.

**Свойства**:
- `protected container: HTMLFormElement` — Форма
- `protected submitBtn: HTMLButtonElement` — Кнопка отправки
- `protected errors: HTMLElement` — Элемент для ошибок
- `protected events: IEvents` — Брокер событий

**Конструктор**:
```typescript
constructor(container: HTMLFormElement, events: IEvents)
```

**Методы**:
```typescript
set payment(value: string): void // Установить способ оплаты
set address(value: string): void // Установить адрес
set phone(value: string): void // Установить телефон
set email(value: string): void // Установить email
set valid(state: boolean): void // Установить состояние валидности
set errors(message: string): void // Показать ошибки
render(data: Partial<IOrderData>): HTMLElement // Отрисовать форму
```

### Класс `SuccessView`

Показывает модальное окно успешного заказа.

**Свойства**:
- `protected container: HTMLElement` — Корневой элемент
- `protected total: HTMLElement` — Элемент с итоговой суммой
- `protected button: HTMLButtonElement` — Кнопка закрытия
- `protected events: IEvents` — Брокер событий

**Конструктор**:
```typescript
constructor(container: HTMLElement, events: IEvents)
```

**Методы**:
```typescript
set total(value: number): void // Установить итоговую сумму
render(data: { total: number }): HTMLElement // Отрисовать окно
```

### Класс `CatalogView`

Отображает каталог товаров на главной странице.

**Свойства**:
- `protected container: HTMLElement` — Корневой элемент
- `protected items: HTMLElement` — Контейнер для товаров
- `protected events: IEvents` — Брокер событий

**Конструктор**:
```typescript
constructor(container: HTMLElement, events: IEvents)
```

**Методы**:
```typescript
set items(items: IItemData[]): void // Установить товары
render(data: Partial<ICatalogPage>): HTMLElement // Отрисовать каталог
```

### Класс `HomePage`

Управляет главной страницей сайта.

**Свойства**:
- `protected container: HTMLElement` — Корневой элемент
- `protected counter: HTMLElement` — Счетчик корзины
- `protected catalog: HTMLElement` — Контейнер каталога
- `protected events: IEvents` — Брокер событий

**Конструктор**:
```typescript
constructor(container: HTMLElement, events: IEvents)
```

**Методы**:
```typescript
set items(items: IItemData[]): void // Установить товары
set counter(count: number): void // Обновить счетчик корзины
render(data: Partial<ICatalogPage>): HTMLElement // Отрисовать страницу
```

## Презентер

### Логика взаимодействия

Координация между слоями происходит в файле `index.ts`.

**Процесс**:
1. При загрузке страницы запрашивается список товаров с сервера.
2. Каталог отображается на главной странице.
3. Клик по товару открывает модальное окно с подробным описанием товара.
4. Добавление товара в корзину обновляет счетчик и содержимое корзины.
5. При оформлении заказа открываются формы оплаты и контактов.
6. После успешной отправки заказа показывается модальное окно успеха, корзина очищается.

### События

#### События слоя Model:
- `items:loaded` — Загрузка товаров с сервера.
- `cart:updated` — Изменение содержимого корзины.
- `order:changed` — Изменение данных заказа.
- `order:valid` — Обновление состояния валидности заказа.

#### События слоя View:
- `item:select` — Выбор товара для просмотра.
- `item:add` — Добавление товара в корзину.
- `cart:open` — Открытие корзины.
- `order:open` — Открытие формы заказа.
- `order:submit` — Отправка заказа.
- `modal:open` — Открытие модального окна.
- `modal:close` — Закрытие модального окна.

## Сервисы

### Класс `ShopApi`

Расширяет `Api` для работы с сервером.

**Конструктор**:
```typescript
constructor(cdn: string, baseUrl: string, options?: RequestInit)
```

**Методы**:
```typescript
getItems(): Promise<IItemData[]> // Получить список товаров
submitOrder(data: IOrderData): Promise<OrderResponse> // Отправить заказ на сервер
```