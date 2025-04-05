import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

const Header = ({ user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false); // Состояние для отслеживания состояния меню
  const [confirmLogout, setConfirmLogout] = useState(false); // Состояние для отображения подтверждения выхода

  const toggleMenu = () => {
    setMenuOpen((prevState) => !prevState); // Переключаем состояние меню
  };

  const handleLogoutClick = () => {
    setConfirmLogout(true); // Показываем окно с подтверждением выхода
  };

  const confirmAndLogout = () => {
    onLogout(); // Вызов функции выхода
    setConfirmLogout(false); // Скрыть окно подтверждения
    setMenuOpen(false); // Закрыть меню после выхода
  };

  const cancelLogout = () => {
    setConfirmLogout(false); // Скрыть окно подтверждения
  };

  return (
    <header className={styles.header}>
      {/* Бургер-меню для мобильных устройств */}
      <div className={`${styles.burgerMenu} ${menuOpen ? styles.open : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Навигационные элементы */}
      <ul className={`${styles.navList} ${menuOpen ? styles.open : ""}`}>
        <li><Link to="/">Главная</Link></li>
        {user && <li><Link to="/cart">Корзина</Link></li>}
        {user && <li><Link to="/contacts">Контакты</Link></li>}

        {/* Логика для отображения логина и кнопки выхода */}
        {user ? (
          <>
            <li className={styles.user} onClick={handleLogoutClick}>
              Привет, {user.login}
            </li>
          </>
        ) : (
          <li><Link to="/auth">Войти</Link></li>
        )}
      </ul>

      {/* Окно с подтверждением выхода */}
      {confirmLogout && (
        <div className={styles.confirmLogout}>
          <p>Вы уверены, что хотите выйти?</p>
          <button onClick={confirmAndLogout}>Да, выйти</button>
          <button onClick={cancelLogout}>Отмена</button>
        </div>
      )}
    </header>
  );
};

export default Header;
