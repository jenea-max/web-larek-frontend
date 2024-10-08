# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Общие данные о приложении
```
interface IAppData {
    catalog: IProduct[];
    basket: IProduct[];
    order: IUser;
    events: IEvents;
    formError: TFormError;
}
```
Карточка товара
```
interface IProduct {
	getStateIsNull: boolean;
    id: string;
    category: string;
    title: string;
    image: string;
    description: string;
    price: number | null;
    index?: number;
}
```
Данные категории продукта
```
enum EProductCategory {
	'софт-скил' = 'soft',
	'хард-скил' = 'hard',
	'другое' = 'other',
	'дополнительное' = 'additional',
	'кнопка' = 'button'
}
```
Данные пользователя/покупателя
```
interface IUser {
    payment: string;
    address: string;
    email: string;
    phone: string;
}
```
Форма оплаты и адреса
```
type TOrder =  Pick<IUser, 'payment' | 'address'>;
```
Форма контактных данных пользователя
```
type TBuyerInfo =  Pick<IUser, 'email' | 'phone'>;
```
Форма корзины
```
type TBasket = Pick<IProduct, 'title' | 'price'>;
```
Форма успешной оплаты
```
interface ISuccessfulOrder {
    id: string;
    total: number;
}
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, который отвечает за отображение данных на странице 
- слой данных, который отвечает за хранение и изменение данных
- презентер, который отвечает за связь представления и данных

### Базовый код

#### Класс Api

```
export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }
}
```
Содержит в себе базовую логику отправки запросов.

Конструктор:
- `constructor()` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля:
- `baseUrl`: string - базовый адрес сервера
- `options`: RequestInit - объект с заголовками запросов

Методы:
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоину переданных как параметр при вызове метода. По умолчанию выполняется "POST" запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове
- `handleResponse()`- выполняет проверку ответов от сервера.

#### Класс EventEmitter
```
export class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }
}
```
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий. 

Конструктор:
- `constructor()` - выполняет инициализацию объекта, создавая пустую структуру данных для хранения событий

Поля: 
- `events` - используется для хранения информации о событиях и их подписчиках

Методы:
- `on` - установка обработчика на событие
- `off` - снятие обработчика с события
- `emit` - инициализация события с данными
- `trigger` - выполнение коллбек триггера, генерирующего событие при вызове
- `onAll` - слушатель на все события
- `offAll` - сброс всех обработчиков с события

### Слой данных

#### Класс AppState

Класс отвечает за хранение и логику работы с дангными приложения в целом.\

Поля класса содержат:
- `catalog: IProduct[]` - массив карточек товаров
- `basket: IProduct[]` - массив товаров в корзине
- `order: IShoppingPost` - данные о заказе
- `formErrors: TFormError` - информация  об ошибке при заполнении форм
- `formType:'order' | 'contacts' `- тип формы

Методы класса:
- `updateCatalog`- обновление каталога карточек
- `addInBasket` - добавить продукт в корзину
- `removeFromBasket` - удалить продукт из козины
- `isInBasket` - проверка на наличия товара в корзине
- `getBasketSize` - получение общее колличество товаров в корзине
- `getTotalBasket` - получение общей стоимости корзины
- `getBasketId` - получение массива id всех продуктов в корзине
- `emptyBasket` - очистить козрину
- `emptyOrder` - очистить заказ
- `setOrderField` - записать данные пользователя в заказ
- `orderErrors` - валидация данных адресса и способа оплаты заказа
- `contactErrors` - валидация контактных данных пользователя при заказе
- `clearErrors` - очистить ошибки

#### Класс ProductCardData

Класс отвечает за хранение и логику работы с данными продукта карточки.\

В полях класса хранятся следующие данные:
-`id: string;` - id продукта
-`category: EProductCategory;`- категория продукта
-`title: string;`- название продукта
-`image: string;`- изображение продукта
-`description: string;` - описание товара
-`price: number | null;` - цена товара
-`buttonState: { stateIsNull: boolean; stateInBasket: boolean };` - состояние кнопки карточки товара
-`index: number;` - индекс товара в общем списке

Методы:
- `getStateIsNull()` - определяет нулевую цену товара

### Слой отображения
Все классы представления отвечают за отображение внутри контейнера (DOM-элемента) передаваемых в них данных

#### Класс Component
```
class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {
    }}
