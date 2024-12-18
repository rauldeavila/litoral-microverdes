import React from 'react';
import styles from './WhoWeAreSection.module.css';

const WhoWeAreSection = () => {
  return (
    <section className={styles.whoWeAreSection}>
      <h2 className={styles.title}>Who We Are</h2>
      <div className={styles.contentContainer}>
        <img
          src="/images/microgreens-shop.jpg"
          alt="Microgreens Shop"
          className={styles.image}
        />
        <div className={styles.text}>
          <p>We are a company specialized in the cultivation of microgreens, edible flowers, and other specialty greens.</p>
          <p>Located in the heart of the city, we are dedicated to providing fresh, nutritious, and high-quality microgreens to our community.</p>
          <p>
            Our mission is to bring freshness, nutrition, and flavor to your daily diet through sustainably grown microgreens.
          </p>
          <p>
            We take pride in cultivating our microgreens with care and dedication, from seed selection to harvest, ensuring the highest quality.
          </p>
          <p>
            Whether you are a professional chef or a culinary enthusiast, our microgreens will be your perfect partners in creating delicious dishes.
          </p>
          <p>
            Mission:
            Our mission is to provide fresh, nutritious, and high-quality microgreens, grown sustainably, to enrich diets, promote health and well-being, and inspire culinary creativity.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreSection;
