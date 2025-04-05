import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import products from "../data/products";
import styles from "./Home.module.css";

const Home = () => {
  const [categoryData, setCategoryData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const groupedData = {};

    products.forEach((product) => {
      if (!groupedData[product.category]) {
        groupedData[product.category] = {};
      }

      // Добавляем только первый товар из каждой подкатегории
      if (!groupedData[product.category][product.subcategory]) {
        groupedData[product.category][product.subcategory] = product;
      }
    });

    setCategoryData(Object.entries(groupedData));
  }, []);

  const handleProductClick = (id) => {
    localStorage.setItem("selectedProduct", id);
    navigate("/product");
  };

  return (
    <div className={styles.container}>
      <h1>Каталог товаров</h1>

      {categoryData.map(([category, subcategories]) => (
        <div key={category} className={styles.categoryBlock}>
          <h2>{category}</h2>
          <Swiper spaceBetween={15} breakpoints={{
        320: { slidesPerView: 2 },
        480: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }}>
            {Object.values(subcategories).map((product) => (
              <SwiperSlide key={product.id} onClick={() => handleProductClick(product.id)}>
                <div className={styles.productCard}>
                  <img src={product.image} alt={product.name} className={styles.productImage} />
                  <p>{product.subcategory}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}
    </div>
  );
};

export default Home;
