import React from 'react';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroContent}>
        <img
          src="/images/hero-image.jpg"
          alt="Hero Image"
          className={styles.heroImage}
        />
        <div className={styles.heroText}>
          <p>Em construção</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;