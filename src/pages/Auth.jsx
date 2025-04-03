import { useState } from "react";
import users from "../data/users";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";

const Auth = ({ onLogin }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const user = users.find((user) => user.login === login && user.password === password);
    if (user) {
      onLogin(user);
      navigate("/");
    } else {
      setMessage("Неверный логин или пароль.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Вход</h2>
      <input type="text" placeholder="Логин" value={login} onChange={(e) => setLogin(e.target.value)} />
      <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Войти</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Auth;
