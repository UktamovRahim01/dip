import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

const Header = ({ user, onLogout }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // Состояние для показа/скрытия сайдбара
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false); // Состояние для отображения модального окна подтверждения выхода

  const toggleSidebar = () => {
    setIsSidebarVisible((prevState) => !prevState); // Переключаем видимость сайдбара
  };

  const toggleLogoutModal = () => {
    setIsLogoutModalVisible((prevState) => !prevState); // Переключаем модальное окно
  };

  const handleLogout = () => {
    onLogout();
    setIsLogoutModalVisible(false); // Закрыть модальное окно после выхода
  };

  return (
    <header className={styles.header}>
      {/* Основная навигация для больших экранов */}
      <nav className={styles.navbar}>
        <ul className={styles.navList}>
          <li><Link to="/">Главная</Link></li>
          {user && <li><Link to="/cart">Корзина</Link></li>}
          {user && <li><Link to="/contacts">Контакты</Link></li>}
        </ul>

        {/* Кнопка "Войти" или имя пользователя */}
        <div className={styles.userActions}>
          {user ? (
            <>
              <span className={styles.user} onClick={toggleLogoutModal}>Привет, {user.login}</span>
            </>
          ) : (
            <Link to="/auth">Войти</Link>
          )}
        </div>

        {/* Кнопка гамбургера для мобильных экранов */}
        <button className={styles.menuButton} onClick={toggleSidebar}>
          {isSidebarVisible ? "✖" : "☰"}
        </button>
      </nav>

      {/* Сайдбар (мобильная версия) */}
      <div className={`${styles.sidebar} ${isSidebarVisible ? styles.sidebarVisible : ""}`}>
        <ul className={styles.sidebarList}>
          <li><Link to="/" onClick={toggleSidebar}>Главная</Link></li>
          {user && <li><Link to="/cart" onClick={toggleSidebar}>Корзина</Link></li>}
          {user && <li><Link to="/contacts" onClick={toggleSidebar}>Контакты</Link></li>}
          {user && (
            <>
              <li className={styles.user} onClick={toggleLogoutModal}>Привет, {user.login}</li>
            </>
          )}
          {user ? (
            <li><button className={styles.logout} onClick={handleLogout}>Выйти</button></li>
          ) : (
            <li><Link to="/auth" onClick={toggleSidebar}>Войти</Link></li>
          )}
        </ul>

        {/* Крестик для закрытия сайдбара */}
        <button className={styles.closeButton} onClick={toggleSidebar}>✖</button>
      </div>

      {/* Модальное окно для подтверждения выхода */}
      {isLogoutModalVisible && (
        <div className={styles.logoutModal}>
          <div className={styles.modalContent}>
            <p>Вы уверены, что хотите выйти?</p>
            <div className={styles.modalButtons}>
              <button onClick={handleLogout}>Да</button>
              <button onClick={toggleLogoutModal}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
