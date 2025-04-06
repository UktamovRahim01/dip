import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import products from "../data/products";
import { stores } from "../data/stores"; // Импортируем данные о магазинах
import styles from "./Cart.module.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null); // Состояние для выбранного магазина
  const navigate = useNavigate();

  useEffect(() => {
    // Загрузка корзины из localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemsWithDetails = storedCart.map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);
      return product ? { ...product, quantity: cartItem.quantity } : null;
    }).filter(item => item !== null);
    setCartItems(itemsWithDetails);

    // Устанавливаем магазин по умолчанию (первый из списка)
    if (stores.length > 0) {
      setSelectedStore(stores[0]);
    }
  }, []);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(newQuantity, item.stock) } : item
      )
    );
    updateLocalStorage(id, newQuantity);
  };

  const updateLocalStorage = (id, quantity) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { id: item.id, quantity } : { id: item.id, quantity: item.quantity }
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemove = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleCheckout = () => {
    if (!selectedStore) {
      alert("Выберите магазин для оформления заказа!");
      return;
    }

    const userId = localStorage.getItem("userId") || "guest"; // ID пользователя (или гость)

    const newOrder = {
      id: Date.now(), // Уникальный ID заказа
      userId,
      store: selectedStore,
      items: cartItems,
      total: totalPrice,
      date: new Date().toLocaleString(),
    };

    // Загружаем старые заказы, добавляем новый
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    existingOrders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(existingOrders));

    // Очищаем корзину после оформления
    localStorage.removeItem("cart");
    setCartItems([]);
    alert("Заказ оформлен!");
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className={styles.cartContainer}>
      <h1>Корзина</h1>
      {cartItems.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <>
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <img src={item.image} alt={item.name} className={styles.productImage} />
                <div className={styles.itemDetails}>
                  <h2>{item.name}</h2>
                  <p>{item.volume}, {item.variety}</p>
                  <p><strong>Цена:</strong> {item.price} ₽</p>
                  <p><strong>В наличии:</strong> {item.stock}</p>
                  <div className={styles.quantityControl}>
                    <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                    <input type="number" value={item.quantity} onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))} min="1" max={item.stock} />
                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button className={styles.removeButton} onClick={() => handleRemove(item.id)}>Удалить</button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.storeSelectContainer}>
            <label className={styles.storeSelectLabel}>Выберите магазин</label>
            <select
              className={styles.storeSelect}
              value={selectedStore?.storeName || ''}
              onChange={(e) => {
                const selectedStoreName = e.target.value;
                const store = stores.find(s => s.storeName === selectedStoreName);
                setSelectedStore(store);
              }}
            >
              {stores.map((store) => (
                <option key={store.storeName} value={store.storeName}>
                  {store.storeName} {store.owner}
                </option>
              ))}
            </select>
          </div>

          <h2 className={styles.totalPrice}>Общая сумма: {totalPrice} ₽</h2>
          <button className={styles.checkoutButton} onClick={handleCheckout}>Оформить заказ</button>
        </>
      )}
    </div>
  );
};

export default Cart;
