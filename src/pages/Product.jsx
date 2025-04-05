import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import products from "../data/products";
import styles from "./Product.module.css";

const Product = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [volumes, setVolumes] = useState([]);
  const [varieties, setVarieties] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();


  useEffect(() => {
    const productId = localStorage.getItem("selectedProduct");
    if (!productId) return navigate("/");

    const currentProduct = products.find((p) => p.id === Number(productId));
    if (!currentProduct) return navigate("/");

    setSelectedProduct(currentProduct);
    updateRelatedProducts(currentProduct);
  }, [navigate]);

  const updateRelatedProducts = (product) => {
    const uniqueNames = new Set();
    setFilteredProducts(
      products.filter(
        (p) =>
          p.subcategory === product.subcategory &&
          (!uniqueNames.has(p.name) ? uniqueNames.add(p.name) : false)
      )
    );

    const uniqueVolumes = new Set();
    setVolumes(
      products.filter(
        (p) =>
          p.name === product.name &&
          (!uniqueVolumes.has(p.volume) ? uniqueVolumes.add(p.volume) : false)
      )
    );

    const uniqueVarieties = new Set();
    setVarieties(
      products.filter(
        (p) =>
          p.name === product.name &&
          p.volume === product.volume &&
          (!uniqueVarieties.has(p.variety) ? uniqueVarieties.add(p.variety) : false)
      )
    );
  };

  const handleProductSelect = (id) => {
    const newProduct = products.find((p) => p.id === id);
    if (newProduct) {
      setSelectedProduct(newProduct);
      updateRelatedProducts(newProduct);
      localStorage.setItem("selectedProduct", id); // Для сохранения выбора между сессиями
    }
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find((item) => item.id === selectedProduct.id);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.push({ id: selectedProduct.id, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Товар добавлен в корзину!");
  };

  const isOutOfStock = (filteredArray) =>
    filteredArray.every((p) => p.stock === 0);

  if (!selectedProduct) return null;

  return (
    <div className={styles.productContainer}>
      <h1>{selectedProduct.name}</h1>

      <div className={styles.productDetails}>
        <img src={selectedProduct.image} alt={selectedProduct.name} className={styles.mainImage} />
        <p className={styles.productDescription}>{selectedProduct.description}</p>
        <p><strong>Цена:</strong> {selectedProduct.price} ₽</p>
      </div>

      {/* Свайпер с товарами той же подкатегории */}
      <h2>Другие товары из категории "{selectedProduct.subcategory}"</h2>
      <Swiper spaceBetween={15} breakpoints={{
        320: { slidesPerView: 2 },
        480: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }}>
        {filteredProducts.map((product) => (
          <SwiperSlide key={product.id} onClick={() => handleProductSelect(product.id)}>
            <div
              className={`${styles.productCard} ${product.name === selectedProduct.name ? styles.selected : ""} ${isOutOfStock(products.filter(p => p.name === product.name)) ? styles.outOfStock : ""}`}
            >
              <img src={product.image} alt={product.name} className={styles.productImage} />
              <p>{product.name}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Свайпер с объемами */}
      <h2>Доступные объемы</h2>
      <Swiper spaceBetween={15} breakpoints={{
        320: { slidesPerView: 4 },
        480: { slidesPerView: 4 },
        768: { slidesPerView: 5 },
        1024: { slidesPerView: 6 },
      }}>
        {volumes.map((product) => (
          <SwiperSlide key={product.id} onClick={() => handleProductSelect(product.id)}>
            <div
              className={`${styles.volumeCard} ${(product.name === selectedProduct.name && product.volume === selectedProduct.volume) ? styles.selected : ""} ${isOutOfStock(products.filter(p => p.name === product.name && p.volume === product.volume)) ? styles.outOfStock : ""}`}
            >
              <p>{product.volume} {product.meas}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Свайпер с разновидностями */}
      {varieties.length > 1 && (
        <>
          <h2>Доступные разновидности</h2>
          <Swiper spaceBetween={15} breakpoints={{
            320: { slidesPerView: 2 },
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}>
            {varieties.map((product) => (
              <SwiperSlide key={product.id} onClick={() => handleProductSelect(product.id)}>
                <div
                  className={`${styles.varietyCard} ${product.id === selectedProduct.id ? styles.selected : ""} ${isOutOfStock(products.filter(p => p.name === product.name && p.volume === product.volume && p.variety === product.variety)) ? styles.outOfStock : ""}`}
                >
                  <img src={product.image} alt={product.variety} className={styles.varietyImage} />
                  <p>{product.variety}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}

      {/* Блок количества и добавления в корзину */}
      <div className={styles.centerContainer}>
        <p><strong>Количество в наличии:</strong> {selectedProduct.stock}</p>
        <div className={styles.quantityContainer}>
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.min(selectedProduct.stock, Number(e.target.value)))}
            min="1"
            max={selectedProduct.stock}
          />
          <button onClick={() => setQuantity((q) => Math.min(selectedProduct.stock, q + 1))}>+</button>
        </div>
        <button className={styles.addToCartButton} onClick={handleAddToCart} disabled={selectedProduct.stock === 0}>
          Добавить в корзину
        </button>
      </div>
    </div>
  );
};



export default Product;
