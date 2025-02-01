from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Float, DateTime, func, SmallInteger, Date, ARRAY, Numeric, Boolean, and_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker, joinedload
from datetime import datetime


Base = declarative_base()


### 📍 Таблица товаров (изделий)
class Product(Base):
    __tablename__ = "products"

    productid = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(String)
    price = Column(Integer, nullable=False)

    # Пол изделия (мужское / женское)
    gender = Column(String(10), nullable=False)  # "male" / "female"

    # Категория товара (например, "футболка", "брюки")
    category = Column(String(20))

    # Ссылка на изображение товара
    imglink = Column(String(255))

    # Состав материала (например, "100% хлопок", "Полиэстер 50%, хлопок 50%")
    composition = Column(String(255), nullable=True)

    # Связь с требуемыми мерками
    required_measurements = relationship("ProductMeasurements", back_populates="product")


### 📍 Таблица требуемых мерок для товара
class ProductMeasurements(Base):
    __tablename__ = "product_measurements"

    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey("products.productid"))

    # Название мерки, которую требует товар ("chest", "waist", "hips" и т. д.)
    measurement_name = Column(String(50))  
    required = Column(Boolean, default=True)  # Обязательна ли мерка

    product = relationship("Product", back_populates="required_measurements")

### 📍 Таблица заказов
class OrderItems(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.orderid"))
    product_id = Column(Integer, ForeignKey("products.productid"))

    # Количество товаров
    quantity = Column(Integer, nullable=False, default=1)

    # Цена за единицу товара (на момент покупки)
    unit_price = Column(Numeric(10, 2), nullable=False)

    # Связь с заказом и продуктом
    order = relationship("Orders", back_populates="order_items")
    product = relationship("Product")

### 📍 Таблица мерок, которые покупатель вводит при заказе
class OrderMeasurements(Base):
    __tablename__ = "order_measurements"

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.orderid"))

    # Универсальные мерки (общие для всех)
    chest = Column(Integer, nullable=True)  # Обхват груди
    waist = Column(Integer, nullable=True)  # Обхват талии
    hips = Column(Integer, nullable=True)  # Обхват бедер
    shoulder_width = Column(Integer, nullable=True)  # Ширина плеч

    # Мужские специфичные мерки
    chest_width = Column(Integer, nullable=True)  # Ширина грудной клетки
    seat_height = Column(Integer, nullable=True)  # Длина сидения

    # Женские специфичные мерки
    underbust_circumference = Column(Integer, nullable=True)  # Обхват под грудью
    bust_height = Column(Integer, nullable=True)  # Высота груди
    skirt_length = Column(Integer, nullable=True)  # Длина юбки от талии

    # Длина рук, ног (универсальные)
    arm_length = Column(Integer, nullable=True)  # Длина руки
    wrist_circumference = Column(Integer, nullable=True)  # Обхват запястья
    inseam_length = Column(Integer, nullable=True)  # Шаговая длина

    # Связь с заказом
    order = relationship("Orders", back_populates="measurements")


class Comments(Base):
    __tablename__ = 'comments'
    commentsid = Column(Integer, primary_key=True)
    productid = Column(Integer)
    customerid = Column(Integer, ForeignKey('customers.customerid'))
    text = Column(String())
    date = Column(DateTime, default=func.current_timestamp())
    customer = relationship("Customer", backref="comments")

class Basket(Base):
    __tablename__ = 'basket'
    customerid = Column(
        Integer,
        ForeignKey('customers.customerid', ondelete='CASCADE'),
        primary_key=True
    )
    productids = Column(ARRAY(Integer), nullable=False)
    customer = relationship("Customer", back_populates="baskets")

class Orders(Base):
    __tablename__ = "orders"
    
    orderid = Column(Integer, primary_key=True, index=True)
    customerid = Column(Integer, ForeignKey("customers.customerid"), index=True)

    # Итоговая цена (считается на основе OrderItems)
    totalprice = Column(Numeric(10, 2), nullable=False)

    # Дата оформления заказа
    orderdate = Column(Date, nullable=False)

    # Адрес доставки
    deliveryaddress = Column(String, nullable=False)

    # Дата доставки
    deliverydate = Column(Date, nullable=False)

    # Статус заказа ("в обработке", "готов к отправке", "доставлен")
    status = Column(String, nullable=False, default="pending")

    # Статус оплаты ("не оплачено", "оплачено", "возвращено")
    payment_status = Column(String, nullable=False, default="not_paid")

    # Связь с покупателем
    customer = relationship("Customer", back_populates="orders")

    # Связь с товарами в заказе (многие ко многим)
    order_items = relationship("OrderItems", back_populates="order", cascade="all, delete-orphan")

    # Связь с мерками (если требуется)
    measurements = relationship("OrderMeasurements", back_populates="order", uselist=False)


### 📍 Таблица клиентов (покупателей)
class Customer(Base):
    __tablename__ = "customers"

    customerid = Column(Integer, primary_key=True)
    firstname = Column(String(50))
    lastname = Column(String(50))
    email = Column(String(100), unique=True, nullable=False)
    address = Column(String(255), nullable=True)
    password = Column(String(), nullable=False)
    photo = Column(String(255), nullable=True)
    admin = Column(Boolean, default=False)

    # Связь с корзиной (существующая связь)
    baskets = relationship("Basket", back_populates="customer", passive_deletes=True)

    # Связь с заказами (чтобы получить все заказы клиента)
    orders = relationship("Orders", back_populates="customer")


SQLALCHEMY_DATABASE_URL = "postgresql://postgres:0@localhost/clothes_shop"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# def printCustomers():
#     with SessionLocal() as session:
#         customers = session.query(Customer).all()
#         print("Список всех заказчиков:")
#         for customer in customers:
#             print(f"ID: {customer.customerid}, Имя: {customer.firstname}, Фамилия: {customer.lastname}, Эл. почта: {customer.email}")

def add_product(name: str, description: str, price: float, gender: str, category: str, imglink: str, composition: str):
    with SessionLocal() as session:
        with session.begin():  # Начинаем транзакцию
            new_product = Product(
                name=name,
                description=description,
                price=price,
                gender=gender,
                category=category,
                imglink=imglink,
                composition = composition
            )
            session.add(new_product)
            session.flush()  # Получаем ID нового продукта
        session.refresh(new_product)  # Обновляем объект после коммита
    return new_product

def add_required_measurements(product_id: int, measurement_names: list):
    with SessionLocal() as session:
        with session.begin():
            for measurement in measurement_names:
                required_measurement = ProductMeasurements(
                    product_id=product_id,
                    measurement_name=measurement
                )
                session.add(required_measurement)


### 📍 Функция для обновления информации о товаре
def update_product(product_id: int, name: str = None, description: str = None, 
                   price: float = None, gender: str = None, category: str = None, imglink: str = None):
    with SessionLocal() as session:
        with session.begin():
            product = session.query(Product).filter(Product.productid == product_id).first()
            if not product:
                return None  # Если товара нет, возвращаем None

            # Обновляем только переданные параметры
            if name:
                product.name = name
            if description:
                product.description = description
            if price:
                product.price = price
            if gender:
                product.gender = gender
            if category:
                product.category = category
            if imglink:
                product.imglink = imglink

        session.refresh(product)  # Обновляем после коммита
    return product

### 📍 Функция для удаления товара
def delete_product(product_id: int):
    with SessionLocal() as session:
        with session.begin():
            product = session.query(Product).filter(Product.productid == product_id).first()
            if not product:
                return None  # Если товара нет, возвращаем None

            session.delete(product)
    return product_id

def addNewComment(prodID, userID, text):
    with SessionLocal() as session:
        with session.begin():
            new_comment = Comments(
                productid=prodID,
                customerid=userID,
                text=text
            )
            session.add(new_comment)
            session.commit()

def addNewCustomer(firstname, lastname, email, password):
    with SessionLocal() as session:
        with session.begin(): 
            new_customer = Customer(
                firstname=firstname,
                lastname=lastname,
                email=email,
                password=password
            )
            session.add(new_customer)
            session.commit()
            return True




SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()


def getAllProducts():
    all_products = []
    with SessionLocal() as session:
        products = session.query(Product).all()
        for product in products:
            product_dict = {
                "id": product.productid,
                "name": product.name,
                "description": product.description,
                "price": product.price,
                "category": product.category,
                "gender": product.gender,  # Учитываем пол изделия
                "imgLink": product.imglink,
                "required_measurements": [rm.measurement_name for rm in product.required_measurements]
            }
            all_products.append(product_dict)
    return all_products

def getProductByID(product_id):
    with SessionLocal() as session:
        product = session.query(Product).filter(Product.productid == product_id).first()
        if product:
            product_dict = {
                "id": product.productid,
                "name": product.name,
                "description": product.description,
                "price": product.price,
                "category": product.category,
                "gender": product.gender,  # Учитываем пол изделия
                "imgLink": product.imglink,
                "required_measurements": [rm.measurement_name for rm in product.required_measurements]
            }
            return product_dict
        return None



async def getCustomerByEmail(email):
    with SessionLocal() as session:
        customer = session.query(Customer).filter(Customer.email == email).first()
        if customer:
            customer_dict = {
                "id": customer.customerid,
                "firstname": customer.firstname,
                "lastname": customer.lastname,
                "email": customer.email,
                "address": customer.address,
                "password": customer.password,
            }
            customer_dict = {k: (v if v is not None else '') for k, v in customer_dict.items()}
            return customer_dict
        else:
            return None



def format_datetime(date_str):
    dt = datetime.fromisoformat(date_str)
    formatted_date = dt.strftime('%d.%m.%Y %H:%M')
    return formatted_date


def getCommentsByProdID(product_id):
    allComments = []
    with SessionLocal() as session:
        comments = session.query(Comments).options(joinedload(Comments.customer)).filter(Comments.productid == product_id)
        
        for comment in comments:
            if comment.customer:
                customer_name = f"{comment.customer.firstname} {comment.customer.lastname}"
                customer_photo = comment.customer.photo
                customer_id = comment.customer.customerid
                comments_dict = {
                    "id": comment.commentsid,
                    "prodId": comment.productid,
                    "customerid": customer_id,
                    "customerName": customer_name,
                    "customerPhoto": customer_photo,
                    "text": comment.text,
                    "date": format_datetime(str(comment.date))
                }
                allComments.append(comments_dict)
        return allComments


def add_products_to_basket(customer_id: int, product_ids: list[int]):
    with SessionLocal() as session:
        basket = session.query(Basket).filter(Basket.customerid == customer_id).first()
        
        if basket:
            updated_productids = basket.productids.copy()
            updated_productids.extend(product_ids)
            basket.productids = updated_productids
        else:
            basket = Basket(customerid=customer_id, productids=product_ids)
            session.add(basket)
        
        session.commit()



def get_products_from_basket(customer_id):
    with SessionLocal() as session:
        basket = session.query(Basket).filter(Basket.customerid == customer_id).first()
        if basket:
            return basket.productids
        else:
            return []

def delete_products_from_basket(customer_id: int, product_ids: list[int]):
    with SessionLocal() as session:
        basket = session.query(Basket).filter(Basket.customerid == customer_id).first()
        if basket:
            try:
                product_ids_to_remove = product_ids.copy()
                updated_productids = []
                
                for pid in basket.productids:
                    if pid in product_ids_to_remove:
                        product_ids_to_remove.remove(pid)
                    else:
                        updated_productids.append(pid)
                basket.productids = updated_productids
                session.commit()
            except Exception as e:
                session.rollback()
                print(f"Error deleting products from basket: {e}")
                raise
        else:
            raise ValueError("Basket not found for the given customer_id")


def delete_basket(customer_id: int):
    with SessionLocal() as session:
        basket = session.query(Basket).filter(Basket.customerid == customer_id).first()
        if basket:
            try:
                session.delete(basket)
                session.commit()
            except Exception as e:
                session.rollback()
                print(f"Error deleting basket: {e}")
                raise
        else:
            raise ValueError("Basket not found for the given customer_id")

def change_user_name(customer_id: int, new_name: dict):
    with SessionLocal() as session:
        customer = session.query(Customer).filter(Customer.customerid == customer_id).first()
        if customer:
            try:
                customer.firstname = new_name.firstName
                customer.lastname = new_name.lastName
                session.commit()
            except Exception as e:
                session.rollback()
                print(f"Error changing user name: {e}")
                raise
        else:
            raise ValueError("Customer not found for the given customer_id")

def change_user_address(customer_id: int, new_address: dict):
    with SessionLocal() as session:
        customer = session.query(Customer).filter(Customer.customerid == customer_id).first()
        if customer:
            try:
                customer.address = new_address.address
                session.commit()
            except Exception as e:
                session.rollback()
                print(f"Error changing user address: {e}")
                raise
        else:
            raise ValueError("Customer not found for the given customer_id")
        
def change_user_photo(customer_id: int, new_photo: dict):
    with SessionLocal() as session:
        customer = session.query(Customer).filter(Customer.customerid == customer_id).first()
        if customer:
            try:
                customer.photo = new_photo.photo
                session.commit()
            except Exception as e:
                session.rollback()
                print(f"Error changing user photo: {e}")
                raise
        else:
            raise ValueError("Customer not found for the given customer_id")


def get_user_orders(customer_id: int, admin: bool):
    with SessionLocal() as session:
        query = session.query(
            Orders.orderid,
            Orders.totalprice,
            Orders.orderdate,
            Orders.deliveryaddress,
            Orders.deliverydate,
            Orders.status
        ).filter(Orders.customerid == customer_id)

        # Если пользователь не админ, скрываем заказы со статусом "Deleted" или "Error"
        if not admin:
            query = query.filter(Orders.status.notin_(['Deleted', 'Error']))

        # Загружаем заказы
        orders = query.options(joinedload(Orders.order_items)).all()

        orders_list = []
        for order in orders:
            # Получаем список ID товаров из OrderItems
            product_ids = [item.product_id for item in order.order_items]

            orders_list.append({
                'orderid': order.orderid,
                'productids': product_ids,  # Теперь список ID товаров берется из OrderItems
                'totalprice': float(order.totalprice),  # Приводим Decimal к float
                'orderdate': datetime.fromisoformat(str(order.orderdate)).strftime('%d.%m.%Y'),
                'deliveryaddress': order.deliveryaddress,
                'deliverydate': datetime.fromisoformat(str(order.deliverydate)).strftime('%d.%m.%Y'),
                'status': order.status
            })

        return orders_list



def add_order(customerid: int, product_data: list[dict], deliveryaddress: str, orderdate: datetime, deliverydate: datetime, status: str):
    """
    Добавляет заказ в базу данных.
    
    :param customerid: ID покупателя.
    :param product_data: Список товаров (список словарей с `product_id` и `quantity`).
    :param deliveryaddress: Адрес доставки.
    :param orderdate: Дата заказа.
    :param deliverydate: Дата доставки.
    :param status: Статус заказа.
    """
    with SessionLocal() as session:
        with session.begin():
            # Создаем новый заказ
            new_order = Orders(
                customerid=customerid,
                totalprice=0,  # Посчитаем позже
                orderdate=orderdate,
                deliveryaddress=deliveryaddress,
                deliverydate=deliverydate,
                status=status
            )
            session.add(new_order)
            session.flush()  # Получаем ID заказа до коммита

            total_price = 0  # Общая стоимость заказа
            required_measurements = {}  # Храним мерки, если нужны

            # Добавляем товары в заказ
            for product_entry in product_data:
                product_id = product_entry["product_id"]
                quantity = product_entry["quantity"]

                product = session.query(Product).filter(Product.productid == product_id).first()
                if not product:
                    raise ValueError(f"Товар с ID {product_id} не найден!")

                # Добавляем товар в OrderItems
                order_item = OrderItems(
                    order_id=new_order.orderid,
                    product_id=product_id,
                    quantity=quantity,
                    unit_price=product.price
                )
                session.add(order_item)

                # Считаем финальную цену
                total_price += product.price * quantity

                # Проверяем, какие мерки нужны
                for measurement in product.required_measurements:
                    required_measurements[measurement.measurement_name] = None  # Значение пока пустое

            # Обновляем totalprice заказа
            new_order.totalprice = total_price
            session.flush()

            # Если у товаров есть мерки, создаем пустую запись OrderMeasurements
            if required_measurements:
                order_measurements = OrderMeasurements(
                    order_id=new_order.orderid,
                    **required_measurements  # Добавляем нужные мерки с пустыми значениями
                )
                session.add(order_measurements)

        session.refresh(new_order)
        return new_order

    
def get_user_photo(UserID):
    with SessionLocal() as session:
        customer = session.query(Customer).filter(Customer.customerid == UserID).first()
        if customer:
            return customer.photo
        else:
            return None

def set_status_order(orderID: int, status: str):
    """
    Обновляет статус заказа.

    :param orderID: ID заказа.
    :param status: Новый статус заказа.
    :return: Обновленный объект заказа.
    """
    valid_statuses = ["pending", "processing", "shipped", "delivered", "canceled", "returned"]
    
    if status not in valid_statuses:
        raise ValueError(f"Некорректный статус: {status}. Доступные статусы: {valid_statuses}")

    with SessionLocal() as session:
        with session.begin():  # Безопасная транзакция
            order = session.query(Orders).filter(Orders.orderid == orderID).first()

            if not order:
                raise ValueError(f"Заказ с ID {orderID} не найден.")

            order.status = status
            session.flush()

        session.refresh(order)
        return order

        
def is_user_admin(customer_id: int):
    with SessionLocal() as session:
        user = session.query(Customer.admin).filter(Customer.customerid == customer_id).first()
        if user:
            return user.admin
        else:
            raise ValueError("Customer not found for the given customer_id")
        
def get_all_users(start: int, count: int):
    """
    Получает список пользователей с пагинацией.

    :param start: Сколько записей пропустить (начало выборки).
    :param count: Сколько записей получить.
    :return: Словарь с пользователями и общим количеством записей.
    """
    with SessionLocal() as session:
        with session.begin():  # Безопасная транзакция
            total_count = session.query(Customer).count()
            users = (
                session.query(Customer)
                .order_by(Customer.customerid)  # Упорядочиваем для стабильности
                .offset(start)
                .limit(count)
                .all()
            )

        users_data = [
            {
                "customerid": user.customerid,
                "firstname": user.firstname,
                "lastname": user.lastname,
                "email": user.email,
                "photo": user.photo,
                "is_admin": bool(user.admin),  # Приводим к bool, если в БД могут быть 0/1
            }
            for user in users
        ]

        return {"users": users_data, "total_count": total_count}


def get_all_orders(start: int, count: int):
    """
    Получает список всех заказов с пагинацией.

    :param start: Количество заказов, которые нужно пропустить.
    :param count: Количество заказов, которые нужно вернуть.
    :return: Список заказов и общее количество заказов.
    """
    with SessionLocal() as session:
        with session.begin():  # Безопасная транзакция
            total_count = session.query(Orders).count()

            orders = (
                session.query(Orders)
                .order_by(Orders.orderdate.desc())  # Сортируем по дате (сначала новые)
                .offset(start)
                .limit(count)
                .options(joinedload(Orders.order_items))  # Загружаем связанные товары
                .all()
            )

        orders_data = []
        for order in orders:
            product_ids = [item.product_id for item in order.order_items]  # Собираем ID товаров

            order_data = {
                'orderid': order.orderid,
                'customerid': order.customerid,
                'productids': product_ids,  # Теперь берем товары из OrderItems
                'totalprice': float(order.totalprice),  # Приводим Decimal к float
                'orderdate': datetime.fromisoformat(str(order.orderdate)).strftime('%d.%m.%Y'),
                'deliveryaddress': order.deliveryaddress,
                'deliverydate': datetime.fromisoformat(str(order.deliverydate)).strftime('%d.%m.%Y'),
                'status': order.status
            }
            orders_data.append(order_data)

        return {"orders": orders_data, "total_count": total_count}

    


def get_stats():
    with SessionLocal() as session:
        total_earnings = session.query(func.sum(Orders.totalprice)).filter(Orders.status != 'Error').scalar()
        products_in_transit = session.query(func.sum(func.array_length(Orders.productids, 1))) \
                                     .filter(Orders.status == 'In Transit') \
                                     .scalar()
        delivered_products = session.query(func.sum(func.array_length(Orders.productids, 1))) \
                                    .filter(Orders.status.in_(['Completed', 'Deleted'])) \
                                    .scalar()
        total_users = session.query(func.count(Customer.customerid)).scalar()

        total_orders = session.query(func.count(Orders.orderid)).scalar()
        return {
            "total_earnings": total_earnings or 0,
            "products_in_transit": products_in_transit or 0,
            "delivered_products": delivered_products or 0,
            "total_users": total_users or 0,
            "total_orders": total_orders or 0,
        }
    
def delete_product_by_id(product_id: int):
    """
    Удаляет продукт из базы данных.

    :param product_id: ID продукта, который нужно удалить.
    :return: ID удаленного продукта.
    """
    with SessionLocal() as session:
        with session.begin():  # Безопасная транзакция
            product = session.query(Product).filter(Product.productid == product_id).first()
            if not product:
                raise ValueError(f"Продукт с ID {product_id} не найден.")

            # Удаляем связанные мерки продукта (если есть)
            session.query(ProductMeasurements).filter(ProductMeasurements.product_id == product_id).delete()

            # Удаляем сам продукт
            session.delete(product)

        return product_id  # Возвращаем ID удаленного товара



def update_order_status_on_login(customer_id: int):
    """
    Обновляет статус заказов на 'Completed', если срок доставки уже прошел.

    :param customer_id: ID покупателя.
    :return: Количество обновленных заказов.
    """
    with SessionLocal() as session:
        with session.begin():  # Безопасная транзакция
            current_date = datetime.now().date()

            # Обновляем заказы одним SQL-запросом
            updated_orders = (
                session.query(Orders)
                .filter(
                    and_(
                        Orders.customerid == customer_id,
                        Orders.deliverydate <= current_date,
                        Orders.status == 'In Transit'
                    )
                )
                .update({Orders.status: 'Completed'}, synchronize_session="fetch")
            )

        return updated_orders  # Возвращаем количество обновленных заказов

def get_customer_by_id(id: int, admin: bool):
    """
    Получает информацию о пользователе по ID.

    :param id: ID пользователя.
    :param admin: Является ли запрашивающий админом.
    :return: Словарь с данными пользователя или None, если не найден.
    """
    with SessionLocal() as session:
        with session.begin():  # Безопасная транзакция
            customer = session.get(Customer, id)  # Оптимальный метод для PK
            
            if not customer:
                return None

            # Формируем ответ в зависимости от роли
            customer_dict = {
                "firstname": customer.firstname,
                "lastname": customer.lastname,
                "photo": customer.photo,
                "is_admin": customer.admin  # Всегда передаем, полезно для UI
            }

            if admin:
                customer_dict.update({
                    "email": customer.email,
                    "address": customer.address,
                })

            return customer_dict



def delete_user_by_id(id: int):
    """
    Удаляет пользователя по ID.

    :param id: ID пользователя.
    :return: True, если пользователь удален, иначе False.
    """
    with SessionLocal() as session:
        with session.begin():  # Безопасная транзакция
            user = session.get(Customer, id)  # Оптимальный метод для поиска по PRIMARY KEY
            if not user:
                return False  # Если пользователь не найден

            # Удаляем связанные записи (корзина, мерки и т.д.)
            session.query(Basket).filter(Basket.customerid == id).delete()
            session.query(Measurements).filter(Measurements.customer_id == id).delete()

            session.delete(user)  # Удаляем пользователя

        return True  # Подтверждаем успешное удаление
