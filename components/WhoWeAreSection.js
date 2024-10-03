import React from 'react';
import styles from './WhoWeAreSection.module.css';

const WhoWeAreSection = () => {
  return (
    <section className={styles.whoWeAreSection}>
      <h2 className={styles.title}>Quem Somos?</h2>
      <div className={styles.contentContainer}>
        <img
          src="/images/lori-karine-lori.jpg"
          alt="Litoral Microverdes"
          className={styles.image}
        />
        <div className={styles.text}>
          <p>Somos uma empresa especializada no cultivo de microverdes, PANCS e flores comestíveis.</p>
          <p>Estamos localizados na cidade de Capão da Canoa, Litoral Norte do Rio Grande do Sul.</p>
          <p>
            Nossa missão é levar frescor, nutrição e sabor para a sua alimentação diária, através de
            microverdes de alta qualidade, cultivados de forma sustentável.
          </p>
          <p>
            Orgulhamo-nos de cultivar nossos microverdes com dedicação e cuidado, desde a seleção
            das sementes até o momento da colheita, prezando sempre pela qualidade.
          </p>
          <p>
            Queremos inspirar sua criatividade culinária, seja você um chef de cozinha profissional ou
            um entusiasta da culinária, nossos microverdes serão seus parceiros perfeitos na criação
            de pratos.
          </p>
          <p>
            Missão:
            Nossa missão é fornecer microverdes frescos, nutritivos e de alta qualidade,
            cultivados de forma sustentável, para enriquecer a alimentação, promover a saúde e o bem-estar,
            além de claro, inspirar a criatividade culinária.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreSection;