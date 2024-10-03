import React from 'react';
import styles from './ProductsSection.module.css';

const ProductsSection = () => {
  return (
    <section id="produtos" className={styles.productsSection}>
      <h2 className={styles.title}>Produtos</h2>
      <div className={styles.productsContainer}>
        <div className={styles.productCard}>Beterraba (nunca tem)</div>
        <div className={styles.productCard}>Couve</div>
        <div className={styles.productCard}>Rúcula</div>
        <div className={styles.productCard}>Cenoura</div>
      </div>
    </section>
  );
};

export default ProductsSection;