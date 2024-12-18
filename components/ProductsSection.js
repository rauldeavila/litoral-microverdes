import React from 'react';
import styles from './ProductsSection.module.css';

const ProductsSection = () => {
  return (
    <section id="produtos" className={styles.productsSection}>
      <h2 className={styles.title}>Produtos</h2>
      <div className={styles.productsContainer}>
        <div className={styles.productCard}>Sunflower Shoots</div>
        <div className={styles.productCard}>Pea Shoots</div>
        <div className={styles.productCard}>Radish Microgreens</div>
        <div className={styles.productCard}>Broccoli Microgreens</div>
      </div>
    </section>
  );
};

export default ProductsSection;