```
Класс является дженериком и родителем всех компонентов слоя представления. В дженерик принимает тип объекта, в котором данные будут передаваться в метод render для отображения данных в компоненте.

Конструктор:
- `constructor(protected readonly container: HTMLElement)` - конструктор принимает принимает DOM-элемент 
- `container: HTMLElement`-DOM-элемент контейнера

Методы:
- `toggleClass` - переключение класса
- `setHidden` - скрытие элемента
- `setVisible` - отображение элемента 
- `setText` - установка текста 
- `setImage` - установка изображения
- `setDisable` - деактивация кнопок
- `render` - отображение данных


#### Класс Modal
Реализует модальное окно. Устанавливает слушатели на клавиатуру для закрытия модального окна по ESC, клику на оверлей или кнопку-крестик. 
Конструктор: 
- `constructor(container: HTMLElement, protected events: IEvent)`- наследуется от класса Component и принимает контейнер, по которому будет создаваться модальное окно и инициироваться класс EventEmitter для осуществления событий

Поля класса:
- `_closeButton` - кнопка закрытия модального окна
- `_content` - конент модальнгого окна

Методы класса: 
- `open()` - открыть модальное окно
- `close()` - закрыть модальное окно
- `set сontent()` - получение контента для модального окна
- `render()` - отображение модального окна и его обновление

#### Класс Modal
Расширяет класс Modal. Реализует модальное окно для ввода данных для оформления заказа.
Конструктор: 
- `constructor(protected container: HTMLFormElement, protected events: IEvents)` 

Поля класса:
- `_submitButton` - кнопка подтверждения и отпраки данных
- `_formError` - объект хранящий все элементы для вывода ошибок под полями формы

Методы: 
- `onInputChange` - изменение данных
- `set valid`- установка состояния кнопки
- `set errors` - установка сообщения об ошибке
- `resetForm` - сброс значений всех полей формы
- `render` - отрисовка и обновление формы

#### Класс Basket
Предназначен для реализации модального окна с корзиной товаров, содержащей информацию о выбранных для оформления заказа товаров. При сабмите инициирует событие подтверждения данных и переходу к оформлению заказа.

Конструктор: 
- `constructor(protected container: HTMLElement, events: IEvents)` -  наследуется от абстрактного класса Component

Поля класса:
- `_list` - спосок выбранных товаров
- `_total` - общая сумма заказа
- `_orderButton` - кнопка подтверждения

Методы: 
- ` disabledOrderButton` - управление доступностью кнопки заказа
- `set items` - управление элементами корзины
- `set total()` - вывод общей стоимости товаров
- `render` - метод рендера для обновления данных корзины


#### Класс OrderForm
Предназначен для реализации модального окна с формой, содержащей поле ввода адреса и способов оплаты заказа. При сабмите инициирует событие подтверждения данных для отправки и оплаты заказа. Предоставляет методы для отображения ошибок и управления активностью кнопки сохранения.
Конструктор: 
- `constructor(container: HTMLElement, events: IEvents)` 

Поля класса:
- `_payment` - кнопка выбора способа оплаты
- `_address` - элемент формы для ввода адреса

Методы: 
- `onPaymentClick` - Метод обработки клика по кнопке оплаты
- `onPaymentChange` - Метод для обработки изменений выбора оплаты
- `set selectedPayment` - Метод для установки активной кнопки оплаты

#### Класс ContactsForm
Предназначен для реализации модального окна с формой, содержащей поля ввода телефона и эмейла. При сабмите инициирует событие подтверждения данных и переход на окно с уведомлением об успешном оформлении заказа.
Конструктор: 
- `constructor(container: HTMLElement, events: IEvents)` 
Поля класса:
- `_email` - поле ввода для почтового адресса пользователя
- `_phone` - поле ввода номера телефона пользователя

Методы: 
- `set email()` - устанавливает значение в поле почтового адреса 
- `set phone()` - устанавливает значение в поле контактного телефона 

#### Класс SuccessfulForm
Наследуется от класса Component. Предназначен для реализации модального окна с формой, содержащей сообщение об успешном оформлении заказа, в которое передаётся полная стоимость корзины. 

Конструктор: 
- `constructor(container: HTMLElement, protected events: IEvents,  actions?: ISuccessActions)`
Поля класса:
- `_closeButton` - кнопка закрытия формы при успешном оформлении заказа
- `_description` - сообщение об успешном оформлении заказа

Методы: 
- `set total()` - устанавливает значение в поле общей суммы заказа

#### Класс Card
Отвечает за отображение карточки, задавая в карточке данные названия товара, изображения, категории товара, описания товара, цены товара. В конструктор класса передается DOM элемент темплейта, что позволяет при необходимости формировать карточки разных вариантов верстки. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с
которыми пользователя генерируются соответствующие события.
Классы CardCatalog, CardOpen и CardBasket наследаются от класса Card.

Поля класса содержат элементы разметки элементов карточки. Конструктор, кроме темплейта принимает экземпляр 'EventEmitter" для инициации событий. \
Методы содержат функции по установлению необходимого значения для полей

#### Класс Page 
Используется для вывода карточек товаров на странице. Класс наследуется от абстрактного класса Component.
Конструктор: 
- `constructor(container: HTMLElement, protected events: IEvents) `
Поля класса:
- `_catalog` -  массив карточек продуктов
- `_counter` - счетчик элементов в корзине
- `_basketButton` - кнопка корзины
- `_wrapper` - главная страница

Методы: 
- `set catalog` - Установка элементов каталога
- `set counter` -  Установка значения счетчика
- `set wrapperLocked` -  Управление блокировкой страницы

### Слой коммуникации

#### Класс AppApi
Принимает в коструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Взаимодействие осуществляется за счет событий, генерируемых с помощью брокера событий и их обработчиков. 

Список событий, которые могут генерироваться в системе

-`order:open` - открыта форма заказа;
- `order:submit` - подтверждение данных для оплаты и доставки.
- `basket:open`- открытие модального окна с содержимым корзины.
- `success:finish` - окно успешного оформления заказа.
submit
- `modal:open` - открытие модального окна.
- `modal:close` - закрытие модального окна.
- `items:changed` - изменение массива карточек товаров.
- `basket:changed` - изменение содержимого корзины и оформление заказа из корзины
- `formErrors:change` - событие, сообщающее о необходимости валидации форм с вводом адреса и способа оплаты и с контактными данными.
- `card:select` - при клике на товар всплывает модальное окно с подробной информацией о товаре и возможностью добавления товара в корзину.
- `card:add` - при клике в модальном окне товара на кнопку "добавить в корзину" происходит добавление товара.
- `product:delete-from-basket` - при клике на кнопку удаления товара в корзине.
- `contacts:submit` - подтверждение контактных данных.
- `order:complete` - при открытии окна успешной оплаты.
- `/^(order|contacts)\..*:change/` - регулярное выражениедля всех изменений полей заказа.

