import { Link } from "react-router-dom";
import styles from "./Header.module.css";

const Header = ({ user, onLogout }) => {
  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.navList}>
          <li><Link to="/">Главная</Link></li>
          {user && <li><Link to="/cart">Корзина</Link></li>}
          {user && <li><Link to="/contacts">Контакты</Link></li>}
          {user ? (
            <>
              <li className={styles.user}>Привет, {user.login}</li>
              <li><button className={styles.logout} onClick={onLogout}>Выйти</button></li>
            </>
          ) : (
            <li><Link to="/auth">Войти</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
