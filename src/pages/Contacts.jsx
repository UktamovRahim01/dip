import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet"; // Импортируем библиотеку Leaflet
import "leaflet/dist/leaflet.css";
import { stores } from "../data/stores"; // Массив с данными о магазинах
import styles from "./Contacts.module.css";

const Contacts = () => {
  const [userLocation, setUserLocation] = useState([39.659176, 67.006111]); // Начальная позиция (по умолчанию Лондон)
  const [loading, setLoading] = useState(true); // Флаг загрузки

  // Получаем текущее местоположение пользователя
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setLoading(false);
        },
        () => {
          alert("Не удалось получить местоположение");
          setLoading(false);
        }
      );
    }
  }, []);

  return (

    <div className={styles.contactsContainer}>
      <h1>Контакты</h1>

      <div className={styles.mapContainer}>
        <MapContainer
          center={userLocation}
          zoom={13}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "500px" }}
          >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          
          {/* Отображаем метки магазинов */}
          {stores.map((store) => (
            <Marker
            key={store.storeName}
            position={[store.latitude, store.longitude]}
            icon={L.icon({
              iconUrl: "/marker-icon.png", // Можно использовать собственную иконку
              iconSize: [32, 32],
            })}
            >
              <Popup>
                <strong>{store.storeName}</strong>
                <strong>{" /" + store.owner}</strong>
                <br />
                {store.address}
              </Popup>
            </Marker>
          ))}

          {/* Если местоположение еще не загружено, отображаем сообщение */}
          {!loading && (
            <Marker position={userLocation}>
              <Popup>Ваше местоположение</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Contacts;
